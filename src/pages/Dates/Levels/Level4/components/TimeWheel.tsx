// src/pages/Dates/Levels/Level4/components/TimeWheel.tsx

import React, { useRef, useEffect } from 'react';
import styles from './TimeWheel.module.css';

interface TimeWheelProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
}

export const TimeWheel: React.FC<TimeWheelProps> = ({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  // 物理参数
  const RADIUS = 200;
  const ANGLE_PER_ITEM = 18;
  const PIXELS_PER_DEGREE = 3;
  const ITEM_PIXEL_WIDTH = ANGLE_PER_ITEM * PIXELS_PER_DEGREE; // 54px

  // 渲染循环
  const updateRotation = () => {
    if (!scrollRef.current || !cylinderRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;

    // 旋转圆柱体
    const currentAngle = -(scrollLeft / ITEM_PIXEL_WIDTH) * ANGLE_PER_ITEM;
    cylinderRef.current.style.transform = `rotateY(${currentAngle}deg)`;

    // 高亮逻辑
    const index = Math.round(scrollLeft / ITEM_PIXEL_WIDTH);
    const activeYear = minYear + index;

    if (activeYear !== currentYearRef.current) {
      const oldEl = cylinderRef.current.querySelector(`.${styles.faceActive}`);
      if (oldEl) oldEl.classList.remove(styles.faceActive);

      const newEl = cylinderRef.current.querySelector(
        `[data-year="${activeYear}"]`
      );
      if (newEl) newEl.classList.add(styles.faceActive);
    }
  };

  const currentYearRef = useRef(currentYear);
  useEffect(() => {
    currentYearRef.current = currentYear;
  }, [currentYear]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    window.requestAnimationFrame(updateRotation);

    const scrollLeft = scrollRef.current.scrollLeft;
    const index = Math.round(scrollLeft / ITEM_PIXEL_WIDTH);
    const newYear = minYear + index;

    if (
      newYear >= minYear &&
      newYear <= maxYear &&
      newYear !== currentYearRef.current
    ) {
      onYearChange(newYear);
    }
  };

  // 外部 currentYear 变化 -> 同步滚动位置
  useEffect(() => {
    if (scrollRef.current) {
      const targetScrollLeft = (currentYear - minYear) * ITEM_PIXEL_WIDTH;
      if (Math.abs(scrollRef.current.scrollLeft - targetScrollLeft) > 2) {
        const isFar =
          Math.abs(scrollRef.current.scrollLeft - targetScrollLeft) > 500;
        scrollRef.current.scrollTo({
          left: targetScrollLeft,
          behavior: isFar ? 'auto' : 'smooth',
        });
      }
    }
  }, [currentYear, minYear, ITEM_PIXEL_WIDTH]);

  return (
    <div className={styles.wheelContainer}>
      <div className={styles.cursor} />

      {/* 隐形交互层 */}
      <div
        className={styles.scrollTrack}
        ref={scrollRef}
        onScroll={handleScroll}
      >
        {/* 🟢 修复：Spacer 减去半个刻度宽，确保 Item 中心完美对齐屏幕中心 */}
        <div
          className={styles.spacer}
          style={{ width: `calc(50% - ${ITEM_PIXEL_WIDTH / 2}px)` }}
        />

        {years.map((y) => (
          <div
            key={y}
            className={styles.snapItem}
            style={{ width: ITEM_PIXEL_WIDTH }}
          />
        ))}

        {/* 右侧 Spacer 也要对称 */}
        <div
          className={styles.spacer}
          style={{ width: `calc(50% - ${ITEM_PIXEL_WIDTH / 2}px)` }}
        />
      </div>

      {/* 3D 视觉层 */}
      <div className={styles.cylinderStage}>
        <div className={styles.cylinderBody} ref={cylinderRef}>
          <div className={styles.topFace} />
          <div className={styles.bottomFace} />

          {/* 侧面年份 */}
          {years.map((year, i) => {
            const distance = Math.abs(year - currentYear);
            if (distance > 15) return null;

            return (
              <div
                key={year}
                data-year={year}
                className={`${styles.faceItem} ${year === currentYear ? styles.faceActive : ''}`}
                style={{
                  transform: `rotateY(${i * ANGLE_PER_ITEM}deg) translateZ(${RADIUS}px)`,
                }}
              >
                {year}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
