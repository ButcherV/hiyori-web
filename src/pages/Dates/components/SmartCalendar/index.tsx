// src/pages/Dates/components/SmartCalendar/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './SmartCalendar.module.css';
import { type NavMode } from '../../PageDates';

import { CalendarHeader } from './CalendarHeader';
import { WeekRow } from './WeekRow';
import { CalendarGrid } from './CalendarGrid';
import { MonthCanvas } from '../MonthLearning/MonthCanvas';
import { EraCanvas } from '../YearLearning/EraCanvas';
import { GranularityCanvas } from '../RelativeTimeLearning/GranularityCanvas';
import { type Granularity } from '../../Datas/RelativeTimeData';

interface SmartCalendarProps {
  date: Date;
  activeMode: NavMode;
  onDateSelect: (date: Date) => void;
  activeMonth?: number;
  onMonthSelect?: (m: number) => void;
  activeEraKey?: string;
  onEraSelect?: (key: string) => void;
  activeGranularity?: Granularity;
  onGranularitySelect?: (g: Granularity) => void;
  onMonthChange: (offset: number) => void;
  slideDirection: number;
  // 🟢 新增 Props
  canPrevMonth?: boolean;
  canNextMonth?: boolean;
  children?: React.ReactNode;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  date,
  activeMode,
  onDateSelect,
  activeMonth = 1,
  onMonthSelect = () => {},
  activeEraKey = 'reiwa',
  onEraSelect = () => {},
  activeGranularity = 'day',
  onGranularitySelect = () => {},
  onMonthChange,
  slideDirection,
  // 🟢 解构
  canPrevMonth = true,
  canNextMonth = true,
  children,
}) => {
  const isDayMode = activeMode === 'day';
  const isWeekMode = activeMode === 'week';
  const isMonthMode = activeMode === 'month';
  const isYearMode = activeMode === 'year';
  const isHolidayMode = activeMode === 'holiday';
  const isRelativeMode = activeMode === 'relative';
  const isFocusMode = isDayMode || isWeekMode || isMonthMode || isYearMode || isRelativeMode;

  const [focusType, setFocusType] = useState<'day' | 'week' | 'month' | 'year' | 'relative' | null>(
    () => {
      if (isDayMode) return 'day';
      if (isWeekMode) return 'week';
      if (isMonthMode) return 'month';
      if (isYearMode) return 'year';
      return null;
    }
  );

  const [headerCollapsed, setHeaderCollapsed] = useState(false);
  const [weekSectionCollapsed, setWeekSectionCollapsed] = useState(false);
  const [gridSectionCollapsed, setGridSectionCollapsed] = useState(false);
  const [headerContentVisible, setHeaderContentVisible] = useState(true);
  const [headerMode, setHeaderMode] = useState<'calendar' | 'month' | 'year' | 'relative'>(
    'calendar'
  );
  const [showLearningContent, setShowLearningContent] = useState(false);
  const [isContentInvisible, setIsContentInvisible] = useState(false);

  const [cachedChildren, setCachedChildren] = useState(children);
  useEffect(() => {
    if (isFocusMode && children) {
      setCachedChildren(children);
    }
  }, [children, isFocusMode]);

  const prevModeRef = useRef(activeMode);

  useEffect(() => {
    // === 状态机逻辑保持不变 (省略以节省篇幅，请保持你原有的逻辑) ===
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
        setWeekSectionCollapsed(true);
        setGridSectionCollapsed(true);
        setHeaderMode('month');
      } else if (isYearMode) {
        setFocusType('year');
        setWeekSectionCollapsed(true);
        setGridSectionCollapsed(true);
        setHeaderMode('year');
      } else if (isRelativeMode) {
        setFocusType('relative');
        setWeekSectionCollapsed(true);
        setGridSectionCollapsed(true);
        setHeaderMode('relative');
      }
      return;
    }

    if (prevModeRef.current === activeMode) return;
    const prevMode = prevModeRef.current;
    prevModeRef.current = activeMode;

    const isEnteringMonth = isMonthMode && prevMode === 'overview';
    const isExitingMonth = !isMonthMode && prevMode === 'month';
    const isEnteringYear = isYearMode && prevMode === 'overview';
    const isExitingYear = !isYearMode && prevMode === 'year';
    const isEnteringRelative = isRelativeMode && prevMode === 'overview';
    const isExitingRelative = !isRelativeMode && prevMode === 'relative';
    const isEnteringDayOrWeek =
      (isDayMode || isWeekMode) && prevMode === 'overview';
    const isExitingDayOrWeek =
      !isFocusMode && (prevMode === 'day' || prevMode === 'week');

    let t1: number, t2: number;

    if (isEnteringMonth) {
      setFocusType('month');
      setWeekSectionCollapsed(true);
      setGridSectionCollapsed(true);
      t1 = window.setTimeout(() => {
        setHeaderContentVisible(false);
        t2 = window.setTimeout(() => {
          setHeaderMode('month');
          setHeaderContentVisible(true);
        }, 300);
      }, 300);
    } else if (isExitingMonth) {
      setHeaderContentVisible(false);
      t1 = window.setTimeout(() => {
        setHeaderMode('calendar');
        setHeaderContentVisible(true);
        t2 = window.setTimeout(() => {
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          setFocusType(null);
        }, 300);
      }, 300);
    } else if (isEnteringYear) {
      setFocusType('year');
      setWeekSectionCollapsed(true);
      setGridSectionCollapsed(true);
      t1 = window.setTimeout(() => {
        setHeaderContentVisible(false);
        t2 = window.setTimeout(() => {
          setHeaderMode('year');
          setHeaderContentVisible(true);
        }, 300);
      }, 300);
    } else if (isExitingYear) {
      setHeaderContentVisible(false);
      t1 = window.setTimeout(() => {
        setHeaderMode('calendar');
        setHeaderContentVisible(true);
        t2 = window.setTimeout(() => {
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          setFocusType(null);
        }, 300);
      }, 300);
    } else if (isEnteringRelative) {
      setFocusType('relative');
      setWeekSectionCollapsed(true);
      setGridSectionCollapsed(true);
      t1 = window.setTimeout(() => {
        setHeaderContentVisible(false);
        t2 = window.setTimeout(() => {
          setHeaderMode('relative');
          setHeaderContentVisible(true);
        }, 300);
      }, 300);
    } else if (isExitingRelative) {
      setHeaderContentVisible(false);
      t1 = window.setTimeout(() => {
        setHeaderMode('calendar');
        setHeaderContentVisible(true);
        t2 = window.setTimeout(() => {
          setWeekSectionCollapsed(false);
          setGridSectionCollapsed(false);
          setFocusType(null);
        }, 300);
      }, 300);
    } else if (isEnteringDayOrWeek) {
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
    } else if (isExitingDayOrWeek) {
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
  }, [activeMode, isDayMode, isWeekMode, isMonthMode, isYearMode, isRelativeMode, isFocusMode]);

  const renderHeaderContent = () => {
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
        ) : headerMode === 'year' ? (
          <EraCanvas
            activeEraKey={activeEraKey}
            onEraSelect={onEraSelect}
          />
        ) : headerMode === 'relative' ? (
          <GranularityCanvas
            active={activeGranularity}
            onSelect={onGranularitySelect}
          />
        ) : (
          <CalendarHeader
            date={date}
            onMonthChange={onMonthChange}
            // 🟢 透传边界状态
            canPrev={canPrevMonth}
            canNext={canNextMonth}
          />
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
    const animKey = `${date.getFullYear()}-${date.getMonth()}`;
    return (
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence
          initial={false}
          mode="popLayout"
          custom={slideDirection}
        >
          <motion.div
            key={animKey}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              opacity: { duration: 0.2 },
            }}
            style={{ width: '100%' }}
          >
            <CalendarGrid
              date={date}
              activeMode={activeMode}
              onDateSelect={onDateSelect}
              isHolidayMode={isHolidayMode}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div
      className={`${styles.wrapper} ${isFocusMode ? styles.wrapperFocus : ''}`}
    >
      <div
        className={`${styles.collapseSection} ${headerCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>{renderHeaderContent()}</div>
      </div>

      <div
        className={`${styles.collapseSection} ${weekSectionCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <div
            className={`${styles.fadeWrapper} ${focusType === 'week' && isContentInvisible ? styles.hidden : ''}`}
          >
            {renderWeekSectionContent()}
          </div>
        </div>
      </div>

      <div
        className={`${styles.collapseSection} ${gridSectionCollapsed ? styles.collapsed : ''}`}
      >
        <div className={styles.collapseInner}>
          <div
            className={`${styles.fadeWrapper} ${focusType === 'day' && isContentInvisible ? styles.hidden : ''}`}
          >
            {renderGridSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
