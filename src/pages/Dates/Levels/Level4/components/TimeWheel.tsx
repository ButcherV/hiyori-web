// src/pages/Dates/Levels/Level4/components/TimeWheel.tsx

import React, { useRef, useEffect, useState } from 'react';
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

  // 🟢 物理参数
  const RADIUS = 200; // 圆柱半径
  const ANGLE_PER_ITEM = 18; // 每个年份占多少度 (越小越密)

  // 用来控制虚拟滚动的宽度，模拟阻尼
  // 360度 = 多少像素的滚动距离？设大一点手感好
  const PIXELS_PER_DEGREE = 3;
  const ITEM_PIXEL_WIDTH = ANGLE_PER_ITEM * PIXELS_PER_DEGREE;

  // 渲染循环
  const updateRotation = () => {
    if (!scrollRef.current || !cylinderRef.current) return;

    const scrollLeft = scrollRef.current.scrollLeft;

    // 计算当前总旋转角度
    // 滚动 1个 itemWidth = 旋转 1个 angle
    const currentAngle = -(scrollLeft / ITEM_PIXEL_WIDTH) * ANGLE_PER_ITEM;

    // 应用旋转到圆柱体
    cylinderRef.current.style.transform = `rotateY(${currentAngle}deg)`;

    // 计算当前选中的年份 (用于高亮)
    // 加上一个微小的偏移防止 flicker
    const index = Math.round(scrollLeft / ITEM_PIXEL_WIDTH);
    const activeYear = minYear + index;

    // 我们不需要 React state 来控制高亮（太慢），直接操作 DOM class
    // 这里简单起见，我们还是通知父组件，但也做一些本地优化
    if (activeYear !== currentYearRef.current) {
      // 更新高亮 class
      const oldEl = cylinderRef.current.querySelector(`.${styles.faceActive}`);
      if (oldEl) oldEl.classList.remove(styles.faceActive);

      // 找到新的 element
      // 注意：数据量大时 querySelector 可能会慢，生产环境建议用 Map 缓存 Refs
      // 这里为了演示直接查 data-year
      const newEl = cylinderRef.current.querySelector(
        `[data-year="${activeYear}"]`
      );
      if (newEl) newEl.classList.add(styles.faceActive);
    }
  };

  // 使用 ref 追踪 currentYear 避免闭包陷阱
  const currentYearRef = useRef(currentYear);
  useEffect(() => {
    currentYearRef.current = currentYear;
  }, [currentYear]);

  // 滚动处理
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
        // 简单判断是否需要动画
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
        <div className={styles.spacer} />
        {years.map((y) => (
          <div
            key={y}
            className={styles.snapItem}
            style={{ width: ITEM_PIXEL_WIDTH }}
          />
        ))}
        <div className={styles.spacer} />
      </div>

      {/* 3D 视觉层 */}
      <div className={styles.cylinderStage}>
        <div className={styles.cylinderBody} ref={cylinderRef}>
          {/* 顶盖和底盖 */}
          <div className={styles.topFace} />
          <div className={styles.bottomFace} />

          {/* 侧面年份 */}
          {years.map((year, i) => {
            // 只渲染视野附近的 DOM 以提升性能 (可视角度 +/- 100度)
            const relativeIndex = i - (currentYear - minYear);
            const angleDiff = relativeIndex * ANGLE_PER_ITEM;
            // if (Math.abs(angleDiff) > 120) return null; // 简单剔除不可见项

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
