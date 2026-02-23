import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type CSSProperties,
} from 'react';
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { CircleX, CircleEqual } from 'lucide-react';
import { CompletionScreen } from '../../components/CompletionScreen';
import { useTTS } from '../../hooks/useTTS';

import {
  TinderCard,
  type TinderCardRef,
} from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
import BottomSheet from '../../components/BottomSheet';
import { QuizActionButtons } from '../../components/QuizActionButtons';
import { SegmentedProgressBar } from './SegmentedProgressBar';
import { StudySessionSetting } from './StudySessionSetting';

import { KanaCard } from './Cards/KanaCard';
import { WordCard } from './Cards/WordCard';
import { ReviewCard } from './Cards/ReviewCard';
import { QuizCard } from './Cards/QuizCard';

import {
  generateWaveSequence,
  getRemedialCards,
  calculateSessionStats,
  type SessionStats,
  type LessonCard,
} from './lessonLogic';
import type { LocalizedText } from '../../datas/kanaData';

import styles from './TestStudySession.module.css';

import { useProgress } from './useProgress';
import { useProgress as useGlobalProgress } from '../../context/ProgressContext';
import { useSound } from '../../hooks/useSound';
import { useSettings } from '../../context/SettingsContext';

const MAX_STACK_SIZE = 3;

export const TestStudySession = () => {
  const navigate = useNavigate();
  const { courseId: id } = useParams<{ courseId: string }>();
  const { markLessonComplete } = useGlobalProgress();
  const { t, i18n } = useTranslation();

  // 语言辅助
  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const getLangText = (text?: string | LocalizedText) => {
    if (!text) return '';
    if (typeof text === 'string') return text;
    // @ts-ignore
    return text[currentLang] || text.en || '';
  };

  const cardRef = useRef<TinderCardRef>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 全局设置
  const {
    soundEffect,
    hapticFeedback,
    autoAudio,
    toggleSetting,
    kanjiBackground,
  } = useSettings();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  const location = useLocation();

  // 路由守卫
  if (!location.state?.targetChars) {
    return <Navigate to="/" replace />;
  }

  const targetChars = location.state.targetChars;

  const playSound = useSound();
  const { speak, cancel } = useTTS();

  const triggerSound = (type: Parameters<typeof playSound>[0]) => {
    if (soundEffect) playSound(type);
  };

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  };

  const triggerNotification = async (type: NotificationType) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type });
    }
  };

  // --- 初始化队列 (Lazy Init) ---
  const [{ initialQueue, stats }] = useState<{
    initialQueue: LessonCard[];
    stats: SessionStats;
  }>(() => {
    const queue = generateWaveSequence(targetChars);
    console.log('queue', queue);
    const calculatedStats = calculateSessionStats(queue);
    return { initialQueue: queue, stats: calculatedStats };
  });

  const [lessonQueue, setLessonQueue] = useState<LessonCard[]>(initialQueue);
  const currentItem = lessonQueue[currentIndex];

  // 进度条 Hook
  const progress = useProgress(lessonQueue, currentIndex, stats);

  // 计算可见卡片堆叠
  const visibleCards = useMemo(() => {
    if (!lessonQueue.length || currentIndex >= lessonQueue.length) return [];
    return lessonQueue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [lessonQueue, currentIndex]);

  const isFinished =
    !currentItem &&
    currentIndex >= lessonQueue.length &&
    lessonQueue.length > 0;

  // --- 完成逻辑 ---
  useEffect(() => {
    if (isFinished) {
      if (id) markLessonComplete(id);
      triggerSound('success');
    }
  }, [isFinished]);

  // --- 自动播放发音 ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    if (autoAudio && currentItem && !isFinished) {
      // 只有 KANA 和 WORD 类型才自动播放
      if (['KANA_LEARN', 'WORD_LEARN'].includes(currentItem.type)) {
        // 稍微延迟一点，体验更好
        timer = setTimeout(() => {
          const textToRead =
            currentItem.type === 'WORD_LEARN'
              ? currentItem.data.wordKana || currentItem.data.kana
              : currentItem.data.kana;

          speak(textToRead);
        }, 400);
      }
    }
    return () => {
      // 1. 如果声音还没来得及播（还在 500ms 等待期），直接取消定时器，这样它永远不会响了
      if (timer) clearTimeout(timer);

      // 2. 如果声音已经开始播了，甚至可以在这里再次 cancel，确保万无一失
      // cancel();
    };
  }, [currentIndex, autoAudio, currentItem, isFinished, speak, cancel]);

  // --- Header 计算逻辑 ---
  const getHeader = () => {
    if (!currentItem) return { title: '', sub: '', isJa: false };

    // 🔥 核心修改：判定何时把“翻译/含义”提升为“大标题”
    // 满足以下任一条件，大标题显示“意思 (Meaning)”：
    // 1. 单词题 且 关掉了汉字背景
    // 2. 单词题 且 是片假名 (因为片假名不能把单词本身写在标题上)

    const isWordQuiz =
      currentItem.type === 'QUIZ' && currentItem.quizType === 'WORD';
    const isKatakana = currentItem.data.kind.startsWith('k-');

    // 如果是单词测试，并且 (无汉字背景 OR 是片假名)
    if (isWordQuiz && (!kanjiBackground || isKatakana)) {
      return {
        // 把副标题(意思) 拿来当 标题
        title: getLangText(currentItem.headerSub),
        sub: '',
        isJa: false, // 标题是中文/英文，不需要日文字体
      };
    }

    // 2. 正常情况：根据“当前卡片类型”来精准判断
    let isJa = false;

    if (currentItem.type === 'QUIZ') {
      // 只有以下两种测试题，标题才会显示日文：
      // - ROMAJI 题型：标题是假名 (例如 "あ") -> 需要日文字体
      // - WORD 题型：标题是汉字 (例如 "愛") -> 需要日文字体
      if (
        currentItem.quizType === 'ROMAJI' ||
        currentItem.quizType === 'WORD'
      ) {
        isJa = true;
      }
      // 注意：'KANA' 题型的标题是罗马音 (例如 "a")，所以不需要日文字体
    }

    // 对于其他类型 (KANA_LEARN, WORD_LEARN, TRACE, REVIEW)
    // 标题都是 "session.newKana" 这种翻译 Key，显示出来的是中文或英文 -> 不需要日文字体

    return {
      title: currentItem.headerTitle || '',
      sub: getLangText(currentItem.headerSub),
      isJa,
    };
  };

  const headerInfo = getHeader();

  // --- 滑动处理 (核心业务) ---
  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentItem) return;

    // 只要用户决定滑走，当前如果正在发音就立即停止
    // cancel();

    // 1. 描红卡：右滑算完成
    if (currentItem.type === 'TRACE') {
      triggerSound('score');
      triggerHaptic(ImpactStyle.Light);
    }
    // 2. Quiz 卡：判分
    else if (currentItem.type === 'QUIZ') {
      const isRightSwipe = dir === 'right';
      // 逻辑：向右滑且是正确卡 = 对；向左滑且是错误卡 = 对
      // 这里简化逻辑：用户认为"接受/右滑"是选这个答案
      const isUserCorrect =
        (currentItem.isCorrect && isRightSwipe) ||
        (!currentItem.isCorrect && !isRightSwipe);

      if (isUserCorrect) {
        // 只有选中正确答案才算真正的得分动作
        if (currentItem.isCorrect && isRightSwipe) {
          triggerSound('score');
          triggerHaptic(ImpactStyle.Medium);

          // 🎉 答对了：移除同组剩余的卡片 (Logic 层的 quizGroupId 发挥作用)
          setLessonQueue((prev) => {
            const newQueue = [...prev];
            if (currentItem.quizGroupId) {
              // 从后往前删，避免索引错乱
              for (let i = newQueue.length - 1; i > currentIndex; i--) {
                if (newQueue[i].quizGroupId === currentItem.quizGroupId) {
                  newQueue.splice(i, 1);
                }
              }
            }
            return newQueue;
          });
        }
      } else {
        // ❌ 答错了
        triggerSound('failure');
        triggerNotification(NotificationType.Error);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);

        // 惩罚逻辑：移除同组剩余卡片，并插入补救卡
        setLessonQueue((prev) => {
          const newQueue = [...prev];
          // A. 移除同组
          if (currentItem.quizGroupId) {
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId) {
                newQueue.splice(i, 1);
              }
            }
          }
          // B. 插入补救卡 (调用 Logic)
          const remedial = getRemedialCards(currentItem as any); // 类型断言
          newQueue.splice(currentIndex + 1, 0, ...remedial);

          return newQueue;
        });
      }
    }

    // 延迟切换 index，等待飞出动画
    setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
  };

  const handleReject = () => cardRef.current?.swipe('left');
  const handleAccept = () => cardRef.current?.swipe('right');

  // --- 渲染器 (Switch Dispatcher) ---
  const renderCardContent = (card: LessonCard) => {
    switch (card.type) {
      case 'KANA_LEARN':
        return <KanaCard data={card.data} onPlaySound={speak} />;

      case 'WORD_LEARN':
        return <WordCard data={card.data} onPlaySound={speak} />;

      case 'TRACE':
        return (
          <div
            style={{ width: '100%', height: '100%' }}
            // 🔥 核心修复：添加以下两行，阻止事件冒泡
            // 这样手指在描红时，TinderCard 就不会收到拖拽指令，卡片就会完全锁死
            onTouchStart={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            // 可选：加上 no-swipe 类，某些库会自动识别此作为禁止拖拽区域
            className="no-swipe"
          >
            <TraceCard
              char={card.data.kana}
              onComplete={() => cardRef.current?.swipe('right')}
            />
          </div>
        );

      case 'REVIEW':
        return (
          <ReviewCard items={card.reviewItems || []} onPlaySound={speak} />
        );

      case 'QUIZ':
        return (
          <QuizCard
            // 使用 Logic 层计算好的 displayContent (答案或干扰项)
            // 如果 displayContent 没填(防御)，兜底用 data.kana
            displayContent={card.displayContent || card.data.kana}
            // 简单的字体判断：只要不是 ROMAJI 题，内容基本都是日文
            isContentJa={card.quizType !== 'ROMAJI'}
          />
        );

      default:
        return null;
    }
  };

  // --- 界面渲染 ---
  if (isFinished) {
    return <CompletionScreen onGoHome={() => navigate('/')} />;
  }

  if (lessonQueue.length === 0) return null;

  return (
    <div
      className={`${styles.container} ${progress.phase === 'QUIZ' ? styles.quizContainer : ''}`}
    >
      {/* Top Nav */}
      <div className={styles.topNav}>
        <button className={styles.closeBtn} onClick={() => navigate('/')}>
          <CircleX size={28} />
        </button>
        <div style={{ flex: 1, margin: '0 8px' }}>
          <SegmentedProgressBar
            learnCurrent={progress.learnPassed}
            learnTotal={progress.learnTotal}
            quizCurrent={progress.quizPassed}
            quizTotal={progress.quizTotal}
            phase={progress.phase}
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
            ${currentItem?.type !== 'QUIZ' ? styles.passive : ''}
            ${headerInfo.isJa ? styles.jaFont : ''}
          `}
          >
            {t(headerInfo.title)}
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
              // 样式计算 (保留旧代码的堆叠逻辑)
              const cardStyle = {
                zIndex: MAX_STACK_SIZE - index,
                transform: `translateY(${index * 18}px) scale(${1 - index * 0.05})`,
                pointerEvents: isTopCard ? 'auto' : 'none',
              } as CSSProperties;

              const contentBlurClass = isTopCard
                ? styles.activeCard
                : styles.backgroundCard;

              // 锁定方向逻辑
              let preventSwipe: ('left' | 'right')[] = [];
              if (card.type === 'TRACE')
                preventSwipe = ['left', 'right']; // 描红必须自己完成
              else if (card.type !== 'QUIZ') preventSwipe = ['left']; // 学习卡只能右滑
              const isSwipeEnabled = card.type !== 'TRACE';

              return (
                <div
                  key={card.uniqueId}
                  className={styles.stackWrapper}
                  style={cardStyle}
                >
                  <TinderCard
                    ref={isTopCard ? cardRef : null}
                    touchEnabled={isTopCard && isSwipeEnabled}
                    preventSwipe={preventSwipe}
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

        {/* Quiz Actions (Only for Quiz) */}

        {currentItem?.type === 'QUIZ' && (
          <QuizActionButtons onReject={handleReject} onAccept={handleAccept} />
        )}
      </div>

      {/* Settings Sheet */}
      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title={i18n.language === 'zh' ? '学习设置' : 'Session Settings'}
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
