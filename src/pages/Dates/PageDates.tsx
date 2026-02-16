// src/pages/Dates/PageDates.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  HelpCircle,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PageDates.module.css';

import { SmartCalendar } from './components/SmartCalendar';
import { DateDetailPanel } from './components/DateDetailPanel';
import { DayLearning } from './components/DayLearning';
import { DayCanvas } from './components/DayLearning/DayCanvas';
import { WeekCanvas } from './components/WeekLearning/WeekCanvas';
import { WeekLearning } from './components/WeekLearning';
// 🟢 引入 MonthLearning
import { MonthLearning } from './components/MonthLearning';
import { type DateType } from './Datas/DayData';

export type NavMode =
  | 'overview'
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'holiday'
  | 'relative';

export const PageDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [learningDay, setLearningDay] = useState(new Date().getDate());
  const [currentWeekDay, setCurrentWeekDay] = useState(new Date().getDay());

  // 🟢 新增 Month 状态
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);

  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const pageTitle = t('date_study.title') || 'Dates Study';
  const isFocusMode = activeMode !== 'overview';

  // 同步逻辑
  useEffect(() => {
    if (activeMode === 'day') {
      setLearningDay(selectedDate.getDate());
    }
    // 如果进入 month 模式，默认选中当前 selectedDate 的月份
    if (activeMode === 'month') {
      setActiveMonth(selectedDate.getMonth() + 1);
    }
  }, [activeMode, selectedDate]);

  const handleHeaderAction = () => {
    if (isFocusMode) {
      setActiveMode('overview');
      setFilterType(null);
    } else {
      const today = new Date();
      setSelectedDate(today);
      setLearningDay(today.getDate());
      setActiveMonth(today.getMonth() + 1);
    }
  };

  const handleFilterToggle = (type: DateType) => {
    setFilterType((prev) => (prev === type ? null : type));
  };

  // 1. 上半部分：日历区域的内容渲染器 (Children)
  const renderCalendarContent = () => {
    switch (activeMode) {
      case 'day':
        return (
          <DayCanvas
            year={selectedDate.getFullYear()}
            month={selectedDate.getMonth()}
            activeDay={learningDay}
            onDaySelect={setLearningDay}
            filterType={filterType}
          />
        );
      case 'week':
        return (
          <WeekCanvas
            currentWeekDay={currentWeekDay}
            onDaySelect={setCurrentWeekDay}
          />
        );
      // 注意：Month 模式下，MonthCanvas 是作为 Header 渲染的，不是 Children
      default:
        return null;
    }
  };

  // 2. 下半部分：详情区域的内容渲染器
  const renderDetailContent = () => {
    switch (activeMode) {
      case 'overview':
        return (
          <DateDetailPanel
            date={selectedDate}
            onNavigate={(mode) => setActiveMode(mode)}
          />
        );
      case 'day':
        return (
          <DayLearning
            learningDay={learningDay}
            onDayChange={setLearningDay}
            filterType={filterType}
            onFilterChange={handleFilterToggle}
          />
        );
      case 'week':
        return (
          <WeekLearning
            activeDay={currentWeekDay}
            onDaySelect={setCurrentWeekDay}
          />
        );
      // 🟢 新增 Month Case
      case 'month':
        return (
          <MonthLearning
            activeMonth={activeMonth}
            onMonthSelect={setActiveMonth}
          />
        );
      default:
        return <div className={styles.debugBox}>WIP: {activeMode}</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          {!isFocusMode && (
            <div className={styles.iconBtn} onClick={() => navigate('/')}>
              <ChevronLeft size={24} color="white" />
            </div>
          )}
          <div className={styles.titleWrapper}>
            <span className={styles.headerTitle}>{pageTitle}</span>
            <div className={styles.iconBtn} style={{ color: 'white' }}>
              <HelpCircle size={20} />
            </div>
          </div>
        </div>
        <div className={styles.iconBtn} onClick={handleHeaderAction}>
          {isFocusMode ? (
            <X size={24} color="white" />
          ) : (
            <CalendarIcon size={20} color="white" />
          )}
        </div>
      </div>

      <div className={styles.workspace}>
        {/* 日历区域 */}
        <div className={styles.calendarSection}>
          <SmartCalendar
            date={selectedDate}
            activeMode={activeMode}
            onDateSelect={(date) => setSelectedDate(date)}
            // 🟢 传递 Month Props
            activeMonth={activeMonth}
            onMonthSelect={setActiveMonth}
          >
            {renderCalendarContent()}
          </SmartCalendar>
        </div>

        {/* 下方内容区域 */}
        <div className={styles.contentSection}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              className={styles.motionWrapper}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{
                delay: 0.24,
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {renderDetailContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
