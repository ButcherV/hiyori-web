// src/pages/Dates/components/SmartCalendar/CalendarGrid.tsx

import React from 'react';
import styles from './CalendarGrid.module.css';
import { DateCell } from './DateCell';
import { type NavMode } from '../../PageDates';
import {
  getJapaneseHoliday,
  getRelativeLabel,
  isRedDay,
} from '../../../../utils/dateHelper';

interface CalendarGridProps {
  date: Date;
  activeMode: NavMode;
  onDateSelect: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  date,
  activeMode,
  onDateSelect,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay();
  const blanks = Array(startDayOfWeek).fill(null);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 🟢 核心逻辑：如果处于 Day 模式，就要求隐藏所有标签
  const shouldHideTags = activeMode === 'day';

  return (
    <div className={styles.grid}>
      {blanks.map((_, i) => (
        <div key={`blank-${i}`} />
      ))}

      {days.map((d) => {
        const currentCellDate = new Date(year, month, d);
        const isGhostDay = currentCellDate.getMonth() !== month;
        const isSelected = d === day && !isGhostDay;

        const holiday = !isGhostDay
          ? getJapaneseHoliday(currentCellDate)
          : null;
        const relative = !isGhostDay ? getRelativeLabel(currentCellDate) : null;

        return (
          <DateCell
            key={d}
            date={currentCellDate}
            dayNum={d}
            isGhost={isGhostDay}
            isSelected={isSelected}
            // 🟢 传给子组件
            hideTags={shouldHideTags}
            holiday={holiday}
            relative={relative}
            onSelect={(dt) => {
              if (!isGhostDay) {
                onDateSelect(dt);
              }
            }}
          />
        );
      })}
    </div>
  );
};
