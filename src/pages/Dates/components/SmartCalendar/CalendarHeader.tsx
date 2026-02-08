// src/pages/Dates/components/SmartCalendar/CalendarHeader.tsx

import React, { useMemo } from 'react';
import styles from './CalendarHeader.module.css';
import { getYearData } from '../../Levels/Level4/Level4Data';
// 🟢 引入新写的 helper
import {
  toKanjiNum,
  getKanjiEraYear,
  getWafuMonth,
} from '../../../../utils/dateHelper';

interface CalendarHeaderProps {
  date: Date;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ date }) => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11
  const yearData = useMemo(() => getYearData(year), [year]);

  const eraText = `${yearData.era.kanji}${getKanjiEraYear(yearData.eraYear)}`;

  // 🟢 直接调用工具函数
  // 方案 A: 纯雅称 (睦月)
  const monthText = getWafuMonth(month);

  // 方案 B: 混合式 (睦月 · 二月) - 如果你想对新手友好一点
  // const monthText = `${getWafuMonth(month)} · ${toKanjiNum(month + 1)}月`;

  return (
    <div className={styles.header}>
      <div className={`${styles.headerItem} ${styles.alignRight}`}>
        {/* 记得在 CSS 里把字体改成衬线体 (Mincho) 以匹配雅称的气质 */}
        <span className={styles.monthText}>{monthText}</span>
      </div>
      <div className={styles.headerItem}>
        <span className={styles.subText}>{year}</span>
        <span className={styles.eraText}>{eraText}</span>
      </div>
    </div>
  );
};
