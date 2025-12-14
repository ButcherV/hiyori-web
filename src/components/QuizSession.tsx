import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './QuizSession.module.css';

import type { Vocabulary, QuizQuestion, QuizOption } from '../types';
import { RAW_DATA } from '../data';
import { generateQuestion } from '../engine';
import { TinderCard } from './TinderCard';
import { QuizHeader } from './QuizHeader';

export function QuizSession() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [cardQueue, setCardQueue] = useState<QuizOption[]>([]);
  const originalOptions = useRef<QuizOption[]>([]);
  const cycleCount = useRef(0);

  // 🔥 状态1：当前是否锁住了 (锁住时不能滑动)
  const [isLocked, setIsLocked] = useState(false);
  // 🔥 状态2：是否揭示答案 (控制 Header 动画)
  const [isRevealed, setIsRevealed] = useState(false);
  // 🔥 状态3：记录正确答案的文本，传给 Header 用
  const [correctAnswerText, setCorrectAnswerText] = useState<string>('');

  const loadNewQuestion = () => {
    // 重置所有状态
    setQuestion(null);
    setIsLocked(false);
    setIsRevealed(false);
    setCorrectAnswerText('');

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
    } else {
      loadNewQuestion();
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  const appendMoreCards = () => {
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

  const handleSwipe = (option: QuizOption, direction: 'LIKE' | 'NOPE') => {
    // 如果已经锁住了，不允许任何操作 (双重保险)
    if (isLocked) return;

    // 视觉移除卡片
    setTimeout(() => {
      removeTopCard();
    }, 0); 

    if (direction === 'LIKE') {
      if (option.isCorrect) {
        console.log("Bingo!");
        
        // 1. 🔥 立即上锁，防止继续滑动
        setIsLocked(true);
        
        // 2. 告诉 Header：开始播放填空动画
        setCorrectAnswerText(option.content); // 告诉它填什么字
        setIsRevealed(true); // 告诉它可以变身了

        // 3. 延迟切题：给动画留出 1.2秒 的展示时间
        // 用户只能盯着看动画，不能动，这样就非常安全
        setTimeout(() => {
          loadNewQuestion();
        }, 1200);

      } else {
        // 选错了暂时不做特殊处理，继续
      }
    }
  };

  const removeTopCard = () => {
    setCardQueue(prev => {
      const remaining = prev.slice(1);
      if (remaining.length <= 3) {
        setTimeout(() => appendMoreCards(), 0);
      }
      return remaining;
    });
  };

  if (!question) return <div>Loading...</div>;

return (
    <div className={styles.sessionContainer}>
      
      <QuizHeader 
        question={question} 
        isRevealed={isRevealed} 
        correctAnswerContent={correctAnswerText}
      />

      {/* 🔥🔥🔥 修改这里：把 div 改成 motion.div 
         让整个卡片区域在揭示答案时：
         1. 变透明 (opacity)
         2. 变模糊 (blur)
         3. 稍微缩小一点，产生“退后”的景深感 (scale)
      */}
      <motion.div 
        className={styles.cardStackContainer}
        animate={isRevealed ? { 
          opacity: 0.3,        // 变淡
          filter: "blur(5px)", // 虚化 (毛玻璃效果)
          scale: 0.95,         // 稍微退后
          pointerEvents: "none" // 双重保险：虚化时彻底禁止鼠标事件
        } : { 
          opacity: 1, 
          filter: "blur(0px)", 
          scale: 1,
          pointerEvents: "auto"
        }}
        transition={{ duration: 0.4 }} // 这里的时长跟 Header 的动画配合
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
    </div>
  );
}