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

// 组件引入
import { SmartCalendar } from './components/SmartCalendar';
import { DateDetailPanel } from './components/DateDetailPanel';
import { DayLearning } from './components/DayLearning';
import { DayCanvas } from './components/DayLearning/DayCanvas'; // 引入新组件

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
        {/* 🟢 上半部分：SmartCalendar 始终存在，负责动画 */}
        <div className={styles.calendarSection}>
          <SmartCalendar
            date={selectedDate}
            activeMode={activeMode}
            onDateSelect={(date) => {
              setSelectedDate(date);
            }}
            onModeChange={setActiveMode}
          >
            {/* 🟢 关键：如果是 Day 模式，我们插入 DayCanvas 作为内容 */}
            {/* 这样 SmartCalendar 负责收起头部，DayCanvas 负责展示圆形网格 */}
            {activeMode === 'day' && (
              <DayCanvas
                currentDate={selectedDate}
                onDateSelect={setSelectedDate}
                filterType={filterType}
                onFilterChange={(type) =>
                  setFilterType((prev) => (prev === type ? null : type))
                }
              />
            )}
          </SmartCalendar>
        </div>

        {/* 下半部分：控制器与详情 */}
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
              filterType={filterType} // 传递 filter 状态给播放器
            />
          ) : (
            <div className={styles.debugBox}>WIP</div>
          )}
        </div>
      </div>
    </div>
  );
};
