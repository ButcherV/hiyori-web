// src/pages/Dates/components/SmartCalendar/DateCell.tsx

import React from 'react';
import styles from './DateCell.module.css';

interface DateCellProps {
  date: Date;
  dayNum: number;
  isGhost: boolean;
  isSelected: boolean;

  // 🟢 加回这两个属性，用于控制背景色
  isSaturday: boolean;
  isSunday: boolean;

  hideTags?: boolean;
  holiday: string | null;
  relative: string | null;
  onSelect: (date: Date) => void;
}

export const DateCell: React.FC<DateCellProps> = ({
  date,
  dayNum,
  isGhost,
  isSelected,

  // 解构
  isSaturday,
  isSunday,

  hideTags,
  holiday,
  relative,
  onSelect,
}) => {
  const hasExtraContent = Boolean(holiday || relative);
  const contentText = relative || holiday || '';
  const isShortText = contentText.length > 0 && contentText.length <= 6;

  return (
    <div
      className={`
        ${styles.dayCell} 
        ${isGhost ? styles.dayGhost : ''}
        
        /* 🟢 结构层：周六日背景 (优先级低) */
        ${isSaturday ? styles.isSaturday : ''}
        ${isSunday ? styles.isSunday : ''}

        /* 🟢 交互层：选中态 (优先级高，放在后面) */
        ${isSelected ? styles.daySelected : ''}
        
        ${hideTags ? styles.tagsHidden : ''}
      `}
      onClick={() => onSelect(date)}
    >
      <span
        className={`${styles.dayNum} ${!hasExtraContent ? styles.numClear : ''}`}
      >
        {dayNum}
      </span>

      <div className={styles.tagContainer}>
        {relative && (
          <span
            className={`
              ${styles.tag} 
              ${styles.tagRelative}
              ${isShortText ? styles.tagLarge : ''}
            `}
          >
            {relative}
          </span>
        )}
        {holiday && (
          <span
            className={`
              ${styles.tag} 
              ${styles.tagHoliday}
              ${isShortText ? styles.tagLarge : ''}
            `}
          >
            {holiday}
          </span>
        )}
      </div>
    </div>
  );
};
