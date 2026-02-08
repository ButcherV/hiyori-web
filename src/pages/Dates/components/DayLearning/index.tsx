// src/pages/Dates/components/DayLearning/index.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './DayLearning.module.css';
import { DayHero } from './DayHero';
import { DayController, type LoopMode } from './DayController';
import { LegendArea } from './LegendArea';
import { datesData, type DateType } from '../../Levels/Level1/Level1Data';
import { useTTS } from '../../../../hooks/useTTS';

interface DayLearningProps {
  // 🟢 接收纯数字
  learningDay: number;
  onDayChange: (day: number) => void;

  filterType: DateType | null;
  onFilterChange: (type: DateType) => void;
}

export const DayLearning: React.FC<DayLearningProps> = ({
  learningDay,
  onDayChange,
  filterType,
  onFilterChange,
}) => {
  const { speak } = useTTS();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const timerRef = useRef<number | null>(null);

  // 🟢 直接通过数字换算索引 (安全可靠，且不会越界，因为 datesData 固定31个)
  // 注意：需要做一个简单的边界保护，防止初始 learningDay 越界
  const safeDay = Math.min(Math.max(1, learningDay), 31);
  const currentIndex = safeDay - 1;
  const currentItem = datesData[currentIndex];

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const playStep = () => {
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible) speak(currentItem.kana);

      // 查找下一个符合条件的索引
      let nextIndex = -1;
      const findNext = (start: number) => {
        let idx = start + 1;
        while (idx < datesData.length) {
          if (!filterType || datesData[idx].type === filterType) return idx;
          idx++;
        }
        return -1;
      };

      if (loopMode === 'one') {
        nextIndex = currentIndex;
      } else {
        nextIndex = findNext(currentIndex);
        // 如果到了末尾，根据模式决定是否回到开头
        if (nextIndex === -1 && loopMode === 'all') {
          // 简化的回头逻辑，实际可以用你之前的完整逻辑
          let first = 0;
          while (first < datesData.length) {
            if (!filterType || datesData[first].type === filterType) {
              nextIndex = first;
              break;
            }
            first++;
          }
        }
      }

      const duration = isVisible ? 1600 : 0; // 这里的时长逻辑可微调

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
          // 🟢 更新数字，而不是 Date
          onDayChange(nextIndex + 1);
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
    onDayChange,
    filterType,
  ]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleLoop = () => {
    if (loopMode === 'off') setLoopMode('all');
    else if (loopMode === 'all') setLoopMode('one');
    else setLoopMode('off');
  };

  const progressInfo = useMemo(
    () => ({
      current: safeDay,
      total: datesData.length,
      percent: (safeDay / datesData.length) * 100,
    }),
    [safeDay]
  );

  return (
    <div className={styles.container}>
      <LegendArea filterType={filterType} onFilterChange={onFilterChange} />
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
