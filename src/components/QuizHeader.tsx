import { motion, AnimatePresence } from 'framer-motion';
import styles from './QuizHeader.module.css';
import type { QuizQuestion, QuizOption } from '../types';

interface QuizHeaderProps {
  question: QuizQuestion;
  // 🔥 新增：是否揭示答案
  isRevealed: boolean; 
  // 🔥 新增：如果是揭示状态，需要知道正确答案的内容来填空
  correctAnswerContent?: string; 
}

export function QuizHeader({ question, isRevealed, correctAnswerContent }: QuizHeaderProps) {
  const { prompt } = question;

  // 这里省略 Color 类型的处理，专注于文字填空
  
  const text = prompt.display; 
  const highlightIndex = prompt.highlightIndex;

  if (highlightIndex === undefined || highlightIndex < 0) {
    return <div className={styles.headerContainer}>{text}</div>;
  }

  const chars = text.split('');

  return (
    <motion.div 
      className={styles.headerContainer}
      // 🔥 整体动画：如果是揭示状态，稍微放大一点变绿，表示成功
      animate={isRevealed ? { scale: 1.1, color: 'var(--color-success)' } : { scale: 1, color: 'var(--color-text-main)' }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={styles.promptText}>
        {chars.map((char, index) => {
          const isTarget = index === highlightIndex;

          if (isTarget) {
            return (
              <span key={index} className={styles.highlightChar} style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                {/* 这里用了 AnimatePresence 实现切换动画：
                   如果没有揭示 -> 显示下划线占位
                   如果揭示了 -> 显示正确答案 
                */}
                <AnimatePresence mode='wait'>
                  {!isRevealed ? (
                    <motion.span 
                      key="placeholder"
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }}
                    >
                    </motion.span>
                  ) : (
                    <motion.span
                      key="answer"
                      // 🔥 动画：从下方滑入 (y: 20 -> 0)
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      style={{ display: 'inline-block' }}
                    >
                      {correctAnswerContent}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            );
          }
          
          return <span key={index} className={styles.normalChar}>{char}</span>;
        })}
      </div>
      
      <div className={styles.modeLabel}>
        {question.mode.replace(/_/g, ' ')}
      </div>
    </motion.div>
  );
}