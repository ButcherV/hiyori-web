import React from 'react';
import styles from './WeekRow.module.css';

export const WeekRow: React.FC = () => {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className={styles.weekRow}>
      {weekDays.map((w, idx) => (
        <div
          key={w}
          className={`
            ${styles.weekItem} 
            ${idx === 0 ? styles.sunday : ''}
            ${idx === 6 ? styles.saturday : ''}
            jaFont
          `}
        >
          {w}
        </div>
      ))}
    </div>
  );
};
