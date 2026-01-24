import React from 'react';
import styles from './NumberKeypad.module.css';

interface NumberKeypadProps {
  onKeyClick: (num: number) => void;
  activeNum?: number | null;
}

export const NumberKeypad: React.FC<NumberKeypadProps> = ({
  onKeyClick,
  activeNum,
}) => {
  return (
    <div className={styles.keyboardArea}>
      {/* 第一排: 0 - 4 */}
      <div className={styles.keyRow}>
        {[0, 1, 2, 3, 4].map((num) => (
          <div
            key={num}
            className={`
              ${styles.keyBtn} 
              ${activeNum === num ? styles.keyBtnActive : ''}
            `}
            onClick={() => onKeyClick(num)}
          >
            {num}
          </div>
        ))}
      </div>

      {/* 第二排: 5 - 10 */}
      <div className={styles.keyRow}>
        {[5, 6, 7, 8, 9, 10].map((num) => (
          <div
            key={num}
            className={`
              ${styles.keyBtn} 
              ${activeNum === num ? styles.keyBtnActive : ''}
            `}
            onClick={() => onKeyClick(num)}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};
