import React from 'react';
import styles from './CalendarGrid.module.css';
import { DateCell } from './DateCell';
import { type NavMode } from '../../PageDates';
import {
  getJapaneseHoliday,
  getRelativeLabel,
} from '../../../../utils/dateHelper';
import { getCustomHolidayName } from '../../Datas/holidayData';

interface CalendarGridProps {
  date: Date;
  activeMode: NavMode;
  onDateSelect: (date: Date) => void;
  isHolidayMode?: boolean;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  date,
  activeMode,
  onDateSelect,
  isHolidayMode,
}) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const shouldHideTags = activeMode === 'day';

  // 1. 本月第一天 & 星期几 (用于计算前面空几个)
  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay(); // 0(Sun) - 6(Sat)

  // 2. 本月真实天数
  const lastDayObj = new Date(year, month + 1, 0);
  const daysInMonth = lastDayObj.getDate();

  // 🟢 核心算法：计算总格子数
  // 规则 A: 视觉上必须至少能容纳 "31天" (即使本月只有28天，也要把位置留出来给下个月的头几天)
  //        所以最小需要的格子位 = 前面补位 + 31
  const minSlotsNeeded = startDayOfWeek + 31;

  // 规则 B: 必须填满最后一行 (凑够 7 的倍数)
  //        总格子数 = 大于等于 minSlotsNeeded 的最小 7 的倍数
  const totalSlots = Math.ceil(minSlotsNeeded / 7) * 7;

  // 3. 分段生成日期数组

  // A. 【上月补位】 (Ghost)
  const prevDays = Array.from({ length: startDayOfWeek }, (_, i) => {
    return new Date(year, month, 1 - (startDayOfWeek - i));
  });

  // B. 【本月日期】 (Real)
  const currentDays = Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });

  // C. 【下月补位】 (Ghost)
  // 下月需要补的个数 = 总格子数 - (上月补位 + 本月真实天数)
  const slotsUsedSoFar = startDayOfWeek + daysInMonth;
  const daysToAdd = totalSlots - slotsUsedSoFar;

  const nextDays = Array.from({ length: daysToAdd }, (_, i) => {
    return new Date(year, month + 1, i + 1);
  });

  return (
    <div className={styles.grid}>
      {/* 渲染上月 */}
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
          isHolidayMode={isHolidayMode}
          onSelect={() => {}}
        />
      ))}

      {/* 渲染本月 */}
      {currentDays.map((dObj) => {
        const dNum = dObj.getDate();
        const isSelected = dNum === day;
        const dayOfWeek = dObj.getDay();
        const holiday = getJapaneseHoliday(dObj) ?? getCustomHolidayName(dObj);
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
            isHolidayMode={isHolidayMode}
            onSelect={onDateSelect}
          />
        );
      })}

      {/* 渲染下月 (包含原来的29/30/31坑位 以及 填满行所需的日期) */}
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
          isHolidayMode={isHolidayMode}
          onSelect={() => {}}
        />
      ))}
    </div>
  );
};
