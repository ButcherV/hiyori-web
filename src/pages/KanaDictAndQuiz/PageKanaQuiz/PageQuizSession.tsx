// 本实现直接引入了 TestStudy 中的大量组件和样式
// page 之间这样引来引去时很危险的。待整理。

import {
  useState,
  useRef,
  useMemo,
  useEffect,
  type CSSProperties,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Check, CircleX, CircleEqual } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
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

// --- Hooks & Context ---
import { useSound } from '../../../hooks/useSound';
import { useTTS } from '../../../hooks/useTTS';
import { useSettings } from '../../../context/SettingsContext';

// --- 本地逻辑 ---
import { generateQuizQueue, getAnswerCard, type LessonCard } from './quizLogic';

const MAX_STACK_SIZE = 3;

export const PageQuizSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // 1. 获取选题参数
  const targetIds = location.state?.targetIds || [];

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
              ? currentItem.data.word || currentItem.data.kana
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

  // --- 核心交互逻辑 ---
  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentItem) return;

    // A. 补救卡/教学卡 -> 划走即阅
    if (currentItem.type !== 'QUIZ') {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
      return;
    }

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

      recordMistake(currentItem);
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
    const isKatakana = currentItem.data.kind === 'k-seion';

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

  if (!isFinished) {
    const durationSeconds = Math.max(
      0,
      Math.floor((Date.now() - startTimeRef.current) / 1000)
    );

    return (
      <QuizCompletionScreen
        stats={{
          totalKana: targetIds.length, // 选了几个假名
          wordCount: wordCount, // 单词数
          totalQuestions: totalGroups, // 一共几道题
          mistakeCount: mistakeCount, // 错了几个
          durationSeconds: durationSeconds, // 耗时
        }}
        onGoHome={() => navigate('/quiz/selection')}
      />
    );
  }

  if (queue.length === 0) return null;

  return (
    <div className={`${styles.container} ${styles.quizContainer}`}>
      {/* Top Bar */}
      <div className={styles.topNav}>
        <button
          className={styles.closeBtn}
          //   回选择页，而不是回 home 页
          onClick={() => navigate('/quiz/selection')}
        >
          <CircleX size={28} />
        </button>

        <div style={{ flex: 1, margin: '0 8px' }}>
          <SegmentedProgressBar
            learnCurrent={0}
            learnTotal={0}
            // 🔥 使用 completedGroups.size 作为分子，totalGroups 作为分母
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
                  <div className={`${styles.cardContent} ${contentBlurClass}`}>
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
        <div className={styles.quizActions}>
          <button
            className={`${styles.actionBtn} ${styles.reject}`}
            onClick={() => cardRef.current?.swipe('left')}
          >
            <X size={32} strokeWidth={3} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.accept}`}
            onClick={() => cardRef.current?.swipe('right')}
          >
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}

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
