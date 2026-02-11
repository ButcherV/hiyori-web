// src/pages/Dates/components/SmartCalendar/CalendarHeader.tsx

import React, { useMemo } from 'react';
import styles from './CalendarHeader.module.css';
import { getYearData } from '../../Datas/YearData';
import {
  getKanjiEraYear,
  getWafuMonth,
  toKanjiNum,
} from '../../../../utils/dateHelper';

interface CalendarHeaderProps {
  date: Date;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date }) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 🟢 获取动态日期 (1-31)

  const yearData = useMemo(() => getYearData(year), [year]);

  const eraText = `${yearData.era.kanji}${getKanjiEraYear(yearData.eraYear)}`;
  const monthText = getWafuMonth(month); // 和风月名 (如月)

  // 🟢 获取英文月份 (February)
  const enMonth = date.toLocaleString('en-US', { month: 'long' });

  return (
    <div className={styles.header}>
      {/* 左侧：年号 + 西历 */}
      <div className={`${styles.headerItem} ${styles.alignLeft}`}>
        <span className={`${styles.eraText} jaFont`}>{eraText}</span>
        <span className={styles.subText}>{year}</span>
      </div>

      {/* 中间：日期 (跟随选中) */}
      <div className={`${styles.headerItem}`}>
        <span className={styles.today}>{day}</span>
      </div>

      {/* 右侧：英文月 + 和风月 */}
      <div className={`${styles.headerItem} ${styles.alignRight}`}>
        <span className={styles.subText}>{enMonth}</span>
        <span
          className={`${styles.eraText} jaFont`}
        >{`${toKanjiNum(month + 1)}月（${monthText}）`}</span>
      </div>
    </div>
  );
};
