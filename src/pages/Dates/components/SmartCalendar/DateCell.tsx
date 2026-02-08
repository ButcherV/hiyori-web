// src/pages/Dates/components/SmartCalendar/DateCell.tsx

import React from 'react';
import styles from './DateCell.module.css';

interface DateCellProps {
  date: Date;
  dayNum: number;
  isGhost: boolean;
  isSelected: boolean;
  isFocus: boolean;
  holiday: string | null;
  relative: string | null;
  isRed: boolean; // 新增：是否红日子 (周日/祝日)
  isSaturday: boolean; // 新增：是否蓝日子 (周六)
  onSelect: (date: Date) => void;
}

export const DateCell: React.FC<DateCellProps> = ({
  date,
  dayNum,
  isGhost,
  isSelected,
  isFocus,
  holiday,
  relative,
  isRed,
  isSaturday,
  onSelect,
}) => {
  return (
    <div
      className={`
        ${styles.dayCell} 
        ${isGhost ? styles.dayGhost : ''}
        ${isSelected ? styles.daySelected : ''}
        ${isFocus ? styles.dayFocus : ''}
        ${isRed ? styles.dayRed : ''}
        ${isSaturday ? styles.dayBlue : ''}
      `}
      onClick={() => onSelect(date)}
    >
      <span className={styles.dayNum}>{dayNum}</span>
      <div className={styles.tagContainer}>
        {relative && (
          <span className={`${styles.tag} ${styles.tagRelative}`}>
            {relative}
          </span>
        )}
        {holiday && (
          <span className={`${styles.tag} ${styles.tagHoliday}`}>
            {holiday}
          </span>
        )}
      </div>
    </div>
  );
};
