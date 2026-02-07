// src/pages/Dates/Levels/Level1/Level1.tsx

import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Level1.module.css';
import { datesData, type DateType } from './Level1Data';
import { useTTS } from '../../../../hooks/useTTS';

import { Level1Hero } from './components/Level1Hero';
import { Level1Content } from './components/Level1Content';
import { Level1Controller } from './components/Level1Controller';

export type LoopMode = 'off' | 'all' | 'one';

export const Level1 = () => {
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopMode, setLoopMode] = useState<LoopMode>('off');
  const [filterType, setFilterType] = useState<DateType | null>(null);

  // 🟢 新增：心跳状态，用于强制触发 useEffect
  // 专门解决 "单曲循环时 index 不变导致 useEffect 不跑" 的 Bug
  const [tick, setTick] = useState(0);

  const timerRef = useRef<number | null>(null);
  const currentList = datesData || [];
  const currentItem = currentList[currentIndex];

  // 进度计算 (保持不变)
  const progressInfo = useMemo(() => {
    if (!filterType) {
      return {
        current: currentIndex + 1,
        total: currentList.length,
        percent: ((currentIndex + 1) / currentList.length) * 100,
      };
    }
    const filteredList = currentList.filter((d) => d.type === filterType);
    const total = filteredList.length;
    const indexInFilter = filteredList.findIndex(
      (d) => d.id === currentItem.id
    );
    const current = indexInFilter !== -1 ? indexInFilter + 1 : 0;
    return {
      current,
      total,
      percent: total > 0 ? (current / total) * 100 : 0,
    };
  }, [currentIndex, currentList, filterType, currentItem]);

  // 查找下一个索引 (保持不变)
  const findNextIndex = (currentIdx: number): number => {
    if (loopMode === 'one') return currentIdx; // 单曲循环：永远返回自己

    let searchIndex = currentIdx + 1;
    while (searchIndex < currentList.length) {
      if (!filterType || currentList[searchIndex].type === filterType) {
        return searchIndex;
      }
      searchIndex++;
    }

    if (loopMode === 'all') {
      let firstIndex = 0;
      while (firstIndex < currentList.length) {
        if (!filterType || currentList[firstIndex].type === filterType) {
          return firstIndex;
        }
        firstIndex++;
      }
    }
    return -1;
  };

  // --- 播放核心逻辑 ---
  useEffect(() => {
    if (!isPlaying || !currentList.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const playStep = () => {
      // 1. 发声
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible && currentItem) {
        speak(currentItem.kana);
      }

      // 2. 计算下一跳
      const nextIndex = findNextIndex(currentIndex);

      let duration = isVisible ? 1600 : 0;
      if (loopMode === 'one') duration = 1200;

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);

          // 🟢 关键修复：
          // 无论 index 变没变，都更新 tick，强行触发下一次 useEffect
          setTick((t) => t + 1);
        } else {
          setIsPlaying(false);
        }
      }, duration);
    };

    playStep();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    // 🟢 依赖数组里加入 `tick`
    // 这样每次 setTick，useEffect 都会重新运行，实现单曲循环
  }, [
    isPlaying,
    currentIndex,
    loopMode,
    filterType,
    currentItem,
    speak,
    currentList.length,
    tick,
  ]);

  // --- 交互 ---
  const handleFilterChange = (type: DateType) => {
    const newFilter = filterType === type ? null : type;
    setFilterType(newFilter);
    if (newFilter && currentItem.type !== newFilter) {
      const firstValid = datesData.findIndex((d) => d.type === newFilter);
      if (firstValid !== -1) setCurrentIndex(firstValid);
    }
  };

  const toggleLoopMode = () => {
    if (loopMode === 'off') setLoopMode('all');
    else if (loopMode === 'all') setLoopMode('one');
    else setLoopMode('off');
  };

  return (
    <div className={styles.container}>
      <Level1Hero
        item={currentItem}
        onPrev={() => setCurrentIndex((p) => Math.max(0, p - 1))}
        onNext={() =>
          setCurrentIndex((p) => Math.min(currentList.length - 1, p + 1))
        }
        isFirst={currentIndex === 0}
        isLast={currentIndex === currentList.length - 1}
      />

      <Level1Content
        list={currentList}
        currentIndex={currentIndex}
        filterType={filterType}
        onFilterChange={handleFilterChange}
        onItemClick={(idx) => {
          setCurrentIndex(idx);
          setIsPlaying(false);
          speak(currentList[idx].kana);
        }}
      />

      <Level1Controller
        isPlaying={isPlaying}
        loopMode={loopMode}
        progress={progressInfo}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleLoop={toggleLoopMode}
      />
    </div>
  );
};
