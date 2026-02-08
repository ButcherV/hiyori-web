// src/pages/Dates/components/SmartCalendar/DateCell.tsx

import React from 'react';
import styles from './DateCell.module.css';

interface DateCellProps {
  date: Date;
  dayNum: number;
  isGhost: boolean;
  isSelected: boolean;

  // 🟢 仅保留这一个控制属性：用于进场动画时隐藏标签
  hideTags?: boolean;

  // 数据属性
  holiday: string | null;
  relative: string | null;

  // 交互
  onSelect: (date: Date) => void;

  // ❌ 已删除废弃属性：
  // isRed, isSaturday (已去色)
  // hideContent, isDimmed (逻辑已移除)
}

export const DateCell: React.FC<DateCellProps> = ({
  date,
  dayNum,
  isGhost,
  isSelected,
  hideTags,
  holiday,
  relative,
  onSelect,
}) => {
  // 1. 判断内容情况：如果有额外内容，数字就退居二线（变淡）
  const hasExtraContent = Boolean(holiday || relative);

  // 2. 字数判断逻辑：决定是否使用大字号
  const contentText = relative || holiday || '';
  const isShortText = contentText.length > 0 && contentText.length <= 6;

  return (
    <div
      className={`
        ${styles.dayCell} 
        ${isGhost ? styles.dayGhost : ''}
        ${isSelected ? styles.daySelected : ''}
        
        /* ❌ 删除了 styles.dayRed, styles.dayBlue, styles.dayDimmed */
        
        /* 🟢 仅保留这个隐藏类 */
        ${hideTags ? styles.tagsHidden : ''}
      `}
      onClick={() => onSelect(date)}
    >
      {/* 数字：如果没有额外内容，应用清晰模式 (numClear) */}
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
