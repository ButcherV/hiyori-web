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
import styles from './PageDates.module.css';

import { SmartCalendar } from './components/SmartCalendar';
import { DateDetailPanel } from './components/DateDetailPanel';
import { DayLearning } from './components/DayLearning';
import { DayCanvas } from './components/DayLearning/DayCanvas';
// 🟢 1. 引入 WeekCanvas
import { WeekCanvas } from './components/WeekLearning/WeekCanvas';
import { type DateType } from './Levels/Level1/Level1Data';

export type NavMode =
  | 'overview'
  | 'year'
  | 'month'
  | 'week' // 🟢 确保类型定义包含 week
  | 'day'
  | 'holiday'
  | 'relative';

export const PageDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [learningDay, setLearningDay] = useState(new Date().getDate());
  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const pageTitle = t('date_study.title') || 'Dates Study';
  // Day 和 Week 都属于专注模式，Header 需要显示 X 按钮
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
            {/* 🟢 2. 根据模式，把对应的 Canvas 传进去 */}
            {activeMode === 'day' && (
              <DayCanvas
                year={selectedDate.getFullYear()}
                month={selectedDate.getMonth()}
                activeDay={learningDay}
                onDaySelect={setLearningDay}
                filterType={filterType}
              />
            )}

            {/* 🟢 Week 模式下渲染 WeekCanvas */}
            {activeMode === 'week' && (
              <WeekCanvas currentWeekDay={selectedDate.getDay()} />
            )}
          </SmartCalendar>
        </div>

        {/* 下方内容区域 */}
        <div className={styles.contentSection}>
          {activeMode === 'overview' ? (
            <DateDetailPanel
              date={selectedDate}
              onNavigate={(mode) => setActiveMode(mode)}
            />
          ) : activeMode === 'day' ? (
            <DayLearning
              learningDay={learningDay}
              onDayChange={setLearningDay}
              filterType={filterType}
              onFilterChange={handleFilterToggle}
            />
          ) : activeMode === 'week' ? (
            /* 🟢 3. Week 模式的学习内容 (暂时用占位符) */
            <div className={styles.debugBox}>Week Learning Content WIP</div>
          ) : (
            <div className={styles.debugBox}>WIP: {activeMode}</div>
          )}
        </div>
      </div>
    </div>
  );
};
