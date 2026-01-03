import React from 'react';
import styles from '../TestStudySession.module.css'; // ✅ 向上引用样式

interface Props {
  displayContent: string;
  isContentJa: boolean; // Logic 层在 Quiz 生成时通常知道这是否是日文
}

export const QuizCard: React.FC<Props> = ({ displayContent, isContentJa }) => {
  return (
    <div className={styles.quizMode}>
      <div
        className={`
          ${styles.quizText} 
          ${isContentJa ? styles.jaFont : ''}
        `}
      >
        {displayContent}
      </div>

      <div className={styles.hint}>Swipe Right if Correct</div>
    </div>
  );
};
