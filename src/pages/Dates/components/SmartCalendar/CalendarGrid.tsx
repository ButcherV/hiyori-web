// src/pages/Dates/components/SmartCalendar/CalendarGrid.tsx

import React from 'react';
import styles from './CalendarGrid.module.css';
import { DateCell } from './DateCell';
import { type NavMode } from '../../PageDates';
import {
  getJapaneseHoliday,
  getRelativeLabel,
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

        // 🟢 计算星期属性
        const dayOfWeek = currentCellDate.getDay();
        const isSunday = dayOfWeek === 0;
        const isSaturday = dayOfWeek === 6;

        // 辅助信息
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
            // 🟢 传递结构层属性
            isSaturday={!isGhostDay && isSaturday}
            isSunday={!isGhostDay && isSunday}
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
