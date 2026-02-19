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
import { MonthLearning } from './components/MonthLearning';
import { HolidayLearning } from './components/HolidayLearning';
import { DayHelpContent } from './components/DateHelp/DayHelpContent';
import { MonthHelpContent } from './components/DateHelp/MonthHelpContent';
import { HolidayHelpContent } from './components/DateHelp/HolidayHelpContent';
import BottomSheet from '../../components/BottomSheet';
import { type DateType } from './Datas/DayData';
import { findFirstHolidayInMonth } from '../../utils/dateHelper';

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
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);

  const [slideDirection, setSlideDirection] = useState(0);
  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const HELP_MODES: NavMode[] = ['day', 'month', 'holiday'];
  const hasHelp = HELP_MODES.includes(activeMode);

  const renderHelpContent = () => {
    switch (activeMode) {
      case 'day':     return <DayHelpContent />;
      case 'month':   return <MonthHelpContent />;
      case 'holiday': return <HolidayHelpContent />;
      default:        return null;
    }
  };

  const pageTitleMap: Partial<Record<NavMode, string>> = {
    overview: t('date_study.title'),
    day: t('date_study.levels.days.title'),
    week: t('date_study.levels.weeks.title'),
    month: t('date_study.levels.months.title'),
    year: t('date_study.levels.years.title'),
    holiday: t('date_study.levels.holiday.title'),
  };
  const pageTitle = pageTitleMap[activeMode] ?? t('date_study.title');
  const isFocusMode = activeMode !== 'overview';

  useEffect(() => {
    if (activeMode === 'day') {
      setLearningDay(selectedDate.getDate());
    }
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

  // 🟢 1. 计算边界状态 (0 = 1月, 11 = 12月)
  const currentMonthIndex = selectedDate.getMonth();
  const canPrevMonth = currentMonthIndex > 0;
  const canNextMonth = currentMonthIndex < 11;

  // 🟢 2. 处理月份切换
  const handleMonthChange = (offset: number) => {
    // 边界拦截
    if (offset < 0 && !canPrevMonth) return;
    if (offset > 0 && !canNextMonth) return;

    const targetYear = selectedDate.getFullYear();

    // 节日模式：自动跳到下一个有节日的月份
    if (activeMode === 'holiday') {
      let targetMonth = selectedDate.getMonth() + offset;
      while (targetMonth >= 0 && targetMonth <= 11) {
        const firstHoliday = findFirstHolidayInMonth(targetYear, targetMonth);
        if (firstHoliday) {
          setSlideDirection(offset);
          setSelectedDate(firstHoliday);
          return;
        }
        targetMonth += offset;
      }
      return; // 该方向已无更多节日，不做任何事
    }

    setSlideDirection(offset);

    // 算法优化：先构建目标月 1 号，防止从 1月31日 切到 2月 时溢出变成 3月
    const targetMonth = selectedDate.getMonth() + offset;
    const newDate = new Date(targetYear, targetMonth, 1);

    // 自动选择逻辑
    const today = new Date();
    if (
      newDate.getMonth() === today.getMonth() &&
      newDate.getFullYear() === today.getFullYear()
    ) {
      newDate.setDate(today.getDate()); // 如果是当月，选今天
    } else {
      newDate.setDate(1); // 否则选 1 号
    }

    setSelectedDate(newDate);
  };

  // Renderers...
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
        return null;
    }
  };

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
      case 'month':
        return (
          <MonthLearning
            activeMonth={activeMonth}
            onMonthSelect={setActiveMonth}
          />
        );
      case 'holiday':
        return <HolidayLearning selectedDate={selectedDate} />;
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
            {hasHelp && (
              <div
                className={styles.iconBtn}
                style={{ color: 'white' }}
                onClick={() => setIsHelpOpen(true)}
              >
                <HelpCircle size={20} />
              </div>
            )}
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
            onMonthChange={handleMonthChange}
            slideDirection={slideDirection}
            activeMonth={activeMonth}
            onMonthSelect={setActiveMonth}
            // 🟢 3. 传入边界状态
            canPrevMonth={canPrevMonth}
            canNextMonth={canNextMonth}
          >
            {renderCalendarContent()}
          </SmartCalendar>
        </div>

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

      <BottomSheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title={pageTitle}
      >
        {renderHelpContent()}
      </BottomSheet>
    </div>
  );
};
