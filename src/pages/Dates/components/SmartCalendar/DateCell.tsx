// src/pages/Dates/components/SmartCalendar/DateCell.tsx

import React from 'react';
import styles from './DateCell.module.css';

interface DateCellProps {
  date: Date;
  dayNum: number;
  isGhost: boolean;
  isSelected: boolean;
  isSaturday: boolean;
  isSunday: boolean;
  hideTags?: boolean;
  holiday: string | null;
  relative: string | null;
  isHolidayMode?: boolean;
  onSelect: (date: Date) => void;
}

export const DateCell: React.FC<DateCellProps> = ({
  date,
  dayNum,
  isGhost,
  isSelected,
  isSaturday,
  isSunday,
  hideTags,
  holiday,
  relative,
  isHolidayMode,
  onSelect,
}) => {
  const hasExtraContent = Boolean(holiday || relative);

  // 🟢 核心逻辑：计算单元格内可容纳的总字数
  const totalLength = (relative?.length || 0) + (holiday?.length || 0);

  // 🟢 分为三档精细化控制字号
  let sizeMode: 'mini' | 'short' | 'long' = 'long';
  if (totalLength > 0 && totalLength <= 3) {
    sizeMode = 'mini'; // 3个字符以内 -> 13px
  } else if (totalLength > 3 && totalLength <= 6) {
    sizeMode = 'short'; // 6个字符以内 -> 11px
  } else {
    sizeMode = 'long'; // 其他/更长 -> 9px
  }

  return (
    <div
      className={`
        ${styles.dayCell} 
        ${isGhost ? styles.dayGhost : ''}
        ${isSaturday ? styles.isSaturday : ''}
        ${isSunday ? styles.isSunday : ''}
        ${isSelected ? styles.daySelected : ''}
        ${hideTags ? styles.tagsHidden : ''}
        ${isHolidayMode && !holiday ? styles.holidayDimmed : ''}
      `}
      onClick={() => {
        if (isHolidayMode && !holiday) return;
        onSelect(date);
      }}
    >
      <span
        className={`${styles.dayNum} ${!hasExtraContent ? styles.numClear : ''}`}
      >
        {dayNum}
      </span>

      <div className={styles.tagContainer}>
        {/* 相对时间标签（如：今天） */}
        {relative && (
          <span
            className={`
              ${styles.tag} 
              ${styles.tagRelative}
              ${styles[`size_${sizeMode}`]} 
            `}
          >
            {relative}
          </span>
        )}
        {/* 节日标签（如：元日） */}
        {holiday && (
          <span
            className={`
              ${styles.tag} 
              ${styles.tagHoliday}
              ${styles[`size_${sizeMode}`]}
            `}
          >
            {holiday}
          </span>
        )}
      </div>
    </div>
  );
};
