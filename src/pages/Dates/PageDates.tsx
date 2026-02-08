// src/pages/Dates/PageDates.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  HelpCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './PageDates.module.css';
import { SmartCalendar } from './components/SmartCalendar/index';

// 🟢 定义并导出导航模式，供子组件使用
export type NavMode = 'overview' | 'year' | 'month' | 'week' | 'day';

export const PageDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // === 1. 核心状态管理 ===
  // 当前选中的日期 (默认为今天)
  const [selectedDate, setSelectedDate] = useState(new Date());
  // 当前激活的导航模式 (默认为总览)
  const [activeMode, setActiveMode] = useState<NavMode>('overview');

  // 页面标题根据模式动态变化，或者固定
  const pageTitle = t('date_study.title') || 'Dates Study';

  return (
    <div className={styles.container}>
      {/* === Header (保留原样) === */}
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

        {/* 右侧工具栏：回到今天 */}
        <div
          className={styles.iconBtn}
          onClick={() => {
            setSelectedDate(new Date());
            setActiveMode('day');
          }}
        >
          <CalendarIcon size={20} color="white" />
        </div>
      </div>

      {/* === Main Workspace (融合了 LevelSystem 的布局) === */}
      <div className={styles.workspace}>
        {/* 🟢 顶部：全局导航日历 */}
        <div className={styles.calendarSection}>
          <SmartCalendar
            date={selectedDate}
            activeMode={activeMode}
            onDateSelect={(date) => {
              setSelectedDate(date);
              // 点击日期，自动进入“日”模式，且可以在下方看到详情
              setActiveMode('day');
            }}
            onModeChange={setActiveMode}
          />
        </div>

        {/* 🟢 底部：动态内容展示区 */}
        <div className={styles.contentSection}>
          {/* 这里是根据 activeMode 渲染不同子系统的区域 */}
          {/* 暂时放 debug 信息验证交互 */}
          <div className={styles.debugBox}>
            <p className={styles.debugLabel}>当前激活系统</p>
            <h2 className={styles.debugValue}>
              {activeMode.toUpperCase()} SYSTEM
            </h2>
            <p className={styles.debugInfo}>
              选中: {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}
              月{selectedDate.getDate()}日
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
