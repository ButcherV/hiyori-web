import { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';
import { AnimatePresence, motion } from 'framer-motion'; 
import styles from './QuizSession.module.css';

import type { Vocabulary, QuizQuestion, QuizOption } from '../types';
import { RAW_DATA } from '../data';
import { generateQuestion } from '../engine';
import { TinderCard } from './TinderCard';
import { QuizHeader } from './QuizHeader';
import { MistakeModal } from './MistakeModal'; // ✅ 引入新组件

// 动画变量配置 (跟之前一样，不用改)
const slideVariants = {
  enter: (direction: 'horizontal' | 'vertical') => ({
    x: direction === 'horizontal' ? 300 : 0,
    y: direction === 'vertical' ? 300 : 0,
    opacity: 0,
    position: 'absolute' as const,
  }),
  center: {
    zIndex: 1,
    x: 0,
    y: 0,
    opacity: 1,
    position: 'relative' as const,
  },
  exit: (direction: 'horizontal' | 'vertical') => ({
    zIndex: 0,
    x: direction === 'horizontal' ? -300 : 0,
    y: direction === 'vertical' ? -300 : 0, // 垂直模式：向上飞走
    opacity: 0,
    position: 'absolute' as const,
  })
};

export function QuizSession() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [cardQueue, setCardQueue] = useState<QuizOption[]>([]);
  const originalOptions = useRef<QuizOption[]>([]);
  const cycleCount = useRef(0);

  const [isLocked, setIsLocked] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>('');
  
  // 状态：正确答案对象 (传给 Modal 用)
  const [correctOptionData, setCorrectOptionData] = useState<QuizOption | undefined>(undefined);
  // 状态：Modal 是否打开
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);

  // 切题方向
  const [slideDirection, setSlideDirection] = useState<'horizontal' | 'vertical'>('horizontal');

  const loadNewQuestion = useCallback(() => {
    setIsLocked(false);
    setIsRevealed(false);
    setCorrectAnswerText('');
    setCorrectOptionData(undefined); // 清理
    setIsMistakeModalOpen(false);    // 确保关闭

    let validQuestion: QuizQuestion | null = null;
    let attempts = 0;
    while (!validQuestion && attempts < 50) {
      const randomWord = _.sample(RAW_DATA) as Vocabulary;
      validQuestion = generateQuestion(randomWord, 'KANA_FILL_BLANK');
      attempts++;
    }

    if (validQuestion) {
      setQuestion(validQuestion);
      originalOptions.current = validQuestion.options;
      cycleCount.current = 0;
      setCardQueue(validQuestion.options);
      
      // 预存一下正确选项数据，方便 Modal 调用
      setCorrectOptionData(validQuestion.options.find(o => o.isCorrect));
    }
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const appendMoreCards = () => {
    // ... (保持不变)
    if (originalOptions.current.length === 0) return;
    cycleCount.current += 1; 
    const currentCycle = cycleCount.current;
    const newBatch = _.shuffle([...originalOptions.current]);
    const rebornBatch = newBatch.map(opt => ({
      ...opt,
      id: `${opt.id}_cycle_${currentCycle}`
    }));

    setCardQueue(prev => {
      const lastCard = prev[prev.length - 1];
      if (lastCard && rebornBatch.length > 1 && rebornBatch[0].content === lastCard.content) {
         const first = rebornBatch.shift()!;
         rebornBatch.push(first);
      }
      return [...prev, ...rebornBatch];
    });
  };

  const removeTopCard = () => {
    // ... (保持不变)
    setCardQueue(prev => {
      const remaining = prev.slice(1);
      if (remaining.length <= 3) {
        setTimeout(() => appendMoreCards(), 0);
      }
      return remaining;
    });
  };

  const handleSwipe = (option: QuizOption, direction: 'LIKE' | 'NOPE') => {
    if (isLocked) return;

    setTimeout(() => {
      removeTopCard();
    }, 0); 

    if (direction === 'LIKE') {
      if (option.isCorrect) {
        // === 答对了 ===
        console.log("Bingo!");
        setIsLocked(true);
        setCorrectAnswerText(option.content);
        setIsRevealed(true);

        // 设置动画：水平推
        setSlideDirection('horizontal');

        setTimeout(() => {
          loadNewQuestion();
        }, 1200);

      } else {
        // === 答错了 (用户右滑选择了错误的答案) ===
        console.log("Wrong!");
        
        // 1. 立即锁定
        setIsLocked(true);
        
        // 2. 设置动画：垂直向上 (意思是这道题飞到错题本里去了)
        setSlideDirection('vertical');

        // 3. 打开弹窗
        // 注意：TinderCard 的飞出动画已经由 removeTopCard 触发了
        // 这里稍微延迟一点点弹窗，体验更好
        setTimeout(() => {
           setIsMistakeModalOpen(true);
        }, 300);
      }
    }
  };

  // 🔥 Modal 点击 "Next" 后的回调
  const handleMistakeModalNext = () => {
    // 关闭 Modal 的同时，触发切题
    setIsMistakeModalOpen(false);
    
    // 这里的 loadNewQuestion 会读取 slideDirection='vertical'
    // 所以旧题会向上飞，新题从下飞入
    loadNewQuestion();
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className={styles.sessionContainer}>
      
      {/* 切题动画区域 */}
      <div style={{ width: '100%', position: 'relative', height: '200px', overflow: 'hidden' }}>
        <AnimatePresence initial={false} mode='popLayout' custom={slideDirection}>
          <motion.div
            key={question.id}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.5 }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <QuizHeader 
              question={question} 
              isRevealed={isRevealed} 
              correctAnswerContent={correctAnswerText}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div 
        className={styles.cardStackContainer}
        // 当答对揭示(isRevealed) 或者 弹窗打开(isMistakeModalOpen) 时，都虚化背景
        animate={(isRevealed || isMistakeModalOpen) ? { 
          opacity: 0.3, 
          filter: "blur(5px)", 
          scale: 0.95, 
          pointerEvents: "none" 
        } : { 
          opacity: 1, 
          filter: "blur(0px)", 
          scale: 1,
          pointerEvents: "auto"
        }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence>
          {cardQueue.map((option, index) => {
            if (index > 2) return null;
            return (
              <TinderCard 
                key={option.id}
                option={option}
                index={index}
                totalCards={cardQueue.length}
                isTop={index === 0}
                disabled={isLocked} 
                onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* 🔥 放入弹窗组件 */}
      <MistakeModal 
        isOpen={isMistakeModalOpen}
        question={question} // 传入当前题目对象
        correctOption={correctOptionData}
        onNext={handleMistakeModalNext}
      />
      
    </div>
  );
}