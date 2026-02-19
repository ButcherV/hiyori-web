import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarHeader.module.css';
import { getYearData } from '../../Datas/YearData';
import {
  getKanjiEraYear,
  getWafuMonth,
  toKanjiNum,
} from '../../../../utils/dateHelper';

interface CalendarHeaderProps {
  date: Date;
  onMonthChange?: (offset: number) => void;
  // 🟢 新增控制属性
  canPrev?: boolean;
  canNext?: boolean;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  onMonthChange,
  canPrev = true,
  canNext = true,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  const yearData = useMemo(() => getYearData(year), [year]);

  const eraText = `${yearData.era.kanji}${getKanjiEraYear(yearData.eraYear)}`;
  const monthText = getWafuMonth(month);
  const enMonth = date.toLocaleString('en-US', { month: 'long' });

  return (
    <div className={styles.header}>
      {/* 🟢 Prev Button */}
      {onMonthChange && (
        <button
          className={styles.navBtn}
          onClick={() => canPrev && onMonthChange(-1)}
          disabled={!canPrev}
          style={{
            // 如果不可用，完全透明且不可点，但保留占位防止布局跳动
            opacity: canPrev ? 1 : 0,
            pointerEvents: canPrev ? 'auto' : 'none',
            cursor: canPrev ? 'pointer' : 'default',
          }}
        >
          <ChevronLeft size={24} strokeWidth={2} />
        </button>
      )}

      {/* 中间信息区域 (保持你的 Wrapper 结构) */}
      <div className={styles.headerCenterWrapper}>
        {/* Left: Year + Era */}
        <div className={`${styles.headerItem} ${styles.alignRight}`}>
          <span className={styles.subText}>{year}</span>
          <span className={`${styles.eraText} jaFont`}>{eraText}</span>
        </div>

        {/* Center: Date */}
        <div className={styles.today}>{day}</div>

        {/* Right: Month */}
        <div className={`${styles.headerItem} ${styles.alignLeft}`}>
          <span className={styles.subText}>{enMonth}</span>
          <span className={`${styles.eraText} jaFont`}>
            {`${toKanjiNum(month + 1)}月·${monthText}`}
          </span>
        </div>
      </div>

      {/* 🟢 Next Button */}
      {onMonthChange && (
        <button
          className={styles.navBtn}
          onClick={() => canNext && onMonthChange(1)}
          disabled={!canNext}
          style={{
            opacity: canNext ? 1 : 0,
            pointerEvents: canNext ? 'auto' : 'none',
            cursor: canNext ? 'pointer' : 'default',
          }}
        >
          <ChevronRight size={24} strokeWidth={2} />
        </button>
      )}
    </div>
  );
};
