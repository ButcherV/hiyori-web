// src/pages/Dates/components/SmartCalendar/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import styles from './SmartCalendar.module.css';
import { type NavMode } from '../../PageDates';

import { CalendarHeader } from './CalendarHeader';
import { WeekRow } from './WeekRow';
import { CalendarGrid } from './CalendarGrid';
// 🟢 引入 MonthCanvas
import { MonthCanvas } from '../MonthLearning/MonthCanvas';

interface SmartCalendarProps {
  date: Date;
  activeMode: NavMode;
  onDateSelect: (date: Date) => void;
  // 🟢 新增 Props
  activeMonth?: number;
  onMonthSelect?: (m: number) => void;
  children?: React.ReactNode;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  date,
  activeMode,
  onDateSelect,
  activeMonth = 1,
  onMonthSelect = () => {},
  children,
}) => {
  const isDayMode = activeMode === 'day';
  const isWeekMode = activeMode === 'week';
  const isMonthMode = activeMode === 'month';
  const isFocusMode = isDayMode || isWeekMode || isMonthMode;

  // 1. 状态锁定 (Focus Identity)
  const [focusType, setFocusType] = useState<'day' | 'week' | 'month' | null>(
    () => {
      if (isDayMode) return 'day';
      if (isWeekMode) return 'week';
      if (isMonthMode) return 'month';
      return null;
    }
  );

  // 2. 区域折叠控制 (Layout Collapse)
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [weekSectionCollapsed, setWeekSectionCollapsed] = useState(false);
  const [gridSectionCollapsed, setGridSectionCollapsed] = useState(false);

  // 3. Header 内容置换控制 (Header Swap)
  // headerContentVisible: 控制 Header 内容的 Fade 动画
  const [headerContentVisible, setHeaderContentVisible] = useState(true);
  // headerMode: 决定 Header 显示 CalendarHeader 还是 MonthCanvas
  const [headerMode, setHeaderMode] = useState<'calendar' | 'month'>(
    'calendar'
  );

  // 4. 内容区域置换控制 (Canvas Swap - for Day/Week)
  const [showLearningContent, setShowLearningContent] = useState(false);
  const [isContentInvisible, setIsContentInvisible] = useState(false);

  // 5. 缓存 Children (用于退出动画)
  const [cachedChildren, setCachedChildren] = useState(children);
  useEffect(() => {
    if (isFocusMode && children) {
      setCachedChildren(children);
    }
  }, [children, isFocusMode]);

  const prevModeRef = useRef(activeMode);

  useEffect(() => {
    // === 初始化逻辑 ===
    if (!prevModeRef.current) {
      if (isDayMode) {
        setFocusType('day');
        setHeaderCollapsed(true);
        setWeekSectionCollapsed(true);
        setShowLearningContent(true);
      } else if (isWeekMode) {
        setFocusType('week');
        setHeaderCollapsed(true);
        setGridSectionCollapsed(true);
        setShowLearningContent(true);
      } else if (isMonthMode) {
        setFocusType('month');
        // Month 模式：Header 不折叠（因为要放 MonthCanvas），其他都折叠
        setWeekSectionCollapsed(true);
        setGridSectionCollapsed(true);
        setHeaderMode('month'); // 直接显示
      }
      return;
    }

    if (prevModeRef.current === activeMode) return;
    const prevMode = prevModeRef.current;
    prevModeRef.current = activeMode;

    // === 动画状态机 ===

    const isEnteringMonth = isMonthMode && prevMode === 'overview';
    const isExitingMonth = !isMonthMode && prevMode === 'month';

    // 复用之前的 Day/Week 逻辑判断
    const isEnteringDayOrWeek =
      (isDayMode || isWeekMode) && prevMode === 'overview';
    const isExitingDayOrWeek =
      !isFocusMode && (prevMode === 'day' || prevMode === 'week');

    let t1: number, t2: number;

    // 🟢 CASE A: 进入 Month 模式 (三阶段)
    if (isEnteringMonth) {
      setFocusType('month');

      // Stage 1: 其他部分折叠
      setWeekSectionCollapsed(true);
      setGridSectionCollapsed(true);

      // Stage 2: Header 内容渐退
      t1 = window.setTimeout(() => {
        setHeaderContentVisible(false);

        // Stage 3: 切换内容并渐现
        t2 = window.setTimeout(() => {
          setHeaderMode('month');
          setHeaderContentVisible(true);
        }, 300); // 等待 FadeOut (300ms)
      }, 300); // 等待 Collapse (300ms)
    }

    // 🟢 CASE B: 退出 Month 模式 (三阶段)
    else if (isExitingMonth) {
      // Stage 1: MonthCanvas 原地渐退
      setHeaderContentVisible(false);

      // Stage 2: 换回 CalendarHeader 并渐现
      t1 = window.setTimeout(() => {
        setHeaderMode('calendar');
        setHeaderContentVisible(true);

        // Stage 3: 其他部分展开
        t2 = window.setTimeout(() => {
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          setFocusType(null);
        }, 300);
      }, 300);
    }

    // 🟡 CASE C: 进入 Day/Week 模式 (原有逻辑)
    else if (isEnteringDayOrWeek) {
      if (isDayMode) setFocusType('day');
      else setFocusType('week');

      setHeaderCollapsed(true);

      if (isDayMode) {
        setWeekSectionCollapsed(true);
        setGridSectionCollapsed(false);
      } else {
        setGridSectionCollapsed(true);
        setWeekSectionCollapsed(false);
      }

      t1 = window.setTimeout(() => {
        setIsContentInvisible(true);
        t2 = window.setTimeout(() => {
          setShowLearningContent(true);
          setIsContentInvisible(false);
        }, 300);
      }, 500);
    }

    // 🟡 CASE D: 退出 Day/Week 模式 (原有逻辑)
    else if (isExitingDayOrWeek) {
      setIsContentInvisible(true);
      t1 = window.setTimeout(() => {
        setShowLearningContent(false);
        setIsContentInvisible(false);
        t2 = window.setTimeout(() => {
          setHeaderCollapsed(false);
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          setFocusType(null);
        }, 300);
      }, 300);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [activeMode, isDayMode, isWeekMode, isMonthMode, isFocusMode]);

  // 🟢 渲染 Header 内容 (支持 Fade)
  const renderHeaderContent = () => {
    // 注意：这里我们用一个 fadeWrapper 包裹，来实现内容切换时的渐隐渐现
    return (
      <div
        className={styles.fadeWrapper}
        style={{ opacity: headerContentVisible ? 1 : 0 }}
      >
        {headerMode === 'month' ? (
          <MonthCanvas
            activeMonth={activeMonth}
            onMonthSelect={onMonthSelect}
          />
        ) : (
          <CalendarHeader date={date} />
        )}
      </div>
    );
  };

  const renderWeekSectionContent = () => {
    if (focusType === 'week' && showLearningContent) {
      return cachedChildren;
    }
    return <WeekRow />;
  };

  const renderGridSectionContent = () => {
    if (focusType === 'day' && showLearningContent) {
      return cachedChildren;
    }
    return (
      <CalendarGrid
        date={date}
        activeMode={activeMode}
        onDateSelect={onDateSelect}
      />
    );
  };

  return (
    <div
      className={`${styles.wrapper} ${isFocusMode ? styles.wrapperFocus : ''}`}
    >
      {/* 1. Header (Month 模式下复用此槽位) */}
      <div
        className={`${styles.collapseSection} ${headerCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>{renderHeaderContent()}</div>
      </div>

      {/* 2. Week Section */}
      <div
        className={`${styles.collapseSection} ${weekSectionCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <div
            className={`
              ${styles.fadeWrapper} 
              ${focusType === 'week' && isContentInvisible ? styles.hidden : ''}
            `}
          >
            {renderWeekSectionContent()}
          </div>
        </div>
      </div>

      {/* 3. Grid Section */}
      <div
        className={`${styles.collapseSection} ${gridSectionCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <div
            className={`
              ${styles.fadeWrapper} 
              ${focusType === 'day' && isContentInvisible ? styles.hidden : ''}
            `}
          >
            {renderGridSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
