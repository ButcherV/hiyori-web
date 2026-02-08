// src/pages/Dates/components/SmartCalendar/CalendarGrid.tsx

import React from 'react';
import styles from './CalendarGrid.module.css';
import { DateCell } from './DateCell';
import { type NavMode } from '../../PageDates';
import {
  getJapaneseHoliday,
  getRelativeLabel,
  isRedDay,
} from '../../../../utils/dateHelper'; // 修正路径
// 🟢 引入 Level 1 数据
import { datesData } from '../../Levels/Level1/Level1Data';

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

  // 判断是否处于 Day Mode (Level 1 变形模式)
  const isLevel1Mode = activeMode === 'day';

  return (
    <div className={styles.grid}>
      {blanks.map((_, i) => (
        <div key={`blank-${i}`} />
      ))}

      {days.map((d) => {
        const currentCellDate = new Date(year, month, d);
        const isGhostDay = currentCellDate.getMonth() !== month;
        const isSelected = d === day && !isGhostDay;

        // 🟢 获取 Level 1 的类型数据 (d-1 因为数组从0开始)
        const level1Item = datesData[d - 1];
        const level1Type = level1Item ? level1Item.type : 'regular';

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
            // 🟢 传入变形开关和类型
            isLevel1Mode={isLevel1Mode}
            level1Type={level1Type}
            // 在 Level 1 模式下，选中的格子不需要 hideContent 了，而是高亮显示
            // 只有非 Level 1 模式下的聚焦才需要 hideContent
            hideContent={false}
            isDimmed={isLevel1Mode && !isSelected} // Level 1 模式下，非选中的变暗一点
            holiday={holiday}
            relative={relative}
            isRed={isRed}
            isSaturday={isSaturday}
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
