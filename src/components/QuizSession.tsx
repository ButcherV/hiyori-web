// src/components/QuizSession.tsx
import { useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { AnimatePresence } from 'framer-motion';
import styles from './QuizSession.module.css';

import type { Vocabulary, QuizQuestion, QuizOption, QuizMode } from '../types';
import { RAW_DATA } from '../data';
import { generateQuestion } from '../engine';
import { TinderCard } from './TinderCard';

export function QuizSession() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  
  // 当前显示在屏幕上的牌堆
  const [cardQueue, setCardQueue] = useState<QuizOption[]>([]);
  
  // 【关键】保存题目最初生成的选项（种子数据），用于无限复制
  const originalOptions = useRef<QuizOption[]>([]);
  
  // 【关键】记录轮次，用于生成不重复的 ID
  const cycleCount = useRef(0);

  // 1. 初始化新题目
// 1. 初始化新题目
  const loadNewQuestion = () => {
    // 每次换题前，先把旧题清空，避免闪烁
    setQuestion(null);

    let validQuestion: QuizQuestion | null = null;
    let attempts = 0;

    // 尝试生成题目
    while (!validQuestion && attempts < 50) {
      const randomWord = _.sample(RAW_DATA) as Vocabulary;
      
      // 🔥 修改重点在这里：
      // 以前是随机算一个 randomMode，现在我们强制写死 'KANA_FILL_BLANK'
      // 这样就只会生成填空题了
      validQuestion = generateQuestion(randomWord, 'KANA_FILL_BLANK');
      
      attempts++;
    }

    if (validQuestion) {
      setQuestion(validQuestion);
      
      // 保存种子
      originalOptions.current = validQuestion.options;
      cycleCount.current = 0;

      setCardQueue(validQuestion.options); 
    } else {
      // 如果运气不好50次都没随到能填空的词，就重试
      console.warn("Retrying to find a valid question...");
      loadNewQuestion();
    }
  };

  useEffect(() => {
    loadNewQuestion();
  }, []);

  // 2. 核心：生成并追加新的一组卡片
  const appendMoreCards = () => {
    if (originalOptions.current.length === 0) return;

    cycleCount.current += 1; // 轮次 +1
    const currentCycle = cycleCount.current;

    // 1. 复制并打乱种子数据
    const newBatch = _.shuffle([...originalOptions.current]);

    // 2. 给每个卡片生成全新的 ID (防止 React Key 冲突)
    // 例如: "word_correct" -> "word_correct_cycle_1"
    const rebornBatch = newBatch.map(opt => ({
      ...opt,
      id: `${opt.id}_cycle_${currentCycle}`
    }));

    // 3. 追加到队列末尾
    setCardQueue(prev => {
      // (可选优化) 检查连接处是否重复：prev的最后一张 vs newBatch的第一张
      // 如果重复，把 newBatch 的第一张挪到最后
      const lastCard = prev[prev.length - 1];
      if (lastCard && rebornBatch.length > 1 && rebornBatch[0].content === lastCard.content) {
         const first = rebornBatch.shift()!;
         rebornBatch.push(first);
      }
      return [...prev, ...rebornBatch];
    });
    
    console.log(`无感追加了 ${rebornBatch.length} 张新卡 (Cycle ${currentCycle})`);
  };

  // 3. 处理滑动
  const handleSwipe = (option: QuizOption, direction: 'LIKE' | 'NOPE') => {
    // 这里的 option 是当前这张卡的快照，包含是否正确的信息
    
    // 不管怎样，先从 UI 上移除这张卡
    // 注意：这里的移除仅仅是触发 React 状态更新，视觉动画由 TinderCard 内部处理了
    setTimeout(() => {
      removeTopCard();
    }, 0); // 立即执行状态移除逻辑，配合 AnimatePresence

    if (direction === 'LIKE') {
      if (option.isCorrect) {
        console.log("Bingo! 答对了");
        // 暂时不切题，让你体验无限循环
      } else {
        // 选了错的
      }
    } else {
      // 扔掉了
    }
  };

  // 4. 移除顶部卡片 & 检查是否需要补货
  const removeTopCard = () => {
    setCardQueue(prev => {
      const remaining = prev.slice(1); // 切掉第一张
      
      // 【关键阈值】如果只剩 3 张或更少，立刻补货
      if (remaining.length <= 3) {
        // 因为 appendMoreCards 也是 setCardQueue，为了避免冲突，
        // 我们最好在这里直接计算好，或者异步调用追加
        // 这里为了简单，我们选择异步调用追加，React 会自动批处理
        setTimeout(() => appendMoreCards(), 0);
      }
      
      return remaining;
    });
  };

  const renderPrompt = (prompt: QuizQuestion['prompt']) => {
    if (prompt.type === 'COLOR') {
      return <div style={{ backgroundColor: prompt.display, width: 120, height: 120, borderRadius: 24 }} />;
    }
    const text = prompt.display;
    const idx = prompt.highlightIndex;
    if (idx === undefined || idx < 0) return <span>{text}</span>;
    return (
      <span>
        {text.split('').map((char, i) => (
          <span key={i} className={i === idx ? styles.highlight : ''}>{char}</span>
        ))}
      </span>
    );
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className={styles.sessionContainer}>
      <div className={styles.header}>
        <div className={styles.prompt}>
          {renderPrompt(question.prompt)}
        </div>
        <div style={{ color: 'var(--color-text-sub)', fontSize: '0.8rem', marginTop: 10 }}>
          {question.mode.replace(/_/g, ' ')}
        </div>
      </div>

      <div className={styles.cardStackContainer}>
        <AnimatePresence>
          {cardQueue.map((option, index) => {
            // 性能优化：永远只渲染最上面的 3 张
            // 后面的卡片虽然在 state 里，但不渲染 DOM
            if (index > 2) return null;

            return (
              <TinderCard 
                key={option.id} // 这里的 ID 已经是加过后缀的唯一 ID 了
                option={option}
                index={index}
                totalCards={cardQueue.length} // 这个总数其实对渲染只起 z-index 作用，大一点没关系
                isTop={index === 0}
                onSwipe={handleSwipe}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}