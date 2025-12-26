import {
  useState,
  useRef,
  useEffect,
  useMemo,
  type CSSProperties,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import {
  TinderCard,
  type TinderCardRef,
} from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
import {
  generateWaveSequence,
  getRemedialCards,
  calculateSessionStats,
  type SessionStats,
  type LessonCard,
} from './lessonLogic';
import {
  Volume2,
  CheckCircle,
  X,
  Check,
  ChevronRight,
  // Settings,
  // CircleChevronLeft,
  CircleX,
  CircleEqual,
} from 'lucide-react';
import styles from './TestStudySession.module.css';

// progess and Hook
import { SegmentedProgressBar } from './SegmentedProgressBar';
import { useProgress } from './useProgress';

// sound hook
import { useSound } from '../../hooks/useSound';

import BottomSheet from '../../components/BottomSheet';
import { StudySessionSetting } from './StudySessionSetting';
import { useSettings } from '../../context/SettingsContext';

const MAX_STACK_SIZE = 3;
const AUTO_REDIRECT_SECONDS = 3;

export const TestStudySession = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const cardRef = useRef<TinderCardRef>(null);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    soundEffect, // 全局音效状态
    hapticFeedback, // 全局震动状态
    autoAudio, // 全局自动发音状态
    toggleSetting, // 全局切换方法
  } = useSettings();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);
  const location = useLocation();
  const targetChars = location.state?.targetChars || [
    'あ',
    'い',
    'う',
    'え',
    'お',
  ];

  // --- 🔊 音效初始化 ---
  const playSound = useSound();

  const triggerSound = (type: Parameters<typeof playSound>[0]) => {
    if (!soundEffect) return; // 使用全局 soundEffect
    playSound(type);
  };

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (!hapticFeedback) return; // 使用全局 hapticFeedback
    if (Capacitor.isNativePlatform()) {
      await Haptics.impact({ style });
    }
  };

  const triggerNotification = async (type: NotificationType) => {
    if (!hapticFeedback) return; // 使用全局 hapticFeedback
    if (Capacitor.isNativePlatform()) {
      await Haptics.notification({ type });
    }
  };

  // 🔥🔥🔥 核心修改开始：一次性初始化队列和统计数据 🔥🔥🔥
  // 使用 useState 的 lazy initializer 同时生成这两样东西
  const [{ initialQueue, stats }] = useState<{
    initialQueue: LessonCard[];
    stats: SessionStats;
  }>(() => {
    // 1. 造数据 (生成 15 题)
    const queue = generateWaveSequence(targetChars);
    // 2. 算总数 (立刻记录：分母是 15)
    const calculatedStats = calculateSessionStats(queue);

    return { initialQueue: queue, stats: calculatedStats };
  });

  const [lessonQueue, setLessonQueue] = useState<LessonCard[]>(initialQueue);

  const currentItem = lessonQueue[currentIndex];
  const progress = useProgress(lessonQueue, currentIndex, stats);

  const visibleCards = useMemo(() => {
    if (!lessonQueue.length || currentIndex >= lessonQueue.length) return [];
    return lessonQueue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [lessonQueue, currentIndex]);

  const isFinished =
    !currentItem &&
    currentIndex >= lessonQueue.length &&
    lessonQueue.length > 0;

  useEffect(() => {
    if (isFinished) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            navigate('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFinished, navigate]);

  if (isFinished) {
    return (
      <div className={styles.completeContainer}>
        <div className={styles.celebrationIcon}>
          <CheckCircle size={80} strokeWidth={2.5} />
        </div>
        <h1 className={styles.completeTitle}>All Done!</h1>
        <p className={styles.completeSub}>Great job learning today.</p>
        <button className={styles.fillingBtn} onClick={() => navigate('/')}>
          <span className={styles.btnText}>Back to Home ({countdown})</span>
        </button>
      </div>
    );
  }

  if (lessonQueue.length === 0) return null;

  // Header Logic
  const getHeader = () => {
    if (!currentItem)
      return { title: '', sub: '', isPassive: true, isJa: false };
    if (currentItem.headerTitle) {
      // 🔥🔥🔥 核心修改：解析 sub 文本 🔥🔥🔥
      let displaySub = '';
      if (currentItem.headerSub) {
        if (typeof currentItem.headerSub === 'string') {
          // 如果是普通的字符串（比如以后有不需要翻译的情况），直接显示
          displaySub = currentItem.headerSub;
        } else {
          // 如果是 LocalizedText 对象，根据当前语言取值
          displaySub = currentItem.headerSub[currentLang];
        }
      }

      return {
        title: currentItem.customTitle || currentItem.headerTitle,
        sub: displaySub, // 使用解析后的文本
        isPassive: currentItem.type !== 'QUIZ',
        isJa: !!currentItem.isHeaderJa,
      };
    }
    if (currentItem.customTitle) {
      return {
        title: currentItem.customTitle,
        sub: '',
        isPassive: true,
        isJa: false,
      };
    }
    return { title: '', sub: '', isPassive: true, isJa: false };
  };
  const headerInfo = getHeader();

  const getBlockedDirections = (): ('left' | 'right')[] => {
    if (!currentItem) return [];
    if (currentItem.type === 'LEARN') return ['left'];
    if (currentItem.subType === 'REVIEW') return ['left'];
    if (currentItem.type === 'TRACE') return ['left', 'right'];
    return [];
  };
  const preventSwipe = getBlockedDirections();
  const isTouchEnabled = currentItem?.type !== 'TRACE';

  const triggerSwipe = (dir: 'left' | 'right') => {
    if (cardRef.current) cardRef.current.swipe(dir);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    // ⬇️⬇️⬇️ 🔥 3. 核心修改：使用 trigger 函数替换直接调用 ⬇️⬇️⬇️

    if (currentItem.type === 'TRACE') {
      triggerSound('score');
      // 使用封装的 triggerHaptic
      triggerHaptic(ImpactStyle.Light);
    } else if (currentItem.type === 'QUIZ') {
      const isRightSwipe = dir === 'right';
      const isCorrectAction =
        (currentItem.isCorrect && isRightSwipe) ||
        (!currentItem.isCorrect && !isRightSwipe);

      if (isCorrectAction) {
        if (currentItem.isCorrect && isRightSwipe) {
          triggerSound('score');
          triggerHaptic(ImpactStyle.Medium);
        }
      } else {
        triggerSound('failure');
        // 错误震动通常比较强，这里用 Notification Error
        triggerNotification(NotificationType.Error);
      }

      setLessonQueue((prev) => {
        const newQueue = [...prev];
        if (isCorrectAction && currentItem.isCorrect && isRightSwipe) {
          if (currentItem.quizGroupId) {
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId)
                newQueue.splice(i, 1);
            }
          }
        }
        if (!isCorrectAction) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          if (currentItem.quizGroupId) {
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId)
                newQueue.splice(i, 1);
            }
          }
          const targetChar = currentItem.char;
          const remedialCards = getRemedialCards(
            targetChar,
            currentItem.subType
          );
          newQueue.splice(currentIndex + 1, 0, ...remedialCards);
        }
        return newQueue;
      });
    }

    setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
  };

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const getStackStyle = (index: number) => {
    const offsetY = index * 18;
    const scale = 1 - index * 0.05;
    const zIndex = MAX_STACK_SIZE - index;
    return {
      zIndex,
      transform: `translateY(${offsetY}px) scale(${scale})`,
      pointerEvents: index === 0 ? 'auto' : ('none' as const),
    };
  };

  return (
    <div
      className={`${styles.container} ${progress.phase === 'QUIZ' ? styles.quizContainer : ''}`}
    >
      <div className={styles.topNav}>
        {/* <button className={styles.backBtn} onClick={() => navigate('/')}>Exit</button> */}

        <button className={styles.closeBtn} onClick={() => navigate('/')}>
          <CircleX size={28} /> {/* 来自 lucide-react */}
        </button>
        <div style={{ flex: 1, margin: '0 8px 0 8px' }}>
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
        {/* <span className={styles.progressText}>Remaining: {lessonQueue.length - currentIndex}</span> */}
      </div>

      <div className={styles.instructionBar}>
        {currentItem && (
          <>
            <div
              className={`
              ${styles.instructionTitle} 
              ${headerInfo.isPassive ? styles.passive : ''} 
              ${currentItem.id.includes('remedial') ? styles.remedialText : ''}
              ${headerInfo.isJa ? styles.jaFont : ''}
            `}
            >
              {headerInfo.title}
            </div>
            {headerInfo.sub && (
              <div className={styles.instructionSub}>{headerInfo.sub}</div>
            )}
          </>
        )}
      </div>

      <div
        className={`${styles.cardAreaWrapper} ${isShaking ? styles.shake : ''}`}
      >
        <div className={styles.cardArea}>
          {visibleCards.map((card, index) => {
            const isTopCard = index === 0;
            const cardStyle = getStackStyle(index) as CSSProperties;

            // 🔥🔥🔥 1. 定义内容模糊的类名 🔥🔥🔥
            // 如果是顶层卡，用 activeCard (执行变清晰动画)
            // 如果是背景卡，用 backgroundCard (保持模糊)
            const contentBlurClass = isTopCard
              ? styles.activeCard
              : styles.backgroundCard;

            return (
              <div
                key={card.id}
                // 🔥🔥🔥 2. 这里移除了 backgroundCard/activeCard 🔥🔥🔥
                // 让卡片容器保持清晰（白底、阴影不受影响）
                className={styles.stackWrapper}
                style={cardStyle}
              >
                <TinderCard
                  ref={isTopCard ? cardRef : null}
                  touchEnabled={isTopCard && isTouchEnabled}
                  preventSwipe={isTopCard ? preventSwipe : []}
                  onSwipe={isTopCard ? handleSwipe : () => {}}
                >
                  <div className={`${styles.cardContent} ${contentBlurClass}`}>
                    {/* Learn: Shape */}
                    {card.type === 'LEARN' && card.subType === 'SHAPE' && (
                      // 🔥🔥🔥 3. 把类名加到具体内容容器上 🔥🔥🔥
                      <div className={styles.learnShape}>
                        <div className={`${styles.bigChar} ${styles.jaFont}`}>
                          {card.char}
                        </div>
                        <div className={styles.romajiSub}>{card.romaji}</div>
                        <div
                          className={styles.speakerBtn}
                          onClick={handlePlaySound}
                        >
                          <Volume2 />
                        </div>
                      </div>
                    )}

                    {/* Learn: Context */}
                    {card.type === 'LEARN' && card.subType === 'CONTEXT' && (
                      <div className={styles.learnContext}>
                        <div className={`${styles.furigana} ${styles.jaFont}`}>
                          {card.word}
                        </div>
                        <div className={`${styles.kanjiMain} ${styles.jaFont}`}>
                          {card.kanji}
                        </div>
                        <div className={styles.romajiBottom}>
                          {card.wordRomaji}
                        </div>

                        {card.meaning && (
                          <div className={styles.meaningText}>
                            {card.meaning[currentLang]}
                          </div>
                        )}

                        <div
                          className={styles.speakerBtn}
                          onClick={handlePlaySound}
                        >
                          <Volume2 />
                        </div>
                      </div>
                    )}

                    {card.type === 'TRACE' && (
                      // 🔥🔥🔥 5. TraceCard 组件可能不支持 className，所以包一层 div 比较稳妥 🔥🔥🔥
                      <div style={{ width: '100%', height: '100%' }}>
                        <TraceCard
                          char={card.char}
                          onComplete={() =>
                            isTopCard && cardRef.current?.swipe('right')
                          }
                        />
                      </div>
                    )}

                    {/* review Card */}
                    {card.subType === 'REVIEW' && card.reviewItems && (
                      <div className={styles.reviewListContainer}>
                        {card.reviewItems.map((item, idx) => (
                          <div key={idx} className={styles.reviewRow}>
                            {/* 左侧：假名 + 罗马音 */}
                            <div className={styles.reviewLeft}>
                              <span className={styles.reviewChar}>
                                {item.char}
                              </span>
                              <span className={styles.reviewRomaji}>
                                {item.romaji}
                              </span>
                            </div>

                            {/* 右侧：kanji + kana + 含义 */}
                            <div className={styles.reviewRight}>
                              <span className={styles.reviewWord}>
                                {item.kanji} [{item.word}]
                              </span>
                              <span className={styles.reviewMeaning}>
                                {item.meaning[currentLang]}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* 底部提示 */}
                        <div className={styles.swipeHint}>
                          Swipe right to start quiz{' '}
                          <ChevronRight
                            size={14}
                            style={{
                              verticalAlign: 'middle',
                              display: 'inline-block',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Quiz */}
                    {card.type === 'QUIZ' && (
                      <div className={styles.quizMode}>
                        {/* 🔥🔥🔥 6. 这里也加 🔥🔥🔥 */}
                        <div
                          className={`
                          ${styles.quizText} 
                          ${card.isContentJa ? styles.jaFont : ''}
                        `}
                        >
                          {card.displayContent}
                        </div>
                      </div>
                    )}
                  </div>
                </TinderCard>
              </div>
            );
          })}
        </div>
      </div>

      {currentItem?.type === 'QUIZ' && (
        <div className={styles.quizActions}>
          <button
            className={`${styles.actionBtn} ${styles.reject}`}
            onClick={() => triggerSwipe('left')}
          >
            <X size={32} strokeWidth={3} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.accept}`}
            onClick={() => triggerSwipe('right')}
          >
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* 挂载底部弹窗 */}
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
