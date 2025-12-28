import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Play, Pause, Repeat, Settings2 } from 'lucide-react';
import styles from './DatesPage.module.css';
import { datesData } from '../datas/datesData';

type TabType = 'days' | 'months' | 'weeks';

export const DatesPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>('days');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [passIndex, setPassIndex] = useState(0);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const timerRef = useRef<number | null>(null);

  const currentDay = datesData[currentIndex];

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const durations = [1000, 1500, 1200];
    timerRef.current = window.setTimeout(() => {
      if (passIndex < 2) {
        setPassIndex((prev) => prev + 1);
      } else {
        if (isLoopMode) {
          setPassIndex(0);
        } else if (currentIndex < datesData.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setPassIndex(0);
        } else {
          setIsPlaying(false);
          setPassIndex(0);
        }
      }
    }, durations[passIndex]);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, passIndex, currentIndex, isLoopMode]);

  const handleDayClick = (index: number) => {
    setIsPlaying(false);
    setCurrentIndex(index);
    setPassIndex(0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topArea}>
        <header className={styles.header}>
          <button className={styles.iconBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={24} />
          </button>
          <span className={styles.headerTitle}>Time & Dates</span>
          <button className={styles.iconBtn}>
            <Settings2 size={24} />
          </button>
        </header>

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

      {/* 舞台区 */}
      <div className={styles.stage}>
        <div className={styles.stageLeft}>
          <span className={styles.mainNumber}>{currentDay.id}</span>
        </div>
        <div className={styles.stageRight}>
          <div
            className={`${styles.kana} ${currentDay.isIrregular ? styles.warnText : ''}`}
          >
            {currentDay.kana}
          </div>
          <div className={styles.subInfo}>
            <span className={styles.kanji}>{currentDay.kanji}</span>
            <span className={styles.romaji}>{currentDay.romaji}</span>
          </div>
          <div className={styles.dotsRow}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${styles.dot} ${passIndex === i && isPlaying ? styles.dotActive : ''} ${passIndex > i && isPlaying ? styles.dotFinished : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 网格区 */}
      <div className={styles.scrollArea}>
        <div className={styles.gridContainer}>
          <div className={styles.weekHeader}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
              <span key={i} className={styles.weekDay}>
                {d}
              </span>
            ))}
          </div>
          {activeTab === 'days' ? (
            <div className={styles.grid}>
              {datesData.map((day, index) => (
                <button
                  key={day.id}
                  className={`${styles.cell} ${day.isIrregular ? styles.cellIrregular : ''} ${currentIndex === index ? styles.cellActive : ''}`}
                  onClick={() => handleDayClick(index)}
                >
                  {day.id}
                  {day.isIrregular && currentIndex !== index && (
                    <div className={styles.irregularDot} />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.placeholder}>Coming Soon: {activeTab}</div>
          )}
        </div>
      </div>

      {/* 控制器 */}
      <div className={styles.controller}>
        <div className={styles.controllerInner}>
          <button
            className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
            onClick={() => setIsLoopMode(!isLoopMode)}
          >
            <Repeat size={20} />
            {isLoopMode && <span className={styles.loopBadge}>1</span>}
          </button>
          <button
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
          >
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
