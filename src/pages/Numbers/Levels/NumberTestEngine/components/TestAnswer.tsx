import React from 'react';
import { motion } from 'framer-motion';
import styles from './TestAnswer.module.css';
import { type GameStatus } from '../types';

interface TestAnswerProps {
  userAnswer: string;
  //   correctLength: number;
  status: GameStatus;
  onBackspace: () => void;
}

export const TestAnswer: React.FC<TestAnswerProps> = ({
  userAnswer,
  //   correctLength,
  status,
  onBackspace,
}) => {
  // 🟢 动态字号计算：根据答案长度自动缩小字体，防止溢出
  const getAssembledTextSizeClass = (text: string) => {
    const len = text.length;
    if (len >= 20) return styles.textTiny;
    if (len >= 12) return styles.textSmall;
    if (len >= 8) return styles.textMedium;
    return '';
  };

  return (
    <div
      className={`
        ${styles.answerContainer} 
        ${status === 'error' ? styles.error : ''}
        ${status === 'success' ? styles.success : ''}
        ${status === 'error' ? styles.shakeAnim : ''}
      `}
    >
      {/* 拼装区域 */}
      <div className={styles.assemblyArea}>
        <div className={styles.assemblySlots}>
          {userAnswer.length === 0 ? (
            <span className={styles.assemblyPlaceholder}>点击键盘拼装答案</span>
          ) : (
            <motion.span
              className={`
                ${styles.assembledText} 
                ${getAssembledTextSizeClass(userAnswer)}
              `}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={userAnswer}
            >
              {userAnswer}
            </motion.span>
          )}
        </div>
        {/* 退格键 */}
        <button
          className={styles.backspaceBtn}
          onClick={onBackspace}
          disabled={userAnswer.length === 0 || status !== 'answering'}
        >
          ←
        </button>
      </div>

      {/* 进度条：根据输入长度动态增长 */}
      {/* <div className={styles.progressIndicator}>
        <div
          className={styles.progressBar}
          style={{
            width: `${Math.min(100, (userAnswer.length / correctLength) * 100)}%`,
            backgroundColor:
              status === 'error' ? 'var(--color-error)' : 'var(--color-Blue)',
          }}
        />
      </div> */}
    </div>
  );
};
