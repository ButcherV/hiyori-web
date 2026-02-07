// src/pages/Dates/Levels/Level1/Level1.tsx

import { useState, useEffect, useRef } from 'react';
import styles from './Level1.module.css'; // 只引入容器样式
import { datesData, type DateType } from './Level1Data';
import { useTTS } from '../../../../hooks/useTTS';

import { Level1Hero } from './components/Level1Hero';
import { Level1Content } from './components/Level1Content';
import { Level1Controller } from './components/Level1Controller';

export const Level1 = () => {
  const { speak } = useTTS();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoopMode, setIsLoopMode] = useState(false);
  const [filterType, setFilterType] = useState<DateType | null>(null);

  const timerRef = useRef<number | null>(null);
  const currentList = datesData || [];
  const currentItem = currentList[currentIndex];

  const findNextValidIndex = (
    startIndex: number,
    direction: 'next' | 'first'
  ): number => {
    if (!filterType) return direction === 'first' ? 0 : startIndex + 1;
    let searchIndex = direction === 'first' ? 0 : startIndex + 1;
    while (searchIndex < currentList.length) {
      if (currentList[searchIndex].type === filterType) return searchIndex;
      searchIndex++;
    }
    return -1;
  };

  useEffect(() => {
    if (!isPlaying || !currentList.length) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    const playNext = () => {
      const isVisible = !filterType || currentItem.type === filterType;
      if (isVisible && currentItem) speak(currentItem.kana);

      const nextIndex = findNextValidIndex(currentIndex, 'next');
      const duration = isVisible ? 1500 : 0;

      timerRef.current = window.setTimeout(() => {
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);
        } else if (isLoopMode) {
          const firstIndex = findNextValidIndex(0, 'first');
          setCurrentIndex(firstIndex !== -1 ? firstIndex : 0);
        } else {
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
    isLoopMode,
    currentList.length,
    speak,
    filterType,
    currentItem,
  ]);

  const handleFilterChange = (type: DateType) => {
    const newFilter = filterType === type ? null : type;
    setFilterType(newFilter);
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
        isLoopMode={isLoopMode}
        currentIndex={currentIndex}
        totalCount={currentList.length}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onToggleLoop={() => setIsLoopMode(!isLoopMode)}
      />
    </div>
  );
};
