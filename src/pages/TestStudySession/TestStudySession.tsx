import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TinderCard, type TinderCardRef } from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
import { generateWaveSequence, getRemedialCards, type LessonCard } from './lessonLogic';
import { Volume2 } from 'lucide-react';
import styles from './TestStudySession.module.css';

export const TestStudySession = () => {
  const navigate = useNavigate();
  const cardRef = useRef<TinderCardRef>(null);

  const [lessonQueue, setLessonQueue] = useState<LessonCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLessonQueue(generateWaveSequence());
  }, []);

  const currentItem = lessonQueue[currentIndex];

  if (!currentItem) {
    if (lessonQueue.length === 0) return null;
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1>🎉 Session Complete!</h1>
        <button className={styles.backBtn} onClick={() => navigate(-1)} style={{ fontSize: 20 }}>Finish</button>
      </div>
    );
  }

  // --- 🔥 Header 文案逻辑 (极简版) ---
  const getHeader = () => {
    switch (currentItem.type) {
      case 'LEARN':
        return { 
          // 学习模式保留一点提示，或者也可以改成直接显示假名
          title: currentItem.subType === 'SHAPE' ? 'New Character' : 'Word Context', 
          sub: '', 
          isPassive: true 
        };
      case 'TRACE':
        return { title: 'Stroke Practice', sub: '', isPassive: true };
      case 'QUIZ':
        if (currentItem.subType === 'ROMAJI') {
          // [测1] 假名辨音
          // 旧: How to read "あ"?
          // 新: "あ" (直接展示题目核心)
          return { 
            title: currentItem.targetChar, // 例如：あ
            sub: '', 
            isPassive: false 
          };
        } else {
          // [测2] 单词辨析
          // 旧: Find "蟻"
          // 新: "蟻" (下方副标题显示 ari)
          return { 
            title: currentItem.targetKanji, // 例如：蟻
            sub: currentItem.targetWordRomaji ? `(${currentItem.targetWordRomaji})` : '', // 例如：(ari)
            isPassive: false 
          };
        }
      default:
        return { title: '', sub: '', isPassive: true };
    }
  };
  
  const headerInfo = getHeader(); 

  const getBlockedDirections = (): ('left' | 'right')[] => {
    if (currentItem.type === 'LEARN') return ['left'];
    if (currentItem.type === 'TRACE') return ['left', 'right'];
    return []; 
  };
  const preventSwipe = getBlockedDirections();
  const isTouchEnabled = currentItem.type !== 'TRACE';

  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentItem.type === 'QUIZ') {
      const isRightSwipe = dir === 'right';
      const isCorrectAction = (currentItem.isCorrect && isRightSwipe) || (!currentItem.isCorrect && !isRightSwipe);

      if (!isCorrectAction) {
        // ❌ 错题补救
        const targetChar = currentItem.targetChar || currentItem.char;
        setLessonQueue(prev => {
          const newQueue = [...prev];
          newQueue.splice(currentIndex + 1, 0, ...getRemedialCards(targetChar));
          return newQueue;
        });
      } else {
        // ✅ 答对清理
        if (currentItem.isCorrect && isRightSwipe && currentItem.quizGroupId) {
          setLessonQueue(prev => {
            const newQueue = [...prev];
            for (let i = newQueue.length - 1; i > currentIndex; i--) {
              if (newQueue[i].quizGroupId === currentItem.quizGroupId) {
                newQueue.splice(i, 1);
              }
            }
            return newQueue;
          });
        }
      }
    }
    setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
  };

  const handlePlaySound = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    console.log(`Playing sound for: ${currentItem.char}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topNav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>Exit</button>
        <span className={styles.progressText}>Remaining: {lessonQueue.length - currentIndex}</span>
      </div>

      <div className={styles.instructionBar}>
        <div className={`${styles.instructionTitle} ${headerInfo.isPassive ? styles.passive : ''} ${currentItem.id.includes('remedial') ? styles.remedialText : ''}`}>
          {headerInfo.title}
        </div>
        {/* 副标题 (例如 ari) */}
        {headerInfo.sub && <div className={styles.instructionSub}>{headerInfo.sub}</div>}
      </div>

      <div className={styles.cardAreaWrapper}>
        <div className={styles.cardArea}>
          <TinderCard
            key={currentItem.id}
            ref={cardRef}
            touchEnabled={isTouchEnabled}
            preventSwipe={preventSwipe}
            onSwipe={handleSwipe}
          >
            <div className={styles.cardContent}>
              
              {/* [学1] 基础认知 */}
              {currentItem.type === 'LEARN' && currentItem.subType === 'SHAPE' && (
                <div className={styles.learnShape}>
                  <div className={styles.bigChar}>{currentItem.char}</div>
                  <div className={styles.romajiSub}>{currentItem.romaji}</div>
                  
                  <div className={styles.speakerBtn} onClick={handlePlaySound}>
                    <Volume2 />
                  </div>
                </div>
              )}

              {/* [学2] 单词语境 */}
              {currentItem.type === 'LEARN' && currentItem.subType === 'CONTEXT' && (
                <div className={styles.learnContext}>
                  <div className={styles.furigana}>{currentItem.word}</div>
                  <div className={styles.kanjiMain}>{currentItem.kanji}</div>
                  
                  {/* 🔥 修正：使用 wordRomaji (ari) 而不是 romaji (a) */}
                  {/* 这解决了你图片里指出的问题：单词卡下面不应该显示 'a' */}
                  <div className={styles.romajiBottom}>{currentItem.wordRomaji}</div>
                  
                  <div className={styles.speakerBtn} onClick={handlePlaySound}>
                    <Volume2 />
                  </div>
                </div>
              )}

              {/* [练1] 描红 */}
              {currentItem.type === 'TRACE' && (
                <TraceCard 
                  char={currentItem.char}
                  onComplete={() => cardRef.current?.swipe('right')}
                />
              )}

              {/* [测1 & 测2] Quiz */}
              {currentItem.type === 'QUIZ' && (
                <div className={styles.quizMode}>
                  <div className={styles.quizText}>{currentItem.displayContent}</div>
                  <div className={styles.hint}>← Discard &nbsp;|&nbsp; Keep →</div>
                </div>
              )}

            </div>
          </TinderCard>
        </div>
      </div>
    </div>
  );
};