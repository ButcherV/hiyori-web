// src/pages/Dates/components/DayLearning/index.tsx

import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './DayLearning.module.css';
import { DayHero } from './DayHero';
import { DayController, type LoopMode } from './DayController';
import { LegendArea } from './LegendArea'; // 🟢 引入新组件
import { datesData, type DateType } from '../../Levels/Level1/Level1Data';
import { useTTS } from '../../../../hooks/useTTS';

interface DayLearningProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  // 🟢 接收 Filter 状态和回调
  filterType: DateType | null;
  onFilterChange: (type: DateType) => void;
}

export const DayLearning: React.FC<DayLearningProps> = ({
  currentDate,
  onDateChange,
  filterType,
  onFilterChange,
}) => {
  const { speak } = useTTS();
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const timerRef = useRef<number | null>(null);

  const currentDayNum = currentDate.getDate();
  const currentIndex = currentDayNum - 1;
  const currentItem = datesData[currentIndex];

  // ... (播放逻辑保持不变) ...
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const playStep = () => {
      // 检查 Filter：如果不符合，跳过发音
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible) speak(currentItem.kana);

      // 计算下一个索引
      let nextIndex = -1;
      const findNext = (start: number) => {
        // ... (简化的查找逻辑) ...
        let idx = start + 1;
        while (idx < datesData.length) {
          if (!filterType || datesData[idx].type === filterType) return idx;
          idx++;
        }
        return -1;
      };

      // ... (完整的播放循环逻辑建议保留你原有的) ...
      // 这里为了节省篇幅，假设你保留了之前的 findNextIndex 和 useEffect 逻辑
      // 重点是这里依赖 filterType

      // 暂时用简单逻辑模拟：
      const next = findNext(currentIndex);
      // ...

      // 停止逻辑
      setIsPlaying(false);
    };
    // playStep(); // 这里的播放逻辑请复用之前正确的版本
  }, [
    isPlaying,
    currentIndex,
    loopMode,
    currentItem,
    speak,
    currentDate,
    onDateChange,
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
      current: currentDayNum,
      total: datesData.length,
      percent: (currentDayNum / datesData.length) * 100,
    }),
    [currentDayNum]
  );

  return (
    <div className={styles.container}>
      {/* 🟢 Legend 放在 Content 区域 */}
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
