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
  // 🟢 1. 接收子组件 (这就是我们的"特种子弹")
  children?: React.ReactNode;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  date,
  activeMode,
  onDateSelect,
  onModeChange,
  children,
}) => {
  // 判断是否处于 Day 模式
  const isFocusMode = activeMode === 'day';

  return (
    <div
      className={`${styles.wrapper} ${isFocusMode ? styles.wrapperFocus : ''}`}
    >
      {/* 🟢 2. 折叠区：Header 和 Week 在这里，Day 模式下会被 CSS 动画收起 */}
      <div
        className={`${styles.collapseSection} ${isFocusMode ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <CalendarHeader date={date} />
          <WeekRow
            currentWeekDay={date.getDay()}
            activeMode={activeMode}
            onModeChange={onModeChange}
          />
        </div>
      </div>

      {/* 🟢 3. 内容切换区 */}
      {/* 如果有子组件 (DayCanvas)，就渲染子组件；否则渲染默认网格 */}
      {children ? (
        children
      ) : (
        <CalendarGrid
          date={date}
          activeMode={activeMode}
          onDateSelect={onDateSelect}
        />
      )}
    </div>
  );
};
