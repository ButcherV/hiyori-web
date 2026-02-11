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
  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const pageTitle = t('date_study.title') || 'Dates Study';
  const isFocusMode = activeMode !== 'overview';

  useEffect(() => {
    if (activeMode === 'day') {
      setLearningDay(selectedDate.getDate());
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
    }
  };

  const handleFilterToggle = (type: DateType) => {
    setFilterType((prev) => (prev === type ? null : type));
  };

  // 🟢 1. 上半部分：日历区域的内容渲染器
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
      default:
        // overview 或其他模式下，SmartCalendar 会显示默认网格，这里不需要传子组件
        return null;
    }
  };

  // 🟢 2. 下半部分：详情区域的内容渲染器
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
      default:
        return <div className={styles.debugBox}>WIP: {activeMode}</div>;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="white" />
          </div>
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
            onModeChange={setActiveMode}
          >
            {renderCalendarContent()}
          </SmartCalendar>
        </div>

        {/* 下方内容区域 */}
        <div className={styles.contentSection}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode} // 关键：key 变化通知 Motion 这是一个新组件
              className={styles.motionWrapper}
              // 初始状态 (进入前)
              initial={{ opacity: 0, y: 15 }}
              // 激活状态 (进入后)
              animate={{ opacity: 1, y: 0 }}
              // 退出状态 (卸载前) - 这就是你想要的"渐退"
              exit={{ opacity: 0, y: -15 }}
              transition={{
                delay: 0.24,
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1], // 经典的 smooth easing
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
