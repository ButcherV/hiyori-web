import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TinderCard, type TinderCardRef } from '../../components/TinderCard/index';
import { TraceCard } from '../../components/TraceCard/index';
// 引入新的逻辑生成器
import { generateWaveSequence } from './lessonLogic';
import styles from './TestStudySession.module.css';

export const TestStudySession = () => {
  const navigate = useNavigate();
  const cardRef = useRef<TinderCardRef>(null);

  // 初始化数据：使用波浪序列生成器
  const lessonPath = useMemo(() => generateWaveSequence(), []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentItem = lessonPath[currentIndex];

  // --- 结束判断 ---
  if (!currentItem) {
    return (
      <div className={styles.container} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <h1>🎉 Session Complete!</h1>
        <button className={styles.backBtn} onClick={() => navigate(-1)} style={{ fontSize: 20 }}>
          Back to Home
        </button>
      </div>
    );
  }

  // --- 🧠 核心逻辑：Header 文案生成器 ---
  const getInstruction = () => {
    switch (currentItem.type) {
      case 'LEARN':
        // 区分是初次学形状，还是学单词
        return currentItem.subType === 'SHAPE' 
          ? { text: 'New Character', isPassive: true }
          : { text: 'Word Context', isPassive: true };
      
      case 'TRACE':
        return { 
          text: 'Stroke Practice', 
          isPassive: true 
        };
      
      case 'QUIZ':
        // Quiz 模式
        return { 
          text: `Find "${currentItem.targetChar}"`, 
          isPassive: false 
        };
      default:
        return { text: '', isPassive: true };
    }
  };

  const instruction = getInstruction();

  // --- 🛡️ 交互逻辑：方向锁 ---
  const getBlockedDirections = (): ('left' | 'right')[] => {
    if (currentItem.type === 'LEARN') return ['left']; // 只能右滑(Next)
    if (currentItem.type === 'TRACE') return ['left', 'right']; // 必须写完自动飞
    
    if (currentItem.type === 'QUIZ') {
      // 使用 isCorrect 字段判断
      return currentItem.isCorrect ? ['left'] : ['right'];
    }
    return [];
  };

  const preventSwipe = getBlockedDirections();
  
  // 只有 Trace 模式需要禁用卡片触摸，把控制权给 Canvas
  const isTouchEnabled = currentItem.type !== 'TRACE';

  // --- 事件处理 ---
  const handleSwipe = (dir: 'left' | 'right') => {
    console.log(`Swiped ${dir} on ${currentItem.id}`);
    setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
  };

  return (
    <div className={styles.container}>
      
      {/* 1. Top Nav */}
      <div className={styles.topNav}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>Exit</button>
        <span className={styles.progressText}>{currentIndex + 1} / {lessonPath.length}</span>
      </div>

      {/* 2. Instruction Bar */}
      <div className={styles.instructionBar}>
        <div 
          className={`
            ${styles.instructionText} 
            ${instruction.isPassive ? styles.passive : ''}
          `}
        >
          {instruction.text}
        </div>
      </div>

      {/* 3. Card Area */}
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
              
              {/* A. 学习卡片 (Learn & Context) */}
              {currentItem.type === 'LEARN' && (
                <div className={styles.learnMode}>
                  <div className={styles.bigChar}>{currentItem.char}</div>
                  
                  {/* 根据 subType 决定显示什么 */}
                  {currentItem.subType === 'CONTEXT' ? (
                    <div className={styles.contextBox}>
                      <p className={styles.word}>{currentItem.word}</p>
                      <p className={styles.meaning}>{currentItem.meaning}</p>
                    </div>
                  ) : (
                    <p className={styles.subHint}>Listen and memorize</p>
                  )}
                </div>
              )}

              {/* B. 描红卡片 */}
              {currentItem.type === 'TRACE' && (
                <TraceCard 
                  char={currentItem.char}
                  onComplete={() => {
                    cardRef.current?.swipe('right');
                  }}
                />
              )}

              {/* C. 测验卡片 */}
              {currentItem.type === 'QUIZ' && (
                <div className={styles.quizMode}>
                  <div className={styles.bigChar}>{currentItem.char}</div>
                  
                  {/* 如果是 Word Quiz，可以额外显示单词提示 (可选) */}
                  {currentItem.subType === 'WORD' && currentItem.word && (
                     <p className={styles.wordHint}>{currentItem.word}</p>
                  )}
                  
                  <div className={styles.hint}>
                    ← Discard &nbsp;&nbsp;|&nbsp;&nbsp; Keep →
                  </div>
                </div>
              )}

            </div>
          </TinderCard>
        </div>
      </div>

    </div>
  );
};