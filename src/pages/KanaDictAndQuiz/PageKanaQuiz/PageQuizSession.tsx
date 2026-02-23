// 本实现直接引入了 TestStudy 中的大量组件和样式
// page 之间这样引来引去时很危险的。待整理。

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  type CSSProperties,
} from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CircleX, CircleEqual } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

import { QuizCompletionScreen } from './QuizCompletionScreen';
// --- 复用 TestStudy 中的组件 ---
import { SegmentedProgressBar } from '../../TestStudySession/SegmentedProgressBar';
import { KanaCard } from '../../TestStudySession/Cards/KanaCard';
import { WordCard } from '../../TestStudySession/Cards/WordCard';
import { QuizCard } from '../../TestStudySession/Cards/QuizCard';
import BottomSheet from '../../../components/BottomSheet';
import { StudySessionSetting } from '../../TestStudySession/StudySessionSetting';
// --- 复用 TestStudy 中的样式 ---
import styles from '../../TestStudySession/TestStudySession.module.css';

import {
  TinderCard,
  type TinderCardRef,
} from '../../../components/TinderCard/index';
import { QuizActionButtons } from '../../../components/QuizActionButtons';

// --- Hooks & Context ---
import { useSound } from '../../../hooks/useSound';
import { useTTS } from '../../../hooks/useTTS';
import { useSettings } from '../../../context/SettingsContext';
import { useMistakes } from '../../../context/MistakeContext';

// --- 本地逻辑 ---
import { generateQuizQueue, getAnswerCard, type LessonCard } from './quizLogic';

const MAX_STACK_SIZE = 3;

export const PageQuizSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { recordQuizResult } = useMistakes();

  // 🔥 获取来源模式
  const mode = location.state?.mode; // 'mistake_review' | 'manual' | undefined

  // ============================================================
  // 🔥 防呆守卫 (Safety Guard)
  // ============================================================
  // 获取原始参数
  const rawTargetIds = location.state?.targetIds;

  // 如果参数不存在或为空（说明是刷新页面或非法访问），直接踢回选择页
  // replace={true} 防止用户点后退按钮死循环
  if (!rawTargetIds || rawTargetIds.length === 0) {
    return <Navigate to="/quiz/selection" replace />;
  }

  // 1. 此时 TypeScript 知道 targetIds 肯定存在了，放心使用
  const targetIds = rawTargetIds as string[];

  // 2. 初始化队列
  const [queue, setQueue] = useState<LessonCard[]>(() =>
    generateQuizQueue(targetIds)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // 进度条逻辑重构
  // 统计“题目组数”而非卡片数。每组题必然有一张 Correct 卡，以此为基准计算总数。
  // 总题数 (用于进度条和正确率)：统计所有 isCorrect 的卡片
  const [totalGroups] = useState(() => queue.filter((c) => c.isCorrect).length);

  // 单词数 (用于结果展示)：统计 quizType 为 'WORD' 的题目数量
  //    注意：这里假设每个单词只生成了一组 'WORD' 类型的题目
  const [wordCount] = useState(
    () => queue.filter((c) => c.isCorrect && c.quizType === 'WORD').length
  );
  // 记录已完成的 Group ID (无论对错)
  const [completedGroups, setCompletedGroups] = useState<Set<string>>(
    new Set()
  );

  // 统计数据
  const startTimeRef = useRef(Date.now()); // 记录进入页面的时间戳
  const [mistakeCount, setMistakeCount] = useState(0); // 记录错误次数

  // 🔥 记录本场 Session 中每个 ID 的判定状态
  // 'success' = 已经给过奖励了，后面再对也不加分
  // 'fail' = 已经错了，后面再对也不算数
  const sessionResults = useRef<Record<string, 'success' | 'fail'>>({});

  // 结果暂存区 (用于实现“中途退出不保存”)
  // 只有当 isFinished 为 true 时，才把这里面的数据提交给数据库
  const resultsBuffer = useRef<{ id: string; isCorrect: boolean }[]>([]);
  // 防止 React StrictMode 或重渲染导致重复提交
  const hasCommitted = useRef(false);

  // 用于记录切后台的时间点
  const backgroundTimeRef = useRef<number | null>(null);

  // 监听 App 后台状态 (安全期逻辑)
  useEffect(() => {
    // 建立监听器
    const listenerPromise = App.addListener(
      'appStateChange',
      ({ isActive }) => {
        if (!isActive) {
          // 🌑 切到后台：记录当前时间戳
          backgroundTimeRef.current = Date.now();
        } else {
          // ☀️ 切回前台：检查离开了多久
          if (backgroundTimeRef.current) {
            const timeGone = Date.now() - backgroundTimeRef.current;

            // 🔥 阈值设定：10秒 (10000ms)
            // 如果离开超过 10 秒，视为放弃，强制踢回首页
            if (timeGone > 10 * 1000) {
              console.log('User was away too long (>10s). Session terminated.');
              // 使用 replace: true 防止用户点返回键又回到这就尴尬了
              navigate('/', { replace: true });
            }

            // 重置计时器 (如果小于10秒，就当无事发生)
            backgroundTimeRef.current = null;
          }
        }
      }
    );

    // 清理监听器
    return () => {
      listenerPromise.then((pluginListener) => pluginListener.remove());
    };
  }, [navigate]);

  // 状态
  const [isShaking, setIsShaking] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const cardRef = useRef<TinderCardRef>(null);

  // 设置 & 音效
  const { soundEffect, hapticFeedback, autoAudio, toggleSetting } =
    useSettings();

  const playSound = useSound();
  const { speak, cancel } = useTTS();

  const currentItem = queue[currentIndex];
  // 结束条件：所有题目组都处理完了 (用 completedGroups 判定更准，或者简单的 index 越界)
  // 这里保留 index 越界作为最终兜底，但进度条展示用 completedGroups
  const isFinished = currentIndex >= queue.length;

  // --- 辅助函数 ---
  const triggerSound = (type: Parameters<typeof playSound>[0]) => {
    if (soundEffect) playSound(type);
  };

  const triggerHaptic = async (style: ImpactStyle) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) await Haptics.impact({ style });
  };

  const triggerNotification = async (type: NotificationType) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) await Haptics.notification({ type });
  };

  const recordMistake = (card: LessonCard) => {
    console.log('Record Mistake:', card.data.id, card.quizType);
    setMistakeCount((prev) => prev + 1); // 计数+1
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (autoAudio && currentItem && !isFinished) {
      // 只有 学习卡/更正卡 才自动播放，Quiz卡通常不读题
      if (['KANA_LEARN', 'WORD_LEARN'].includes(currentItem.type)) {
        timer = setTimeout(() => {
          const textToRead =
            currentItem.type === 'WORD_LEARN'
              ? currentItem.data.wordKana || currentItem.data.kana
              : currentItem.data.kana;
          speak(textToRead);
        }, 400); // 稍微延迟，等卡片动画飞到位
      }
    }
    return () => {
      clearTimeout(timer);
      //   cancel();
    };
  }, [currentIndex, autoAudio, currentItem, isFinished, speak, cancel]);

  // 监听结束状态，统一提交数据
  useEffect(() => {
    if (isFinished && !hasCommitted.current) {
      console.log('Session Finished. Committing results to DB...');

      // 遍历暂存区，批量写入数据库
      resultsBuffer.current.forEach((item) => {
        recordQuizResult(item.id, item.isCorrect);
      });

      hasCommitted.current = true;
    }
  }, [isFinished, recordQuizResult]);

  // --- 核心交互逻辑 ---
  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentItem) return;

    // A. 补救卡/教学卡 -> 划走即阅
    if (currentItem.type !== 'QUIZ') {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
      return;
    }

    const currentId = currentItem.data.id;

    // B. Quiz 卡
    const isRightSwipe = dir === 'right';
    const isUserCorrect =
      (currentItem.isCorrect && isRightSwipe) ||
      (!currentItem.isCorrect && !isRightSwipe);

    // 辅助: 标记当前组已完成
    const markGroupComplete = () => {
      if (currentItem.quizGroupId) {
        setCompletedGroups((prev) =>
          new Set(prev).add(currentItem.quizGroupId!)
        );
      }
    };

    // 辅助: 移除同组剩余
    const removeRemainingGroupCards = (currentQueue: LessonCard[]) => {
      if (!currentItem.quizGroupId) return [...currentQueue];
      return currentQueue.filter((c, index) => {
        if (index <= currentIndex) return true;
        return c.quizGroupId !== currentItem.quizGroupId;
      });
    };

    if (isUserCorrect) {
      if (currentItem.isCorrect && isRightSwipe) {
        // 🎉 选中正确 -> 得分
        triggerSound('score');
        triggerHaptic(ImpactStyle.Medium);

        // 🔥 核心逻辑：会话级防抖
        // 只有当这个 ID 在本场还没“定性”时，才给予奖励
        if (!sessionResults.current[currentId]) {
          // 🔥 不直接调用 recordQuizResult，而是推入暂存区
          // recordQuizResult(currentId, true);
          resultsBuffer.current.push({ id: currentId, isCorrect: true });
        }

        markGroupComplete(); // 进度+1
        setQueue((prev) => removeRemainingGroupCards(prev)); // 移除剩余干扰
      } else {
        // 👋 排出错误 -> 继续
        triggerHaptic(ImpactStyle.Light);
        // 注意：这里不标记 group complete，因为题还没做完
      }
    } else {
      // ❌ 答错
      triggerSound('failure');
      triggerNotification(NotificationType.Error);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      // 用于统计本次 Session 错误数
      recordMistake(currentItem);

      // 🔥 不直接调用 recordQuizResult，而是推入暂存区
      // recordQuizResult(currentId, false);
      resultsBuffer.current.push({ id: currentId, isCorrect: false });
      // 并标记为 'fail'，防止后续同ID题目做对时误加分
      sessionResults.current[currentId] = 'fail';
      markGroupComplete(); // 进度+1 (虽然错了，但这题算过掉了，进入解析环节)

      const answerCard = getAnswerCard(currentItem);
      setQueue((prev) => {
        const cleanedQueue = removeRemainingGroupCards(prev); // 移除剩余干扰(没必要猜了)
        const newQueue = [...cleanedQueue];
        newQueue.splice(currentIndex + 1, 0, answerCard); // 插入解析
        return newQueue;
      });
    }

    setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
  };

  // --- Header 逻辑 (复用) ---
  const getHeaderInfo = () => {
    if (!currentItem) return { title: '', sub: '', isJa: false };

    if (!currentItem.isOriginal && currentItem.type !== 'QUIZ') {
      return { title: t(currentItem.headerTitle || ''), sub: '', isJa: false };
    }

    let isJa = false;
    if (currentItem.type === 'QUIZ') {
      if (
        currentItem.quizType === 'ROMAJI' ||
        currentItem.quizType === 'WORD'
      ) {
        isJa = true;
      }
    }

    const isWordQuiz =
      currentItem.type === 'QUIZ' && currentItem.quizType === 'WORD';
    const isKatakana = currentItem.data.kind.startsWith('k-');

    if (isWordQuiz && isKatakana) {
      return {
        title:
          typeof currentItem.headerSub === 'string'
            ? currentItem.headerSub
            : // @ts-ignore
              currentItem.headerSub?.[i18n.language === 'zh' ? 'zh' : 'en'] ||
              '',
        sub: '',
        isJa: false,
      };
    }

    const subText =
      typeof currentItem.headerSub === 'string'
        ? currentItem.headerSub
        : // @ts-ignore
          currentItem.headerSub?.[i18n.language === 'zh' ? 'zh' : 'en'] || '';

    return { title: currentItem.headerTitle || '', sub: subText, isJa };
  };

  const headerInfo = getHeaderInfo();

  // --- 渲染卡片 ---
  const renderCardContent = (card: LessonCard) => {
    switch (card.type) {
      case 'QUIZ':
        return (
          <QuizCard
            displayContent={card.displayContent || card.data.kana}
            isContentJa={card.quizType !== 'ROMAJI'}
          />
        );
      case 'KANA_LEARN':
        return <KanaCard data={card.data} onPlaySound={speak} />;
      case 'WORD_LEARN':
        return <WordCard data={card.data} onPlaySound={speak} />;
      default:
        return null;
    }
  };

  const visibleCards = useMemo(() => {
    if (!queue.length || currentIndex >= queue.length) return [];
    return queue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [queue, currentIndex]);

  const handleFinish = () => {
    if (mode === 'mistake_review') {
      // 如果是从错题本进来的，带上战果返回错题本
      navigate('/mistake-book', {
        state: { sessionResults: sessionResults.current },
        replace: true, // 替换历史，防止点返回键又回到 quiz
      });
    } else {
      // 否则回选择页
      navigate('/quiz/selection', { replace: true });
    }
  };

  const handleReject = () => cardRef.current?.swipe('left');
  const handleAccept = () => cardRef.current?.swipe('right');

  if (isFinished) {
    const durationSeconds = Math.max(
      0,
      Math.floor((Date.now() - startTimeRef.current) / 1000)
    );

    const completionMode = mode === 'mistake_review' ? 'mistake' : 'manual';
    return (
      <QuizCompletionScreen
        stats={{
          totalKana: targetIds.length, // 选了几个假名
          wordCount: wordCount, // 单词数
          totalQuestions: totalGroups, // 一共几道题
          mistakeCount: mistakeCount, // 错了几个
          durationSeconds: durationSeconds, // 耗时
        }}
        onGoBack={handleFinish}
        quizMode={completionMode}
      />
    );
  }

  if (queue.length === 0) return null;

  return (
    <div className={`${styles.container} ${styles.quizContainer}`}>
      {/* Top Bar */}
      <div className={styles.topNav}>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}>
          <CircleX size={28} />
        </button>

        <div style={{ flex: 1, margin: '0 8px' }}>
          <SegmentedProgressBar
            learnCurrent={0}
            learnTotal={0}
            // 使用 completedGroups.size 作为分子，totalGroups 作为分母
            quizCurrent={completedGroups.size}
            quizTotal={totalGroups}
            phase="QUIZ"
          />
        </div>

        <button
          className={styles.closeBtn}
          onClick={() => setIsSettingsOpen(true)}
        >
          <CircleEqual size={28} />
        </button>
      </div>

      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.instructionBar}>
          <div
            className={`
            ${styles.instructionTitle} 
            ${currentItem.type !== 'QUIZ' ? styles.passive : ''}
            ${headerInfo.isJa ? styles.jaFont : ''}
          `}
          >
            {headerInfo.isJa ? headerInfo.title : t(headerInfo.title || '')}
          </div>
          {headerInfo.sub && (
            <div className={styles.instructionSub}>{headerInfo.sub}</div>
          )}
        </div>

        {/* Card Area */}
        <div
          className={`${styles.cardAreaWrapper} ${isShaking ? styles.shake : ''}`}
        >
          <div className={styles.cardArea}>
            {visibleCards.map((card, index) => {
              const isTopCard = index === 0;
              const cardStyle = {
                zIndex: MAX_STACK_SIZE - index,
                transform: `translateY(${index * 18}px) scale(${1 - index * 0.05})`,
                pointerEvents: isTopCard ? 'auto' : 'none',
              } as CSSProperties;

              const contentBlurClass = isTopCard
                ? styles.activeCard
                : styles.backgroundCard;

              return (
                <div
                  key={card.uniqueId}
                  className={styles.stackWrapper}
                  style={cardStyle}
                >
                  <TinderCard
                    ref={isTopCard ? cardRef : null}
                    touchEnabled={isTopCard}
                    preventSwipe={card.type !== 'QUIZ' ? ['left'] : []}
                    onSwipe={isTopCard ? handleSwipe : () => {}}
                  >
                    <div
                      className={`${styles.cardContent} ${contentBlurClass}`}
                    >
                      {renderCardContent(card)}
                    </div>
                  </TinderCard>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        {currentItem.type === 'QUIZ' && (
          <QuizActionButtons onReject={handleReject} onAccept={handleAccept} />
        )}
      </div>

      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={i18n.language === 'zh' ? '学习设置' : 'Settings'}
      >
        <StudySessionSetting
          autoAudioEnabled={autoAudio}
          soundEnabled={soundEffect}
          hapticEnabled={hapticFeedback}
          onToggleAutoAudio={() => toggleSetting('autoAudio')}
          onToggleSound={() => toggleSetting('soundEffect')}
          onToggleHaptic={() => toggleSetting('hapticFeedback')}
        />
      </BottomSheet>
    </div>
  );
};

export default PageQuizSession;
