// src/pages/Dates/components/SmartCalendar/index.tsx

import React from 'react';
import styles from './SmartCalendar.module.css';
import { type NavMode } from '../../PageDates';

import { CalendarHeader } from './CalendarHeader';
import { WeekRow } from './WeekRow';
import { CalendarGrid } from './CalendarGrid';

interface SmartCalendarProps {
  date: Date;
  activeMode: NavMode;
  onDateSelect: (date: Date) => void;
  onModeChange: (mode: NavMode) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  date,
  activeMode,
  onDateSelect,
  onModeChange,
}) => {
  return (
    <div className={styles.wrapper}>
      {/* 1. 头部积木 */}
      <CalendarHeader
        date={date}
        activeMode={activeMode}
        onModeChange={onModeChange}
      />

      {/* 2. 星期积木 */}
      <WeekRow
        currentWeekDay={date.getDay()}
        activeMode={activeMode}
        onModeChange={onModeChange}
      />

      {/* 3. 网格积木 */}
      <CalendarGrid
        date={date}
        activeMode={activeMode}
        onDateSelect={onDateSelect}
      />
    </div>
  );
};
