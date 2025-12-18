import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, Repeat, Settings2 } from 'lucide-react';
import styles from './DatesPage.module.css';
import { datesData } from '../datas/datesData';
import type { DateItem } from '../datas/datesData';

interface DatesPageProps {
  onBack: () => void; // 返回上一页的回调
}

export const DatesPage: React.FC<DatesPageProps> = ({ onBack }) => {
  // --- State ---
  const [currentIndex, setCurrentIndex] = useState(0); // 当前选中的索引 (0-30)
  const [isPlaying, setIsPlaying] = useState(false);   // 是否正在自动播放
  const [passIndex, setPassIndex] = useState(0);       // 当前读到第几遍 (0, 1, 2)
  const [isLoopMode, setIsLoopMode] = useState(false); // 是否单曲循环

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentDay = datesData[currentIndex];

  // --- 模拟音频播放逻辑 ---
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // 定义每一遍朗读的时长 (毫秒) - 模拟真实体验
    // Pass 1: 正常 (1s), Pass 2: 慢速 (1.5s), Pass 3: 正常+留白 (1.2s)
    const durations = [1000, 1500, 1200]; 
    const currentDuration = durations[passIndex];

    timerRef.current = setTimeout(() => {
      // 逻辑: 播放完一遍后，决定下一步做什么
      if (passIndex < 2) {
        // 如果还没读完3遍，读下一遍
        setPassIndex(prev => prev + 1);
      } else {
        // 3遍都读完了
        if (isLoopMode) {
          // 如果是单曲循环，重置回第1遍
          setPassIndex(0);
        } else {
          // 如果是顺序播放
          if (currentIndex < datesData.length - 1) {
            // 跳到下一天，重置为第1遍
            setCurrentIndex(prev => prev + 1);
            setPassIndex(0);
          } else {
            // 到最后一天了，停止
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

  // 1. 点击日历格子
  const handleDayClick = (index: number) => {
    // 立即打断自动播放
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    
    // 切换到选中日期
    setCurrentIndex(index);
    setPassIndex(0); // 重置进度

    // (可选) 这里可以触发一次“点读”声音播放
    console.log(`Playing audio for: ${datesData[index].romaji}`);
  };

  // 2. 播放/暂停
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles.container}>
      {/* --- Header --- */}
      <header className={styles.header}>
        <button className={styles.iconBtn} onClick={onBack}>
          <ChevronLeft size={24} />
        </button>
        <span className={styles.headerTitle}>Dates (日付)</span>
        <button className={styles.iconBtn}>
          <Settings2 size={24} />
        </button>
      </header>

      {/* --- A. Stage (展示舞台) --- */}
      <div className={styles.stage}>
        <div className={styles.stageContent}>
          <div className={styles.mainNumber}>{currentDay.id}</div>
          <div className={styles.kanjiRow}>
            <span className={styles.kanji}>{currentDay.kanji}</span>
            {/* 重点显示：不规则发音用警告色文字，普通用主色 */}
            <span className={`${styles.kana} ${currentDay.isIrregular ? styles.warnText : ''}`}>
              {currentDay.kana}
            </span>
          </div>
          <div className={styles.romaji}>{currentDay.romaji}</div>
        </div>

        {/* 3遍进度指示器 */}
        <div className={styles.dotsRow}>
          {/* 只有在播放时才显示激活的圆点，或者手动点击时显示第一个 */}
          {[0, 1, 2].map(i => (
            <div 
              key={i} 
              className={`${styles.dot} ${passIndex === i && isPlaying ? styles.dotActive : ''}`} 
            />
          ))}
        </div>
      </div>

      {/* --- B. Grid (日历控制盘) --- */}
      <div className={styles.gridContainer}>
        {/* 星期表头 (装饰性) */}
        <div className={styles.weekHeader}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <span key={i} className={styles.weekDay}>{d}</span>
          ))}
        </div>

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
                {/* 如果是不规则，右上角加个小点提示 */}
                {day.isIrregular && <div className={styles.irregularDot} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- C. Controller (底部控制栏) --- */}
      <div className={styles.controller}>
        <button 
          className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
          onClick={() => setIsLoopMode(!isLoopMode)}
          aria-label="Loop Mode"
        >
          <Repeat size={20} />
          {isLoopMode && <span className={styles.loopBadge}>1</span>}
        </button>

        <button 
          className={styles.playBtn} 
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause size={32} fill="currentColor" />
          ) : (
            <Play size={32} fill="currentColor" className={styles.playIconOffset}/>
          )}
        </button>

        <div className={styles.progressText}>
          {currentDay.id} / 31
        </div>
      </div>
    </div>
  );
};

export default DatesPage;