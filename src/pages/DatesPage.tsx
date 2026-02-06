// src/pages/Dates/DatesPage.tsx

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Repeat,
  ArrowLeft,
} from 'lucide-react';
import styles from './DatesPage.module.css';
import { datesData } from '../datas/datesData';
// 🟢 如果你有 TTS，请解开下面的注释
import { useTTS } from '../hooks/useTTS';

type TabType = 'days' | 'months' | 'weeks';

export const DatesPage = () => {
  const navigate = useNavigate();
  const { speak } = useTTS(); // 🟢 使用 TTS

  const [activeTab, setActiveTab] = useState<TabType>('days');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);

  const timerRef = useRef<number | null>(null);

  // 获取当前展示的数据项
  // 目前 demo 主要针对 days，后续可以扩展 months/weeks 数据源
  const currentList = activeTab === 'days' ? datesData : [];
  const currentItem = currentList[currentIndex];

  // --- 播放核心逻辑 ---
  useEffect(() => {
    if (!isPlaying || !currentList.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const playNext = () => {
      // 1. 播放声音
      if (currentItem) {
        speak(currentItem.kana); // 播放假名读音
      }

      // 2. 定时切下一题 (模拟 1.5秒间隔，可根据实际语速调整)
      const duration = 1500;

      timerRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => {
          // 到底了？
          if (prev >= currentList.length - 1) {
            if (isLoopMode) return 0; // 循环
            setIsPlaying(false); // 停止
            return prev;
          }
          return prev + 1;
        });
      }, duration);
    };

    playNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, isLoopMode, currentList.length, speak]); // 依赖项加入 speak

  // --- 交互处理 ---

  // 点击：切题 + 暂停 (让用户可以仔细看) + 立即发音
  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    // 点击时立即读一次，强化反馈
    if (currentList[index]) {
      speak(currentList[index].kana);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) handleItemClick(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < currentList.length - 1)
      handleItemClick(currentIndex + 1);
  };

  return (
    <div className={styles.container}>
      {/* 1. 顶部 Header + Tab */}
      <div className={styles.topArea}>
        <div className={styles.header}>
          <button onClick={() => navigate(-1)} className={styles.iconBtn}>
            <ArrowLeft size={24} />
          </button>
          <div className={styles.headerTitle}>日期特训</div>
          <div style={{ width: 32 }}></div> {/* 占位平衡 */}
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.segmentedControl}>
            {(['days', 'months', 'weeks'] as const).map((tab) => (
              <button
                key={tab}
                className={`${styles.segmentBtn} ${activeTab === tab ? styles.segmentActive : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentIndex(0);
                  setIsPlaying(false);
                }}
              >
                {tab === 'days' && '日 (Days)'}
                {tab === 'months' && '月 (Months)'}
                {tab === 'weeks' && '周 (Weeks)'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 🟢 Hero 展示区 (主角) */}
      {/* 只有当有数据时才显示 */}
      {currentItem ? (
        <div className={styles.heroSection}>
          <button
            className={styles.navArrow}
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={28} />
          </button>

          <div className={styles.heroContent}>
            {/* 大汉字：二十日 */}
            <div className={`${styles.heroKanji} jaFont`}>
              {currentItem.id}
              {activeTab === 'days' ? '日' : ''}
            </div>

            {/* 假名：特殊读音标红 */}
            <div
              className={`${styles.heroKana} jaFont ${currentItem.isIrregular ? styles.heroKanaIrregular : ''}`}
            >
              {currentItem.kana}
            </div>

            {/* 罗马音 */}
            <div className={styles.heroRomaji}>{currentItem.romaji}</div>
          </div>

          <button
            className={styles.navArrow}
            onClick={handleNext}
            disabled={currentIndex === currentList.length - 1}
          >
            <ChevronRight size={28} />
          </button>
        </div>
      ) : (
        <div
          className={styles.heroSection}
          style={{ justifyContent: 'center', color: '#ccc' }}
        >
          Coming Soon
        </div>
      )}

      {/* 3. 网格内容区 */}
      <div className={styles.contentArea}>
        {activeTab === 'days' && (
          <div className={styles.calendarGrid}>
            {datesData.map((day, index) => (
              <button
                key={day.id}
                className={`
                  ${styles.dayCell} 
                  ${currentIndex === index ? styles.cellActive : ''}
                  ${day.isIrregular ? styles.cellIrregular : ''}
                `}
                onClick={() => handleItemClick(index)}
              >
                <span className={styles.dayNumber}>{day.id}</span>
                {/* 难点红点：仅在未选中且是难点时显示 */}
                {day.isIrregular && currentIndex !== index && (
                  <div className={styles.irregularDot} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* 这里预留 Months / Weeks 的视图逻辑 */}
        {activeTab !== 'days' && (
          <div style={{ marginTop: 40, color: '#999' }}>该模块施工中...</div>
        )}
      </div>

      {/* 4. 底部控制器 (悬浮) */}
      <div className={styles.controller}>
        <div className={styles.controllerInner}>
          {/* 循环按钮 */}
          <button
            className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
            onClick={() => setIsLoopMode(!isLoopMode)}
          >
            <Repeat size={20} />
          </button>

          {/* 进度显示 */}
          <div className={styles.progressText}>
            {currentIndex + 1} / {currentList.length}
          </div>

          {/* 播放/暂停大按钮 */}
          <button
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" style={{ marginLeft: 2 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatesPage;
