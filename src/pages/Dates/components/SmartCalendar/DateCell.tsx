// src/pages/Dates/components/SmartCalendar/DateCell.tsx

import React from 'react';
import styles from './DateCell.module.css';

interface DateCellProps {
  date: Date;
  dayNum: number;
  isGhost: boolean;
  isSelected: boolean;

  // 变形相关的 Props
  isLevel1Mode: boolean; // 是否进入 Level 1 变形模式
  level1Type: string; // 'rune' | 'trap' | 'mutant' | 'regular'

  isDimmed: boolean;
  hideContent: boolean;

  holiday: string | null;
  relative: string | null;
  isRed: boolean;
  isSaturday: boolean;
  onSelect: (date: Date) => void;
}

export const DateCell: React.FC<DateCellProps> = ({
  date,
  dayNum,
  isGhost,
  isSelected,

  isLevel1Mode,
  level1Type,

  isDimmed,
  hideContent,
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
        
        /* 基础状态 */
        ${isGhost ? styles.dayGhost : ''}
        ${isSelected ? styles.daySelected : ''}
        ${isRed ? styles.dayRed : ''}
        ${isSaturday ? styles.dayBlue : ''}
        
        /* 🟢 Level 1 变形模式类 */
        ${isLevel1Mode ? styles.modeLevel1 : ''}
        ${isLevel1Mode ? styles[`type_${level1Type}`] : ''}
        
        /* 其他状态 */
        ${isDimmed ? styles.dayDimmed : ''} 
        ${hideContent ? styles.contentHidden : ''}
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
