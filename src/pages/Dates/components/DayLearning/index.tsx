// src/pages/Dates/components/DayLearning/index.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
// 🔴 引用容器 CSS
import styles from './DayLearning.module.css';
import { DayHero } from './DayHero';
import { DayController, type LoopMode } from './DayController';
import { datesData } from '../../Levels/Level1/Level1Data';
import { useTTS } from '../../../../hooks/useTTS';

interface DayLearningProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export const DayLearning: React.FC<DayLearningProps> = ({
  currentDate,
  onDateChange,
}) => {
  const { speak } = useTTS();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const timerRef = useRef<number | null>(null);

  const currentDayNum = currentDate.getDate();
  const currentIndex = currentDayNum - 1;

  const currentItem = datesData[currentIndex];

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const playStep = () => {
      if (currentItem) speak(currentItem.kana);

      let nextIndex = -1;
      if (loopMode === 'one') {
        nextIndex = currentIndex;
      } else {
        if (currentIndex < datesData.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (loopMode === 'all') {
          nextIndex = 0;
        }
      }

      const duration = 1600;

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const nextDate = new Date(year, month, nextIndex + 1);
          onDateChange(nextDate);
        } else {
          setIsPlaying(false);
        }
      }, duration);
    };

    playStep();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isPlaying,
    currentIndex,
    loopMode,
    currentItem,
    speak,
    currentDate,
    onDateChange,
  ]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLoop = () => {
    if (loopMode === 'off') setLoopMode('all');
    else if (loopMode === 'all') setLoopMode('one');
    else setLoopMode('off');
  };

  const progressInfo = useMemo(
    () => ({
      current: currentDayNum,
      total: datesData.length,
      percent: (currentDayNum / datesData.length) * 100,
    }),
    [currentDayNum]
  );

  return (
    <div className={styles.container}>
      <DayHero item={currentItem} />

      <DayController
        isPlaying={isPlaying}
        loopMode={loopMode}
        progress={progressInfo}
        onTogglePlay={togglePlay}
        onToggleLoop={toggleLoop}
      />
    </div>
  );
};
