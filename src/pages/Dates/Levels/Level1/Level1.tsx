// src/pages/Dates/Levels/Level1/Level1.tsx

import { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Level1.module.css';
import { datesData, type DateType } from './Level1Data'; // 注意路径
import { useTTS } from '../../../../hooks/useTTS';

import { Level1Hero } from './components/Level1Hero';
import { Level1Content } from './components/Level1Content';
import { Level1Controller } from './components/Level1Controller';

export const Level1 = () => {
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const timerRef = useRef<number | null>(null);
  const currentList = datesData || [];
  const currentItem = currentList[currentIndex];

  // 🟢 新增：计算“有效播放队列”的信息，传给 Controller
  const progressInfo = useMemo(() => {
    // 1. 如果没筛选，就是简单索引
    if (!filterType) {
      return {
        current: currentIndex + 1,
        total: currentList.length,
        percent: ((currentIndex + 1) / currentList.length) * 100,
      };
    }

    // 2. 如果有筛选，计算当前项在“筛选列表”里的排名
    const filteredList = currentList.filter((d) => d.type === filterType);
    const total = filteredList.length;
    // 找当前 ID 在筛选列表里的位置
    const indexInFilter = filteredList.findIndex(
      (d) => d.id === currentItem.id
    );

    // 如果当前选中的项不符合筛选（比如用户手动点了灰色的），进度显示为 "- / Total" 或者保持上一个
    const current = indexInFilter !== -1 ? indexInFilter + 1 : 0;

    return {
      current,
      total,
      percent: total > 0 ? (current / total) * 100 : 0,
    };
  }, [currentIndex, currentList, filterType, currentItem]);

  // --- 播放逻辑 ---
  // 查找下一个符合条件的索引
  const findNextValidIndex = (startIndex: number): number => {
    if (!filterType) return startIndex + 1; // 没筛选直接+1

    let searchIndex = startIndex + 1;
    while (searchIndex < currentList.length) {
      if (currentList[searchIndex].type === filterType) return searchIndex;
      searchIndex++;
    }
    return -1; // 没找到（到头了）
  };

  useEffect(() => {
    if (!isPlaying || !currentList.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const playNext = () => {
      // 1. 只有当前项符合筛选（或没筛选）时才发声
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible && currentItem) speak(currentItem.kana);

      // 2. 找下一个
      const nextIndex = findNextValidIndex(currentIndex);

      // 如果当前项被过滤掉了，0秒跳过；否则正常间隔
      const duration = isVisible ? 1500 : 0;

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
          // 还有下一个，继续
          setCurrentIndex(nextIndex);
        } else {
          // 到头了，停止播放 (去掉了 Loop 逻辑，保持克制)
          setIsPlaying(false);
        }
      }, duration);
    };

    playNext();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [
    isPlaying,
    currentIndex,
    currentList.length,
    speak,
    filterType,
    currentItem,
  ]);

  // --- 交互 ---
  const handleFilterChange = (type: DateType) => {
    const newFilter = filterType === type ? null : type;
    setFilterType(newFilter);
    // 切换筛选时，如果当前项不符合，自动跳到该类型的第一个
    if (newFilter && currentItem.type !== newFilter) {
      const firstValid = datesData.findIndex((d) => d.type === newFilter);
      if (firstValid !== -1) setCurrentIndex(firstValid);
    }
  };

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    speak(currentList[index].kana);
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
        onItemClick={handleItemClick}
      />

      <Level1Controller
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        // 🟢 传入新的进度对象
        progress={progressInfo}
      />
    </div>
  );
};
