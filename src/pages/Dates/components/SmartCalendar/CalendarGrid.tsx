// src/pages/Dates/components/SmartCalendar/CalendarGrid.tsx

import React from 'react';
import styles from './CalendarGrid.module.css'; // 确保引用了正确的 CSS
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

  // 计算月初空白
  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay();
  const blanks = Array(startDayOfWeek).fill(null);

  // 固定 31 天
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className={styles.grid}>
      {blanks.map((_, i) => (
        <div key={`blank-${i}`} />
      ))}

      {days.map((d) => {
        const currentCellDate = new Date(year, month, d);
        // 判断是否是“幽灵日” (即实际上已经跳到了下个月)
        const isGhostDay = currentCellDate.getMonth() !== month;

        const isSelected = d === day && !isGhostDay;
        const isFocus = activeMode === 'day' && isSelected;

        // 获取情报 (幽灵日不计算)
        const holiday = !isGhostDay
          ? getJapaneseHoliday(currentCellDate)
          : null;
        const relative = !isGhostDay ? getRelativeLabel(currentCellDate) : null;
        const isRed = !isGhostDay && isRedDay(currentCellDate);
        const isSaturday =
          !isGhostDay && currentCellDate.getDay() === 6 && !isRed;

        return (
          <DateCell
            key={d}
            date={currentCellDate}
            dayNum={d}
            isGhost={isGhostDay}
            isSelected={isSelected}
            isFocus={isFocus}
            holiday={holiday}
            relative={relative}
            isRed={isRed}
            isSaturday={isSaturday}
            // 🟢 修复核心：如果是幽灵日，就传一个空函数，或者在 DateCell 里拦截
            // 这里我们选择直接拦截：只有非幽灵日才触发 onDateSelect
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
