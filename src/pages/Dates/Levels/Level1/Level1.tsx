// Dates/Levels/Level1/Level1.tsx

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Repeat } from 'lucide-react';
import styles from './Level1.module.css';
import { datesData } from '../../../../datas/datesData'; // 路径根据实际调整
import { useTTS } from '../../../../hooks/useTTS';

export const Level1 = () => {
  const { speak } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentList = datesData;
  const currentItem = currentList[currentIndex];

  // --- 自动播放逻辑 ---
  useEffect(() => {
    if (!isPlaying || !currentList.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const playNext = () => {
      if (currentItem) {
        speak(currentItem.kana);
      }

      timerRef.current = window.setTimeout(() => {
        setCurrentIndex((prev) => {
          if (prev >= currentList.length - 1) {
            if (isLoopMode) return 0;
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1800); // 稍微调长一点，给用户反应时间
    };

    playNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, isLoopMode, speak]);

  // --- 交互处理 ---
  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false); // 点击手动切换时停止自动播放
    if (currentList[index]) {
      speak(currentList[index].kana);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        position: 'relative',
      }}
    >
      {/* 1. Hero 展示区 */}
      <div className={styles.heroSection}>
        <button
          className={styles.navArrow}
          onClick={() => handleItemClick(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft size={28} />
        </button>

        <div className={styles.heroContent}>
          <div className={`${styles.heroKanji} jaFont`}>{currentItem.id}日</div>
          <div
            className={`${styles.heroKana} jaFont ${currentItem.isIrregular ? styles.heroKanaIrregular : ''}`}
          >
            {currentItem.kana}
          </div>
          <div className={styles.heroRomaji}>{currentItem.romaji}</div>
        </div>

        <button
          className={styles.navArrow}
          onClick={() => handleItemClick(currentIndex + 1)}
          disabled={currentIndex === currentList.length - 1}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      {/* 2. 日历网格区 */}
      <div className={styles.contentArea}>
        <div className={styles.calendarGrid}>
          {currentList.map((day, index) => (
            <button
              key={day.id}
              className={`
                ${styles.dayCell} 
                ${currentIndex === index ? styles.cellActive : ''}
              `}
              onClick={() => handleItemClick(index)}
            >
              <span className={styles.dayNumber}>{day.id}</span>
              {day.isIrregular && currentIndex !== index && (
                <div className={styles.irregularDot} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 底部悬浮控制器 */}
      <div className={styles.controller}>
        <div className={styles.controllerInner}>
          <button
            className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
            onClick={() => setIsLoopMode(!isLoopMode)}
          >
            <Repeat size={20} />
          </button>

          <div className={styles.progressText}>
            {currentIndex + 1} / {currentList.length}
          </div>

          <button
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
