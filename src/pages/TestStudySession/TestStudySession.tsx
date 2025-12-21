import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TinderCard, type TinderCardRef } from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
import { generateWaveSequence, getRemedialCards, type LessonCard } from './lessonLogic';
// 🔥 引入 X 和 Check 图标
import { Volume2, CheckCircle, X, Check } from 'lucide-react';
import styles from './TestStudySession.module.css';

// 定义最大堆叠数量
const MAX_STACK_SIZE = 3;
// 倒计时秒数
const AUTO_REDIRECT_SECONDS = 3;

export const TestStudySession = () => {
  const navigate = useNavigate();
  const cardRef = useRef<TinderCardRef>(null);

  // 核心状态
  const [lessonQueue, setLessonQueue] = useState<LessonCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  
  // 倒计时状态
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  // 初始化加载课程
  useEffect(() => {
    setLessonQueue(generateWaveSequence());
  }, []);

  const currentItem = lessonQueue[currentIndex];

  // 计算堆叠卡片
  const visibleCards = useMemo(() => {
    if (!lessonQueue.length || currentIndex >= lessonQueue.length) return [];
    return lessonQueue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [lessonQueue, currentIndex]);

  // --- 🏁 Session Complete 判断 ---
  const isFinished = !currentItem && currentIndex >= lessonQueue.length && lessonQueue.length > 0;

  // 倒计时逻辑
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


  // --- 渲染：结算页面 ---
  if (isFinished) {
    return (
      <div className={styles.completeContainer}>
        <div className={styles.celebrationIcon}>
          <CheckCircle size={80} strokeWidth={2.5} />
        </div>
        
        <h1 className={styles.completeTitle}>All Done!</h1>
        <p className={styles.completeSub}>Great job learning today.</p>
        
        <button className={styles.fillingBtn} onClick={() => navigate('/')}>
          <span className={styles.btnText}>
            Back to Home ({countdown})
          </span>
        </button>
      </div>
    );
  }

  // 初始 Loading
  if (lessonQueue.length === 0) return null;

  // --- Header 文案逻辑 ---
  const getHeader = () => {
    if (!currentItem) return { title: '', sub: '', isPassive: true };

    if (currentItem.customTitle) {
      return { title: currentItem.customTitle, sub: '', isPassive: true };
    }

    switch (currentItem.type) {
      case 'LEARN':
        return { 
          title: currentItem.subType === 'SHAPE' ? 'New Kana' : 'New Word', 
          sub: '', 
          isPassive: true 
        };
      case 'TRACE':
        return { title: 'Stroke Practice', sub: '', isPassive: true };
      case 'QUIZ':
        if (currentItem.subType === 'ROMAJI') {
          return { title: currentItem.targetChar, sub: '', isPassive: false };
        } else {
          return { 
            title: currentItem.targetKanji, 
            sub: currentItem.targetWordRomaji ? `${currentItem.targetWordRomaji}` : '', 
            isPassive: false 
          };
        }
      default:
        return { title: '', sub: '', isPassive: true };
    }
  };
  
  const headerInfo = getHeader(); 

  // --- 方向锁 ---
  const getBlockedDirections = (): ('left' | 'right')[] => {
    if (!currentItem) return [];
    if (currentItem.type === 'LEARN') return ['left'];
    if (currentItem.type === 'TRACE') return ['left', 'right'];
    return []; 
  };
  const preventSwipe = getBlockedDirections();
  const isTouchEnabled = currentItem?.type !== 'TRACE';

  // --- 🔥 按钮触发滑动辅助函数 ---
  const triggerSwipe = (dir: 'left' | 'right') => {
    if (cardRef.current) {
      cardRef.current.swipe(dir);
    }
  };

  // --- 滑动处理逻辑 ---
  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentItem.type === 'QUIZ') {
      const isRightSwipe = dir === 'right';
      const isCorrectAction = (currentItem.isCorrect && isRightSwipe) || (!currentItem.isCorrect && !isRightSwipe);

      setLessonQueue(prev => {
        const newQueue = [...prev];

        // A: 完美胜利
        if (isCorrectAction && currentItem.isCorrect && isRightSwipe) {
          if (currentItem.quizGroupId) {
             for (let i = newQueue.length - 1; i > currentIndex; i--) {
               if (newQueue[i].quizGroupId === currentItem.quizGroupId) {
                 newQueue.splice(i, 1);
               }
             }
          }
        }

        // B: 答错惩罚
        if (!isCorrectAction) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);

          if (currentItem.quizGroupId) {
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId) {
                newQueue.splice(i, 1);
              }
            }
          }

          const targetChar = currentItem.targetChar || currentItem.char;
          const remedialCards = getRemedialCards(targetChar, currentItem.subType);
          newQueue.splice(currentIndex + 1, 0, ...remedialCards);
        }
        
        return newQueue;
      });
    }

    setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
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
      filter: `brightness(${1 - index * 0.1})`,
      pointerEvents: index === 0 ? 'auto' : 'none' as const,
    };
  };

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>Exit</button>
        <span className={styles.progressText}>Remaining: {lessonQueue.length - currentIndex}</span>
      </div>

      <div className={styles.instructionBar}>
        {currentItem && (
          <>
            <div className={`${styles.instructionTitle} ${headerInfo.isPassive ? styles.passive : ''} ${currentItem.id.includes('remedial') ? styles.remedialText : ''}`}>
              {headerInfo.title}
            </div>
            {headerInfo.sub && <div className={styles.instructionSub}>{headerInfo.sub}</div>}
          </>
        )}
      </div>

      <div className={`${styles.cardAreaWrapper} ${isShaking ? styles.shake : ''}`}>
        <div className={styles.cardArea}>
          
          {visibleCards.map((card, index) => {
            const isTopCard = index === 0;
            const cardStyle = getStackStyle(index);

            return (
              <div 
                key={card.id} 
                className={styles.stackWrapper} 
                style={cardStyle}
              >
                <TinderCard
                  ref={isTopCard ? cardRef : null}
                  touchEnabled={isTopCard && isTouchEnabled}
                  preventSwipe={isTopCard ? preventSwipe : []}
                  onSwipe={isTopCard ? handleSwipe : undefined}
                >
                  <div className={styles.cardContent}>
                    
                    {card.type === 'LEARN' && card.subType === 'SHAPE' && (
                      <div className={styles.learnShape}>
                        <div className={styles.bigChar}>{card.char}</div>
                        <div className={styles.romajiSub}>{card.romaji}</div>
                        <div className={styles.speakerBtn} onClick={handlePlaySound}>
                          <Volume2 />
                        </div>
                      </div>
                    )}

                    {card.type === 'LEARN' && card.subType === 'CONTEXT' && (
                      <div className={styles.learnContext}>
                        <div className={styles.furigana}>{card.word}</div>
                        <div className={styles.kanjiMain}>{card.kanji}</div>
                        <div className={styles.romajiBottom}>{card.wordRomaji}</div>
                        <div className={styles.speakerBtn} onClick={handlePlaySound}>
                          <Volume2 />
                        </div>
                      </div>
                    )}

                    {card.type === 'TRACE' && (
                      <TraceCard 
                        char={card.char}
                        onComplete={() => isTopCard && cardRef.current?.swipe('right')}
                      />
                    )}

                    {card.type === 'QUIZ' && (
                      <div className={styles.quizMode}>
                        <div className={styles.quizText}>{card.displayContent}</div>
                        {/* 🔥 删除了旧的文字提示 Hint */}
                      </div>
                    )}

                  </div>
                </TinderCard>
              </div>
            );
          })}

        </div>
      </div>
      
      {/* 🔥🔥🔥 新增：底部操作按钮 (仅在 QUIZ 模式显示) 🔥🔥🔥 */}
      {currentItem?.type === 'QUIZ' && (
        <div className={styles.quizActions}>
          <button 
            className={`${styles.actionBtn} ${styles.reject}`} 
            onClick={() => triggerSwipe('left')}
            aria-label="Discard"
          >
            <X size={32} strokeWidth={3} />
          </button>
          
          <button 
            className={`${styles.actionBtn} ${styles.accept}`} 
            onClick={() => triggerSwipe('right')}
            aria-label="Keep"
          >
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}

    </div>
  );
};