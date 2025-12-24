import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, Repeat, Settings2 } from 'lucide-react';
import styles from './DatesPage.module.css';
import { datesData } from '../datas/datesData';

interface DatesPageProps {
  onBack: () => void;
}

// 定义 Tab 类型
type TabType = 'days' | 'months' | 'weeks';

export const DatesPage: React.FC<DatesPageProps> = ({ onBack }) => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<TabType>('days');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [passIndex, setPassIndex] = useState(0);
  const [isLoopMode, setIsLoopMode] = useState(false);

  const timerRef = useRef<number | null>(null);

  // 获取当前数据 (目前只处理 Days)
  const currentDay = datesData[currentIndex];

  // --- 模拟播放逻辑 (保持不变) ---
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const durations = [1000, 1500, 1200];
    const currentDuration = durations[passIndex];

    timerRef.current = setTimeout(() => {
      if (passIndex < 2) {
        setPassIndex((prev) => prev + 1);
      } else {
        if (isLoopMode) {
          setPassIndex(0);
        } else {
          if (currentIndex < datesData.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setPassIndex(0);
          } else {
            setIsPlaying(false);
            setPassIndex(0);
          }
        }
      }
    }, currentDuration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, passIndex, currentIndex, isLoopMode]);

  // --- 交互处理 ---
  const handleDayClick = (index: number) => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrentIndex(index);
    setPassIndex(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.container}>
      {/* --- Header & Tabs --- */}
      <div className={styles.topArea}>
        <header className={styles.header}>
          <button className={styles.iconBtn} onClick={onBack}>
            <ChevronLeft size={24} />
          </button>
          <span className={styles.headerTitle}>Time & Dates</span>
          <button className={styles.iconBtn}>
            <Settings2 size={24} />
          </button>
        </header>

        {/* ✅ 新增：分段控制器 (Tabs) */}
        <div className={styles.tabsContainer}>
          <div className={styles.segmentedControl}>
            {(['days', 'months', 'weeks'] as TabType[]).map((tab) => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- A. Compact Stage (紧凑型舞台) --- */}
      <div className={styles.stage}>
        {/* 左侧：大数字 */}
        <div className={styles.stageLeft}>
          <span className={styles.mainNumber}>{currentDay.id}</span>
        </div>

        {/* 右侧：信息与进度 */}
        <div className={styles.stageRight}>
          {/* 假名 (重点) */}
          <div
            className={`${styles.kana} ${currentDay.isIrregular ? styles.warnText : ''}`}
          >
            {currentDay.kana}
          </div>

          {/* 汉字 + 罗马音 */}
          <div className={styles.subInfo}>
            <span className={styles.kanji}>{currentDay.kanji}</span>
            <span className={styles.romaji}>{currentDay.romaji}</span>
          </div>

          {/* ✅ 保留：三遍进度点 (样式优化) */}
          <div className={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`
                  ${styles.dot} 
                  ${passIndex === i && isPlaying ? styles.dotActive : ''}
                  ${passIndex > i && isPlaying ? styles.dotFinished : ''} 
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* --- B. Scrollable Grid (可滚动网格) --- */}
      <div className={styles.scrollArea}>
        <div className={styles.gridContainer}>
          {/* 星期表头 */}
          <div className={styles.weekHeader}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className={styles.weekDay}>
                {d}
              </span>
            ))}
          </div>

          {/* 日期网格 */}
          {activeTab === 'days' && (
            <div className={styles.grid}>
              {datesData.map((day, index) => {
                const isActive = currentIndex === index;
                return (
                  <button
                    key={day.id}
                    className={`
                      ${styles.cell} 
                      ${day.isIrregular ? styles.cellIrregular : ''}
                      ${isActive ? styles.cellActive : ''}
                    `}
                    onClick={() => handleDayClick(index)}
                  >
                    {day.id}
                    {/* 不规则标记 */}
                    {day.isIrregular && !isActive && (
                      <div className={styles.irregularDot} />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* 预留给 Months / Weeks 的空状态 */}
          {activeTab !== 'days' && (
            <div className={styles.placeholder}>Coming Soon: {activeTab}</div>
          )}
        </div>
      </div>

      {/* --- C. Floating Controller (悬浮控制栏) --- */}
      <div className={styles.controller}>
        <div className={styles.controllerInner}>
          <button
            className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
            onClick={() => setIsLoopMode(!isLoopMode)}
          >
            <Repeat size={20} />
            {isLoopMode && <span className={styles.loopBadge}>1</span>}
          </button>

          <button className={styles.playBtn} onClick={togglePlay}>
            {isPlaying ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play
                size={28}
                fill="currentColor"
                className={styles.playIconOffset}
              />
            )}
          </button>

          <div className={styles.progressText}>{currentDay.id} / 31</div>
        </div>
      </div>
    </div>
  );
};

export default DatesPage;
