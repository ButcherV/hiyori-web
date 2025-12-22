import { useState, useEffect, useRef, useCallback } from 'react';
import _ from 'lodash';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './QuizSession.module.css';

import type { Vocabulary, QuizQuestion, QuizOption } from '../types';
import { RAW_DATA } from '../data';
import { generateQuestion } from '../engine';
import { TinderCard } from './TinderCard';
import { QuizHeader } from './QuizHeader';
import { MistakeModal } from './MistakeModal';
import { SessionSettings } from './SessionSettings';

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
    y: direction === 'vertical' ? -300 : 0,
    opacity: 0,
    position: 'absolute' as const,
  }),
};

export function QuizSession() {
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [cardQueue, setCardQueue] = useState<QuizOption[]>([]);
  const originalOptions = useRef<QuizOption[]>([]);
  const cycleCount = useRef(0);

  const [isLocked, setIsLocked] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [correctAnswerText, setCorrectAnswerText] = useState<string>('');

  const [correctOptionData, setCorrectOptionData] = useState<
    QuizOption | undefined
  >(undefined);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);

  // 🔥 控制设置面板开启/关闭的状态
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [slideDirection, setSlideDirection] = useState<
    'horizontal' | 'vertical'
  >('horizontal');

  const loadNewQuestion = useCallback(() => {
    setIsLocked(false);
    setIsRevealed(false);
    setCorrectAnswerText('');
    setCorrectOptionData(undefined);
    setIsMistakeModalOpen(false);

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
      setCorrectOptionData(validQuestion.options.find((o) => o.isCorrect));
    }
  }, []);

  useEffect(() => {
    loadNewQuestion();
  }, [loadNewQuestion]);

  const appendMoreCards = () => {
    if (originalOptions.current.length === 0) return;
    cycleCount.current += 1;
    const currentCycle = cycleCount.current;
    const newBatch = _.shuffle([...originalOptions.current]);
    const rebornBatch = newBatch.map((opt) => ({
      ...opt,
      id: `${opt.id}_cycle_${currentCycle}`,
    }));

    setCardQueue((prev) => {
      const lastCard = prev[prev.length - 1];
      if (
        lastCard &&
        rebornBatch.length > 1 &&
        rebornBatch[0].content === lastCard.content
      ) {
        const first = rebornBatch.shift()!;
        rebornBatch.push(first);
      }
      return [...prev, ...rebornBatch];
    });
  };

  const removeTopCard = () => {
    setCardQueue((prev) => {
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
        console.log('Bingo!');
        setIsLocked(true);
        setCorrectAnswerText(option.content);
        setIsRevealed(true);
        setSlideDirection('horizontal');
        setTimeout(() => {
          loadNewQuestion();
        }, 1200);
      } else {
        console.log('Wrong!');
        setIsLocked(true);
        setSlideDirection('vertical');
        setTimeout(() => {
          setIsMistakeModalOpen(true);
        }, 300);
      }
    }
  };

  const handleMistakeModalNext = () => {
    setIsMistakeModalOpen(false);
    loadNewQuestion();
  };

  // 🔥 3. 处理退出逻辑 (模拟回到首页)
  const handleQuit = () => {
    // 这里未来可以是路由跳转 navigate('/')
    window.location.reload();
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className={styles.sessionContainer}>
      {/* 🔥 4. 设置按钮 (Gear Icon) */}
      {/* 使用绝对定位，固定在右上角，不受 slide 动画影响 */}
      <div
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 100, // 确保层级高，能点到
          cursor: 'pointer',
          padding: 8,
          fontSize: '1.5rem',
          opacity: 0.7,
          transition: 'opacity 0.2s',
        }}
        onClick={() => setIsSettingsOpen(true)}
      >
        ⚙️
      </div>

      {/* 切题动画区域 */}
      <div
        style={{
          width: '100%',
          position: 'relative',
          height: '200px',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence
          initial={false}
          mode="popLayout"
          custom={slideDirection}
        >
          <motion.div
            key={question.id}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.5,
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
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
        // 注意：当设置打开(isSettingsOpen)时，背景也最好虚化一下
        animate={
          isRevealed || isMistakeModalOpen || isSettingsOpen
            ? {
                opacity: 0.3,
                filter: 'blur(5px)',
                scale: 0.95,
                pointerEvents: 'none',
              }
            : {
                opacity: 1,
                filter: 'blur(0px)',
                scale: 1,
                pointerEvents: 'auto',
              }
        }
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

      {/* 错题弹窗 */}
      <MistakeModal
        isOpen={isMistakeModalOpen}
        question={question}
        correctOption={correctOptionData}
        onNext={handleMistakeModalNext}
      />

      {/* 🔥 5. 放入设置面板组件 */}
      <SessionSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onQuit={handleQuit}
      />
    </div>
  );
}
