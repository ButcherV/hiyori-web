// src/pages/Dates/components/SmartCalendar/WeekRow.tsx

import React from 'react';
import styles from './WeekRow.module.css';
import { type NavMode } from '../../PageDates';

interface WeekRowProps {
  currentWeekDay: number; // 0-6
  activeMode: NavMode;
  onModeChange: (mode: NavMode) => void;
}

export const WeekRow: React.FC<WeekRowProps> = ({
  currentWeekDay,
  activeMode,
  onModeChange,
}) => {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className={styles.weekRow}>
      {weekDays.map((w, idx) => {
        const isWeekFocus = activeMode === 'week' && idx === currentWeekDay;
        return (
          <div
            key={w}
            className={`
              ${styles.weekItem} 
              ${isWeekFocus ? styles.weekActive : ''}
              ${idx === 0 ? styles.sunday : ''}
              ${idx === 6 ? styles.saturday : ''}
              jaFont
            `}
            onClick={() => onModeChange('week')}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};
