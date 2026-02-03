import React from 'react';
import { Delete } from 'lucide-react';
import styles from './KeypadArea.module.css';

interface Props {
  onKeyClick: (key: number | string) => void;
}

export const KeypadArea: React.FC<Props> = ({ onKeyClick }) => {
  const nums = [7, 8, 9, 4, 5, 6, 1, 2, 3];

  return (
    <div className={styles.keypadArea}>
      <div className={styles.keypadGrid}>
        {nums.map((num) => (
          <button
            key={num}
            onClick={() => onKeyClick(num)}
            className={`${styles.keyBtn} ${styles.keyBtnNum}`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onKeyClick('clear')}
          className={`${styles.keyBtn} ${styles.keyBtnClear}`}
        >
          AC
        </button>

        <button
          onClick={() => onKeyClick(0)}
          className={`${styles.keyBtn} ${styles.keyBtnNum}`}
        >
          0
        </button>

        <button
          onClick={() => onKeyClick('delete')}
          className={`${styles.keyBtn} ${styles.keyBtnDelete}`}
        >
          <Delete size={20} />
        </button>
      </div>
    </div>
  );
};
