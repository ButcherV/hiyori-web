// src/pages/Dates/components/SmartCalendar/index.tsx

import React, { useState, useEffect, useRef } from 'react';
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

  // 1. 状态初始化
  const [showDayContent, setShowDayContent] = useState(isFocusMode);
  const [headerCollapsed, setHeaderCollapsed] = useState(isFocusMode);
  const [isContentInvisible, setIsContentInvisible] = useState(false);
  const [cachedChildren, setCachedChildren] = useState(children);

  // 2. 记录上一次模式，防止刷新闪烁
  const prevFocusMode = useRef(isFocusMode);

  useEffect(() => {
    if (children) {
      setCachedChildren(children);
    }
  }, [children]);

  useEffect(() => {
    // 只有模式改变时才执行动画
    if (isFocusMode === prevFocusMode.current) {
      return;
    }
    prevFocusMode.current = isFocusMode;

    let step1Timer: number;
    let step2Timer: number;

    if (isFocusMode) {
      // ===========================
      // 🟢 进入 Day 模式 (正序)
      // ===========================
      // 1. 立即折叠 Header
      setHeaderCollapsed(true);

      // 2. 等待折叠动画 (500ms)
      step1Timer = window.setTimeout(() => {
        setIsContentInvisible(true); // Grid 开始淡出

        // 3. 等待淡出 (300ms)
        step2Timer = window.setTimeout(() => {
          setShowDayContent(true); // 换 Canvas
          setIsContentInvisible(false); // Canvas 淡入
        }, 300);
      }, 500);
    } else {
      // ===========================
      // 🟢 退出 Day 模式 (倒序 - 三步走)
      // ===========================

      // 第1步 (0ms): Canvas 开始淡出
      setIsContentInvisible(true);

      // 第2步 (300ms): 切换内容，Grid 原地淡入
      step1Timer = window.setTimeout(() => {
        setShowDayContent(false); // 切回 Grid
        setIsContentInvisible(false); // Grid 开始淡入
        // 注意：此时 headerCollapsed 依然是 true！Header 还是收起的！

        // 第3步 (600ms): Grid 完全出来了，才开始展开 Header
        // 这里的 300ms 对应的是 contentContainer 的 transition: opacity 0.3s
        step2Timer = window.setTimeout(() => {
          setHeaderCollapsed(false); // Header 终于开始展开
        }, 300);
      }, 300); // 等待 Canvas 淡出
    }

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
    };
  }, [isFocusMode]);

  return (
    <div
      className={`${styles.wrapper} ${headerCollapsed ? styles.wrapperFocus : ''}`}
    >
      <div
        className={`${styles.collapseSection} ${headerCollapsed ? styles.collapsed : ''}`}
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

      <div
        className={`
          ${styles.contentContainer} 
          ${isContentInvisible ? styles.contentHidden : ''}
        `}
      >
        {cachedChildren && showDayContent ? (
          cachedChildren
        ) : (
          <CalendarGrid
            date={date}
            activeMode={activeMode}
            onDateSelect={onDateSelect}
          />
        )}
      </div>
    </div>
  );
};
