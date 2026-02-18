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

  const shouldHideTags = activeMode === 'day';

  // 1. 本月第一天 & 星期几 (决定前面补几个)
  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay(); // 0(Sun) - 6(Sat)

  // 2. 本月最后一天 & 总天数 (决定中间渲染几个)
  const lastDayObj = new Date(year, month + 1, 0);
  const daysInMonth = lastDayObj.getDate();

  // A. 【上月补位】 (Ghost)
  const prevDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    // 倒推：1号往前数
    return new Date(year, month, 1 - (startDayOfWeek - i));
  });

  // B. 【本月日期】 (Real)
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });

  // C. 【下月补位】 (Ghost) - 关键逻辑：补齐最后一行
  const totalCellsSoFar = prevDays.length + currentDays.length;
  const remainder = totalCellsSoFar % 7;
  // 如果能整除(0)，说明刚好填满，不用补；否则补 (7 - 余数) 个
  const daysToAdd = remainder === 0 ? 0 : 7 - remainder;

  const nextDays = Array.from({ length: daysToAdd }, (_, i) => {
    return new Date(year, month + 1, i + 1);
  });

  return (
    <div className={styles.grid}>
      {/* 1. 渲染上月 Ghost */}
      {prevDays.map((dObj) => (
        <DateCell
          key={`prev-${dObj.getDate()}`}
          date={dObj}
          dayNum={dObj.getDate()}
          isGhost={true}
          isSelected={false}
          isSaturday={dObj.getDay() === 6}
          isSunday={dObj.getDay() === 0}
          hideTags={shouldHideTags}
          holiday={null}
          relative={null}
          onSelect={() => {}}
        />
      ))}

      {/* 2. 渲染本月 Real */}
      {currentDays.map((dObj) => {
        const dNum = dObj.getDate();
        const isSelected = dNum === day; // 这里肯定是本月，直接对比数字即可
        const dayOfWeek = dObj.getDay();
        const holiday = getJapaneseHoliday(dObj);
        const relative = getRelativeLabel(dObj);

        return (
          <DateCell
            key={`curr-${dNum}`}
            date={dObj}
            dayNum={dNum}
            isGhost={false}
            isSelected={isSelected}
            isSaturday={dayOfWeek === 6}
            isSunday={dayOfWeek === 0}
            hideTags={shouldHideTags}
            holiday={holiday}
            relative={relative}
            onSelect={onDateSelect}
          />
        );
      })}

      {/* 3. 渲染下月 Ghost (填补空缺) */}
      {nextDays.map((dObj) => (
        <DateCell
          key={`next-${dObj.getDate()}`}
          date={dObj}
          dayNum={dObj.getDate()}
          isGhost={true}
          isSelected={false}
          isSaturday={dObj.getDay() === 6}
          isSunday={dObj.getDay() === 0}
          hideTags={shouldHideTags}
          holiday={null}
          relative={null}
          onSelect={() => {}}
        />
      ))}
    </div>
  );
};
