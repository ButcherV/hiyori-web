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
  const isDayMode = activeMode === 'day';
  const isWeekMode = activeMode === 'week';
  const isFocusMode = isDayMode || isWeekMode;

  // 🟢 关键修复：引入 focusType
  // 用它来“记住”我们是在 Day 还是 Week 模式，
  // 即使 activeMode 瞬间变成了 overview，只要这个状态没变，我们依然知道该在哪个区域做退出动画。
  const [focusType, setFocusType] = useState<'day' | 'week' | null>(() => {
    if (activeMode === 'day') return 'day';
    if (activeMode === 'week') return 'week';
    return null;
  });

  // === 1. 区域折叠控制 ===
  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [weekSectionCollapsed, setWeekSectionCollapsed] = useState(false);
  const [gridSectionCollapsed, setGridSectionCollapsed] = useState(false);

  // === 2. 内容置换控制 ===
  const [showLearningContent, setShowLearningContent] = useState(false);
  const [isContentInvisible, setIsContentInvisible] = useState(false);

  // === 3. 缓存 Children (用于退出动画) ===
  const [cachedChildren, setCachedChildren] = useState(children);
  useEffect(() => {
    if (isFocusMode && children) {
      setCachedChildren(children);
    }
  }, [children, isFocusMode]);

  const prevModeRef = useRef(activeMode);

  useEffect(() => {
    // 首次加载初始化 (防止刷新后状态不对)
    if (!prevModeRef.current) {
      if (isDayMode) {
        setFocusType('day'); // 🟢 记录身份
        setHeaderCollapsed(true);
        setWeekSectionCollapsed(true);
        setShowLearningContent(true);
      } else if (isWeekMode) {
        setFocusType('week'); // 🟢 记录身份
        setHeaderCollapsed(true);
        setGridSectionCollapsed(true);
        setShowLearningContent(true);
      }
      return;
    }

    if (prevModeRef.current === activeMode) return;
    const prevMode = prevModeRef.current;
    prevModeRef.current = activeMode;

    const isEnteringFocus =
      isFocusMode && prevMode !== 'day' && prevMode !== 'week';
    const isExitingFocus =
      !isFocusMode && (prevMode === 'day' || prevMode === 'week');

    let step1Timer: number;
    let step2Timer: number;

    if (isEnteringFocus) {
      // ===============================================
      // 🟢 进入学习模式
      // ===============================================

      // 1. 立即锁定身份，防止渲染错乱
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

      step1Timer = window.setTimeout(() => {
        setIsContentInvisible(true); // 原地渐隐 (Grid/Row)

        step2Timer = window.setTimeout(() => {
          setShowLearningContent(true); // 换上 Canvas
          setIsContentInvisible(false); // 渐现
        }, 300);
      }, 500);
    } else if (isExitingFocus) {
      // ===============================================
      // 🟢 退出学习模式
      // ===============================================

      // 1. 原地渐隐 (Canvas)
      setIsContentInvisible(true);

      step1Timer = window.setTimeout(() => {
        // 2. 换回旧内容
        setShowLearningContent(false);
        setIsContentInvisible(false); // Grid/Row 渐现

        // 3. 恢复其他区域
        step2Timer = window.setTimeout(() => {
          setHeaderCollapsed(false);
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          // 动画彻底结束后，可以清理 focusType (虽不清理也不影响，但为了整洁)
          setFocusType(null);
        }, 300);
      }, 300);
    }

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
    };
  }, [activeMode, isFocusMode, isDayMode, isWeekMode]);

  // === 渲染逻辑修正 ===
  // 🟢 不再检查 isWeekMode/isDayMode (因为退出时它们是 false)
  // 而是检查 focusType，只有它是 'week' 且 showLearningContent 为 true 时，才显示 Canvas

  const renderWeekSectionContent = () => {
    if (focusType === 'week' && showLearningContent) {
      return cachedChildren;
    }
    return (
      <WeekRow
        currentWeekDay={date.getDay()}
        activeMode={activeMode}
        onModeChange={onModeChange}
      />
    );
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
      {/* 1. Header */}
      <div
        className={`${styles.collapseSection} ${headerCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <CalendarHeader date={date} />
        </div>
      </div>

      {/* 2. Week Section */}
      <div
        className={`${styles.collapseSection} ${weekSectionCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          {/* 🟢 CSS 类名判断也改用 focusType */}
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
          {/* 🟢 CSS 类名判断也改用 focusType */}
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
