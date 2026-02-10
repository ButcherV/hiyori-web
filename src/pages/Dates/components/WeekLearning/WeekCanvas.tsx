// src/pages/Dates/components/WeekLearning/WeekCanvas.tsx

import React from 'react';
import styles from './WeekCanvas.module.css';

interface WeekCanvasProps {
  currentWeekDay: number; // 0-6
}

export const WeekCanvas: React.FC<WeekCanvasProps> = ({ currentWeekDay }) => {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className={styles.container}>
      <div className={styles.weekGrid}>
        {weekDays.map((day, idx) => (
          <div
            key={day}
            className={`
              ${styles.weekCell} 
              ${idx === currentWeekDay ? styles.active : ''}
              ${idx === 0 ? styles.sunday : ''}
              ${idx === 6 ? styles.saturday : ''}
              jaFont
            `}
          >
            <div className={styles.circle}>{day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
