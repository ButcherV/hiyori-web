// src/pages/Dates/Levels/Level4/components/TimeWheel.tsx

import React, { useRef, useEffect, ReactNode } from 'react';
import styles from './TimeWheel.module.css';

interface TimeWheelProps {
  minYear: number;
  maxYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  children?: ReactNode;
}

export const TimeWheel: React.FC<TimeWheelProps> = ({
  minYear,
  maxYear,
  currentYear,
  onYearChange,
  children,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);

  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => minYear + i
  );

  const RADIUS = 200;
  const ANGLE_PER_ITEM = 18;
  const PIXELS_PER_DEGREE = 3;
  const ITEM_PIXEL_WIDTH = ANGLE_PER_ITEM * PIXELS_PER_DEGREE;

  const updateRotation = () => {
    if (!scrollRef.current || !cylinderRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;
    const currentAngle = -(scrollLeft / ITEM_PIXEL_WIDTH) * ANGLE_PER_ITEM;
    cylinderRef.current.style.transform = `rotateY(${currentAngle}deg)`;

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
      <div
        className={styles.scrollTrack}
        ref={scrollRef}
        onScroll={handleScroll}
      >
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
        <div
          className={styles.spacer}
          style={{ width: `calc(50% - ${ITEM_PIXEL_WIDTH / 2}px)` }}
        />
      </div>

      <div className={styles.cylinderStage}>
        {/* 卡片容器：Z=0 */}
        <div className={styles.centerObject}>{children}</div>

        {/* 3D 轮盘 */}
        <div className={styles.cylinderBody} ref={cylinderRef}>
          <div className={styles.topFace} />
          <div className={styles.bottomFace} />
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

      {/* 🟢 新增：物理遮罩层，替代 mask-image，避免破坏 3D 空间 */}
      <div className={styles.fadeOverlay} />
    </div>
  );
};
