import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // 🟢 Import Icons
import styles from './CalendarHeader.module.css';
import { getYearData } from '../../Datas/YearData';
import {
  getKanjiEraYear,
  getWafuMonth,
  toKanjiNum,
} from '../../../../utils/dateHelper';

interface CalendarHeaderProps {
  date: Date;
  // 🟢 Optional prop for navigation
  onMonthChange?: (offset: number) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  date,
  onMonthChange,
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
        <button className={styles.navBtn} onClick={() => onMonthChange(-1)}>
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>
      )}

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
        <button className={styles.navBtn} onClick={() => onMonthChange(1)}>
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
};
