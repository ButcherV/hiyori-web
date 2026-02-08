// src/pages/Dates/components/SmartCalendar/index.tsx

import React, { useState, useEffect } from 'react';
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
  children?: React.ReactNode;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  date,
  activeMode,
  onDateSelect,
  onModeChange,
  children,
}) => {
  const isFocusMode = activeMode === 'day';

  // 🟢 新增：控制内容是否已经准备好切换
  // 默认为 false，表示展示 CalendarGrid
  const [isContentSwitched, setIsContentSwitched] = useState(false);

  useEffect(() => {
    if (isFocusMode) {
      // 🟢 进入 Day 模式：延迟 500ms (等待 Header 折叠动画完成) 后再切换内容
      // 对应 CSS 中的 transition-duration: 0.5s
      const timer = setTimeout(() => {
        setIsContentSwitched(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      // 🟢 退出 Day 模式：立即切回 Grid，然后 Header 再展开
      // 这样用户会看到 Grid 出现，然后被 Header 顶下去，符合物理直觉
      setIsContentSwitched(false);
    }
  }, [isFocusMode]);

  return (
    <div
      className={`${styles.wrapper} ${isFocusMode ? styles.wrapperFocus : ''}`}
    >
      {/* 1. 折叠区 (0.5s 动画) */}
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

      {/* 2. 内容区 (带延迟的切换) */}
      {/* 只有当：
         1. 确实传了子组件 (children存在)
         2. AND 动画时间到了 (isContentSwitched为true)
         才渲染 DayCanvas。
         否则一直保持渲染 CalendarGrid。
      */}
      {children && isContentSwitched ? (
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
