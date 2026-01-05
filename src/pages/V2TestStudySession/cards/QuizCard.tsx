import React from 'react';
import styles from './QuizCard.module.css';
import commonStyles from '../TestStudySession.module.css';

interface Props {
  displayContent: string;
  isContentJa: boolean;
}

export const QuizCard: React.FC<Props> = ({ displayContent, isContentJa }) => {
  return (
    <div className={styles.container}>
      <div
        className={`
          ${styles.quizText} 
          ${isContentJa ? commonStyles.jaFont : ''}
        `}
      >
        {displayContent}
      </div>

      {/* <div className={styles.hint}>Swipe Right if Correct</div> */}
    </div>
  );
};
