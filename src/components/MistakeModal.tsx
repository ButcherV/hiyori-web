import { motion, AnimatePresence } from 'framer-motion';
import styles from './MistakeModal.module.css';
import type { QuizOption, QuizQuestion } from '../types';

interface MistakeModalProps {
  isOpen: boolean;
  // 🔥 新增：必须把整个题目对象传进来，否则无法还原上下文
  question: QuizQuestion | null;
  correctOption?: QuizOption; 
  onNext: () => void; 
}

export function MistakeModal({ isOpen, question, correctOption, onNext }: MistakeModalProps) {
  
  // 根据不同的题型，渲染不同的正确答案展示形式
  const renderCorrectContent = () => {
    if (!question || !correctOption) return null;

    // === 情况 1：填空题 (显示完整单词，高亮填空处) ===
    if (question.mode === 'KANA_FILL_BLANK') {
      const { prompt } = question;
      const text = prompt.display; // 例如 "_なた"
      const highlightIndex = prompt.highlightIndex;

      // 如果数据有误，降级显示
      if (highlightIndex === undefined || highlightIndex < 0) {
        return <div className={styles.wordRow}>{correctOption.content}</div>;
      }

      const chars = text.split('');

      return (
        <div className={styles.wordRow}>
          {chars.map((char, index) => {
            const isTarget = index === highlightIndex;
            return (
              <span 
                key={index} 
                className={isTarget ? styles.highlightChar : styles.normalChar}
              >
                {/* 如果是挖空的位置，显示正确选项的内容；否则显示原来的字 */}
                {isTarget ? correctOption.content : char}
              </span>
            );
          })}
        </div>
      );
    }

    // === 情况 2：其他题型预留 (未来扩展) ===
    // 比如 'WORD_TO_MEANING' 可能直接显示单词
    // if (question.mode === 'WORD_TO_MEANING') { ... }

    // 默认兜底显示
    return <div className={styles.wordRow}>{correctOption.content}</div>;
  };

  return (
    <AnimatePresence>
      {isOpen && question && correctOption && (
        <motion.div 
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className={styles.modalCard}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className={styles.icon}>😅</div>
            
            <div className={styles.title}>Oops! 选错了</div>

            <div className={styles.correctAnswerContainer}>
              <div className={styles.label}>正确答案是</div>
              {/* 🔥 调用渲染逻辑 */}
              {renderCorrectContent()}
            </div>

            <div className={styles.notebookNote}>
              <span>📝</span> 已自动加入错题本
            </div>

            <button className={styles.nextButton} onClick={onNext}>
              继续 (Next)
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}