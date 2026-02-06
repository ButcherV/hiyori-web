// Dates/Levels/Level1/Level1.tsx

import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Repeat,
  Repeat1,
  Target,
} from 'lucide-react';
import styles from './Level1.module.css';
import { datesData } from '../../../../datas/datesData';
import { useTTS } from '../../../../hooks/useTTS';

export const Level1 = () => {
  const { speak } = useTTS();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // 新功能状态
  const [isSingleLoop, setIsSingleLoop] = useState(false);
  const [focusIrregular, setFocusIrregular] = useState(false);

  const timerRef = useRef<number | null>(null);
  const currentItem = datesData[currentIndex];

  // 播放逻辑
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const nextStep = () => {
      speak(datesData[currentIndex].kana);

      timerRef.current = window.setTimeout(() => {
        if (isSingleLoop) {
          nextStep(); // 单曲循环：不改变 index，直接递归
        } else {
          // 列表循环逻辑
          setCurrentIndex((prev) => {
            let next = prev + 1;
            // 如果开启了“只看特殊”，寻找下一个特殊日期
            if (focusIrregular) {
              while (next < datesData.length && !datesData[next].isIrregular) {
                next++;
              }
            }
            if (next >= datesData.length) {
              setIsPlaying(false);
              return prev;
            }
            return next;
          });
        }
      }, 2000);
    };

    nextStep();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentIndex, isSingleLoop, focusIrregular, speak]);

  const handleItemClick = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(false);
    speak(datesData[index].kana);
  };

  return (
    <div className={styles.container}>
      {/* 1. Hero Card */}
      <div className={styles.heroSection}>
        <div
          className={styles.navArrow}
          onClick={() => handleItemClick(Math.max(0, currentIndex - 1))}
        >
          <ChevronLeft size={28} />
        </div>

        <div className={styles.heroContent}>
          <div className={`${styles.heroKanji} jaFont`}>
            {currentItem.id} 日
          </div>
          <div className={styles.heroRomaji}>{currentItem.romaji}</div>
          <div
            className={`${styles.heroKana} jaFont ${currentItem.isIrregular ? styles.heroKanaIrregular : ''}`}
          >
            {currentItem.kana}
          </div>
        </div>

        <div
          className={styles.navArrow}
          onClick={() =>
            handleItemClick(Math.min(datesData.length - 1, currentIndex + 1))
          }
        >
          <ChevronRight size={28} />
        </div>
      </div>

      {/* 2. Calendar Grid */}
      <div className={styles.contentArea}>
        <div className={styles.calendarGrid}>
          {datesData.map((day, index) => {
            const isDimmed =
              focusIrregular && !day.isIrregular && currentIndex !== index;
            return (
              <div
                key={day.id}
                className={`
                  ${styles.dayCell} 
                  ${currentIndex === index ? styles.cellActive : ''}
                  ${isDimmed ? styles.dimmed : ''}
                `}
                onClick={() => handleItemClick(index)}
              >
                <span className={styles.dayNumber}>{day.id}</span>
                {day.isIrregular && (
                  <div className={styles.irregularIndicator} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Control Capsule */}
      <div className={styles.controller}>
        <div className={styles.controllerInner}>
          {/* 只看特殊日期 */}
          <div
            className={`${styles.ctrlBtn} ${focusIrregular ? styles.ctrlActive : ''}`}
            onClick={() => setFocusIrregular(!focusIrregular)}
          >
            <Target size={20} />
            <span className={styles.btnLabel}>重点</span>
          </div>

          {/* 单曲循环开关 */}
          <div
            className={`${styles.ctrlBtn} ${isSingleLoop ? styles.ctrlActive : ''}`}
            onClick={() => setIsSingleLoop(!isSingleLoop)}
          >
            {isSingleLoop ? <Repeat1 size={20} /> : <Repeat size={20} />}
            <span className={styles.btnLabel}>
              {isSingleLoop ? '单曲' : '列表'}
            </span>
          </div>

          {/* 进度 */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              minWidth: 40,
              textAlign: 'center',
            }}
          >
            {currentIndex + 1}/31
          </div>

          <div
            className={styles.playBtn}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause size={24} fill="black" />
            ) : (
              <Play size={24} fill="black" style={{ marginLeft: 2 }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
