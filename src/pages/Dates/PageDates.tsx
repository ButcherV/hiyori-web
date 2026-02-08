// src/pages/Dates/PageDates.tsx

import { useState, useEffect } from 'react'; // 🟢 记得引入 useEffect
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  HelpCircle,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './PageDates.module.css';

import { SmartCalendar } from './components/SmartCalendar';
import { DateDetailPanel } from './components/DateDetailPanel';
import { DayLearning } from './components/DayLearning';
import { DayCanvas } from './components/DayLearning/DayCanvas';
import { type DateType } from './Levels/Level1/Level1Data';

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

  // 1. 真实的日历时间 (决定了 Grid 的空白格、表头年份月份)
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 🟢 2. 虚拟的学习游标 (1-31)
  // 默认取今天的日期，但在学习模式下，它可以是 30 或 31，即使当前是 2 月
  const [learningDay, setLearningDay] = useState(new Date().getDate());

  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const pageTitle = t('date_study.title') || 'Dates Study';
  const isFocusMode = activeMode !== 'overview';

  // 🟢 当进入 Day 模式时，将日历的选中日同步给学习游标
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
      // 回到今天
      const today = new Date();
      setSelectedDate(today);
      setLearningDay(today.getDate()); // 顺便重置游标
    }
  };

  const handleFilterToggle = (type: DateType) => {
    setFilterType((prev) => (prev === type ? null : type));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
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
        <div className={styles.calendarSection}>
          <SmartCalendar
            date={selectedDate}
            activeMode={activeMode}
            onDateSelect={(date) => setSelectedDate(date)}
            onModeChange={setActiveMode}
          >
            {activeMode === 'day' && (
              <DayCanvas
                // 🟢 传入真实年月 (用于计算前面空几格，保持视觉对齐)
                year={selectedDate.getFullYear()}
                month={selectedDate.getMonth()}
                // 🟢 传入虚拟游标 (控制高亮)
                activeDay={learningDay}
                // 🟢 点击时只改变游标，不碰 Date
                onDaySelect={setLearningDay}
                filterType={filterType}
              />
            )}
          </SmartCalendar>
        </div>

        <div className={styles.contentSection}>
          {activeMode === 'overview' ? (
            <DateDetailPanel
              date={selectedDate}
              onNavigate={(mode) => setActiveMode(mode)}
            />
          ) : activeMode === 'day' ? (
            <DayLearning
              // 🟢 传入学习游标，不再传 Date
              learningDay={learningDay}
              onDayChange={setLearningDay}
              filterType={filterType}
              onFilterChange={handleFilterToggle}
            />
          ) : (
            <div className={styles.debugBox}>WIP</div>
          )}
        </div>
      </div>
    </div>
  );
};
