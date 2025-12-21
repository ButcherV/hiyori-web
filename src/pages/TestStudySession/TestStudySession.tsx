import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TinderCard, type TinderCardRef } from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
import { generateWaveSequence, getRemedialCards, type LessonCard } from './lessonLogic';
import { Volume2, CheckCircle, X, Check } from 'lucide-react';
import styles from './TestStudySession.module.css';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const MAX_STACK_SIZE = 3;
const AUTO_REDIRECT_SECONDS = 3;

export const TestStudySession = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const cardRef = useRef<TinderCardRef>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REDIRECT_SECONDS);

  const location = useLocation();
  const targetChars = location.state?.targetChars || ['あ', 'い', 'う', 'え', 'お'];
  const [lessonQueue, setLessonQueue] = useState<LessonCard[]>(() => {
     return generateWaveSequence(targetChars); 
  });

  const currentItem = lessonQueue[currentIndex];

  const visibleCards = useMemo(() => {
    if (!lessonQueue.length || currentIndex >= lessonQueue.length) return [];
    return lessonQueue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [lessonQueue, currentIndex]);

  const isFinished = !currentItem && currentIndex >= lessonQueue.length && lessonQueue.length > 0;

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
    if (!currentItem) return { title: '', sub: '', isPassive: true, isJa: false };
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
        isJa: !!currentItem.isHeaderJa
      };
    }
    if (currentItem.customTitle) {
      return { title: currentItem.customTitle, sub: '', isPassive: true, isJa: false };
    }
    return { title: '', sub: '', isPassive: true, isJa: false };
  };
  const headerInfo = getHeader(); 

  const getBlockedDirections = (): ('left' | 'right')[] => {
    if (!currentItem) return [];
    if (currentItem.type === 'LEARN') return ['left'];
    if (currentItem.type === 'TRACE') return ['left', 'right'];
    return []; 
  };
  const preventSwipe = getBlockedDirections();
  const isTouchEnabled = currentItem?.type !== 'TRACE';

  const triggerSwipe = (dir: 'left' | 'right') => {
    if (cardRef.current) cardRef.current.swipe(dir);
  };

  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentItem.type === 'QUIZ') {
      const isRightSwipe = dir === 'right';
      const isCorrectAction = (currentItem.isCorrect && isRightSwipe) || (!currentItem.isCorrect && !isRightSwipe);

      setLessonQueue(prev => {
        const newQueue = [...prev];
        if (isCorrectAction && currentItem.isCorrect && isRightSwipe) {
          if (currentItem.quizGroupId) {
             for (let i = newQueue.length - 1; i > currentIndex; i--) {
               if (newQueue[i].quizGroupId === currentItem.quizGroupId) newQueue.splice(i, 1);
             }
          }
        }
        if (!isCorrectAction) {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          if (currentItem.quizGroupId) {
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId) newQueue.splice(i, 1);
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
            <div className={`
              ${styles.instructionTitle} 
              ${headerInfo.isPassive ? styles.passive : ''} 
              ${currentItem.id.includes('remedial') ? styles.remedialText : ''}
              ${headerInfo.isJa ? styles.jaFont : ''}
            `}>
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
            
            // 🔥🔥🔥 1. 定义内容模糊的类名 🔥🔥🔥
            // 如果是顶层卡，用 activeCard (执行变清晰动画)
            // 如果是背景卡，用 backgroundCard (保持模糊)
            const contentBlurClass = isTopCard ? styles.activeCard : styles.backgroundCard;

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
                  onSwipe={isTopCard ? handleSwipe : undefined}
                >
                  <div 
                    className={`${styles.cardContent} ${contentBlurClass}`}
                  >
                    
                    {/* Learn: Shape */}
                    {card.type === 'LEARN' && card.subType === 'SHAPE' && (
                      // 🔥🔥🔥 3. 把类名加到具体内容容器上 🔥🔥🔥
                      <div className={styles.learnShape}>
                        <div className={`${styles.bigChar} ${styles.jaFont}`}>{card.char}</div>
                        <div className={styles.romajiSub}>{card.romaji}</div>
                        <div className={styles.speakerBtn} onClick={handlePlaySound}><Volume2 /></div>
                      </div>
                    )}

                    {/* Learn: Context */}
                    {card.type === 'LEARN' && card.subType === 'CONTEXT' && (
                      // 🔥🔥🔥 4. 这里也加 🔥🔥🔥
                      <div className={styles.learnContext}>
                        <div className={`${styles.furigana} ${styles.jaFont}`}>{card.word}</div>
                        <div className={`${styles.kanjiMain} ${styles.jaFont}`}>{card.kanji}</div>
                        <div className={styles.romajiBottom}>{card.wordRomaji}</div>
                        
                        {card.meaning && (
                          <div className={styles.meaningText}>
                            {card.meaning[currentLang]}
                          </div>
                        )}

                        <div className={styles.speakerBtn} onClick={handlePlaySound}><Volume2 /></div>
                      </div>
                    )}

                    {card.type === 'TRACE' && (
                      // 🔥🔥🔥 5. TraceCard 组件可能不支持 className，所以包一层 div 比较稳妥 🔥🔥🔥
                      <div style={{ width: '100%', height: '100%' }}>
                        <TraceCard 
                          char={card.char}
                          onComplete={() => isTopCard && cardRef.current?.swipe('right')}
                        />
                      </div>
                    )}

                    {/* Quiz */}
                    {card.type === 'QUIZ' && (
                      <div className={styles.quizMode}>
                        {/* 🔥🔥🔥 6. 这里也加 🔥🔥🔥 */}
                        <div className={`
                          ${styles.quizText} 
                          ${card.isContentJa ? styles.jaFont : ''}
                        `}>
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
          <button className={`${styles.actionBtn} ${styles.reject}`} onClick={() => triggerSwipe('left')}>
            <X size={32} strokeWidth={3} />
          </button>
          <button className={`${styles.actionBtn} ${styles.accept}`} onClick={() => triggerSwipe('right')}>
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};