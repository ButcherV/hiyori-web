import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './DayLearning.module.css';
import { DayHero } from './DayHero';
import { DayController, type LoopMode } from './DayController';
import { LegendArea } from './LegendArea';
import { datesData, type DateType } from '../../Datas/DayData';
import { useTTS } from '../../../../hooks/useTTS';

interface DayLearningProps {
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

  const safeDay = Math.min(Math.max(1, learningDay), 31);
  const currentIndex = safeDay - 1;
  const currentItem = datesData[currentIndex];

  // 1. 计算当前生效的列表
  const displayList = useMemo(() => {
    if (!filterType) return datesData;
    return datesData.filter((d) => d.type === filterType);
  }, [filterType]);

  // 2. 找到当前显示的日期在这个列表里的下标
  const currentIndexInList = displayList.findIndex((d) => d.id === safeDay);
  const isInList = currentIndexInList !== -1;

  // 3. 判断边界
  const isFirst = isInList && currentIndexInList === 0;
  const isLast = isInList && currentIndexInList === displayList.length - 1;

  // 当 Filter 改变，且当前显示的日期不在新列表里时，自动跳到第一个符合条件的日期
  useEffect(() => {
    if (filterType && !isInList && displayList.length > 0) {
      onDayChange(displayList[0].id);
    }
  }, [filterType, isInList, displayList, onDayChange]);

  // 导航逻辑
  const handlePrev = () => {
    if (isInList) {
      if (currentIndexInList > 0) {
        onDayChange(displayList[currentIndexInList - 1].id);
      }
    } else if (displayList.length > 0) {
      onDayChange(displayList[displayList.length - 1].id);
    }
  };

  const handleNext = () => {
    if (isInList) {
      if (currentIndexInList < displayList.length - 1) {
        onDayChange(displayList[currentIndexInList + 1].id);
      }
    } else if (displayList.length > 0) {
      onDayChange(displayList[0].id);
    }
  };

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const playStep = () => {
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible) speak(currentItem.kana);

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
        if (nextIndex === -1 && loopMode === 'all') {
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

      // 控制停留时间 (毫秒)
      const duration = isVisible ? 3200 : 0;

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
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

  const progressInfo = useMemo(() => {
    const total = displayList.length;
    // 如果当前项在列表里，显示它的位置 (1-based)
    // 如果不在列表里(比如自动跳转生效前的一瞬间)，暂时显示 0，避免显示错误的数据
    const current = isInList ? currentIndexInList + 1 : 0;

    return {
      current,
      total,
      percent: total > 0 ? (current / total) * 100 : 0,
    };
  }, [displayList.length, isInList, currentIndexInList]);

  return (
    <div className={styles.container}>
      <LegendArea filterType={filterType} onFilterChange={onFilterChange} />

      <DayHero
        item={currentItem}
        onPrev={handlePrev}
        onNext={handleNext}
        isFirst={isFirst}
        isLast={isLast}
      />

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
