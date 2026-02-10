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
  // 🟢 扩展焦点模式判定：Day 和 Week 都算 Focus
  const isDayMode = activeMode === 'day';
  const isWeekMode = activeMode === 'week';
  const isFocusMode = isDayMode || isWeekMode;

  // 1. 状态初始化：继承原来的逻辑
  const [showContent, setShowContent] = useState(isFocusMode);

  // 🟢 拆分折叠状态
  // Day模式: 两者都为 true (折叠)
  // Week模式: header 为 true, weekRow 为 false (展开)
  const [headerCollapsed, setHeaderCollapsed] = useState(isFocusMode);
  const [weekRowCollapsed, setWeekRowCollapsed] = useState(isDayMode);

  const [isContentInvisible, setIsContentInvisible] = useState(false);
  const [cachedChildren, setCachedChildren] = useState(children);

  // 2. 记录上一次模式，防止刷新闪烁
  const prevFocusModeRef = useRef(isFocusMode);

  useEffect(() => {
    if (children) {
      setCachedChildren(children);
    }
  }, [children]);

  useEffect(() => {
    // 守卫：只有模式真的变了才跑动画
    if (prevFocusModeRef.current === isFocusMode) {
      return;
    }
    prevFocusModeRef.current = isFocusMode;

    let step1Timer: number;
    let step2Timer: number;

    if (isFocusMode) {
      // ===========================
      // 🟢 进入学习模式 (Day 或 Week)
      // ===========================

      // 1. 立即执行折叠 (模拟原来的行为)
      setHeaderCollapsed(true);
      if (isDayMode) {
        setWeekRowCollapsed(true); // Day模式：连星期行一起折叠
      } else {
        setWeekRowCollapsed(false); // Week模式：星期行保持展开
      }

      // 2. 等待折叠动画 (500ms)
      step1Timer = window.setTimeout(() => {
        setIsContentInvisible(true); // Grid 开始淡出

        // 3. 渐隐完成后 (300ms) 切换 Canvas 并渐现
        step2Timer = window.setTimeout(() => {
          setShowContent(true);
          setIsContentInvisible(false);
        }, 300);
      }, 500);
    } else {
      // ===========================
      // 🟢 退出学习模式 (Day Exit)
      // ===========================
      // 严格复刻您的“倒序三步走”，确保动画完全一致

      // 第1步 (0ms): Canvas 开始淡出
      setIsContentInvisible(true);

      step1Timer = window.setTimeout(() => {
        // 第2步 (300ms后): 切换回 Grid，Grid 开始渐现
        setShowContent(false);
        setIsContentInvisible(false);

        // 注意：此时 Header 依然保持折叠，等待 Grid 显影

        // 第3步 (再过300ms): Grid 完全显形后，恢复 Header 高度
        step2Timer = window.setTimeout(() => {
          setHeaderCollapsed(false);
          setWeekRowCollapsed(false); // 确保星期行也恢复
        }, 300); // 对应 CSS transition 0.3s
      }, 300);
    }

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
    };
  }, [isFocusMode, isDayMode]); // 依赖 isDayMode 以区分进入时的折叠策略

  return (
    <div
      className={`${styles.wrapper} ${isFocusMode ? styles.wrapperFocus : ''}`}
    >
      {/* 🟢 区域 1：年号月份 (始终受控) */}
      <div
        className={`${styles.collapseSection} ${headerCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <CalendarHeader date={date} />
        </div>
      </div>

      {/* 🟢 区域 2：星期行 (Week 模式下不受控) */}
      <div
        className={`${styles.collapseSection} ${weekRowCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
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
        {cachedChildren && showContent ? (
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
