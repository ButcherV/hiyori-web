// src/pages/Dates/PageDates.tsx

import { useState } from 'react';
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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeMode, setActiveMode] = useState<NavMode>('overview');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const pageTitle = t('date_study.title') || 'Dates Study';
  const isFocusMode = activeMode !== 'overview';

  const handleHeaderAction = () => {
    if (isFocusMode) {
      setActiveMode('overview');
      setFilterType(null);
    } else {
      setSelectedDate(new Date());
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
                currentDate={selectedDate}
                onDateSelect={setSelectedDate}
                filterType={filterType}
                // 🟢 移除了 onFilterChange，因为 Legend 不在这里显示了
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
              currentDate={selectedDate}
              onDateChange={setSelectedDate}
              filterType={filterType}
              // 🟢 这里传入 Filter 控制权
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
