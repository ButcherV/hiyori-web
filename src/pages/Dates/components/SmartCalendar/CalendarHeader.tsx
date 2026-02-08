// src/pages/Dates/components/SmartCalendar/CalendarHeader.tsx

import React, { useMemo } from 'react';
import styles from './CalendarHeader.module.css';
import { getYearData } from '../../Levels/Level4/Level4Data';
import { toKanjiNum, getKanjiEraYear } from '../../../../utils/dateHelper';

interface CalendarHeaderProps {
  date: Date;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date }) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const yearData = useMemo(() => getYearData(year), [year]);

  // 🔴 修正点：
  // 1. 使用 yearData.eraYear 而不是 value
  // 2. 使用 yearData.era.kanji (例如"令和") + getKanjiEraYear (例如"八年")
  const eraText = `${yearData.era.kanji}${getKanjiEraYear(yearData.eraYear)}`;

  const monthText = `${toKanjiNum(month)}月`;

  return (
    <div className={styles.header}>
      {/* 右侧：月份展示 */}
      <div className={`${styles.headerItem} ${styles.alignRight}`}>
        <span className={styles.monthText}>{monthText}</span>
      </div>
      {/* 左侧：年号展示 */}
      <div className={styles.headerItem}>
        <span className={styles.subText}>{year}</span>
        <span className={styles.eraText}>{eraText}</span>
      </div>
    </div>
  );
};
