import React, { useState, useMemo } from 'react';
import styles from './Level4.module.css';
import { getYearData, ERAS } from './Level4Data';
import { TimeWheel } from './components/TimeWheel';
import { YearCard } from './components/YearCard';

export const Level4 = () => {
  // 默认从 2024 年开始
  const [currentYear, setCurrentYear] = useState(2024);

  // 范围：1868 (明治元年) ~ 2035 (未来)
  const MIN_YEAR = 1868;
  const MAX_YEAR = 2035;

  // 实时获取当前年份的详细数据
  const yearData = useMemo(() => getYearData(currentYear), [currentYear]);

  // 切换到上一个年号的起始年
  const handlePrevEra = () => {
    const currentIndex = ERAS.findIndex((e) => e.key === yearData.era.key);
    if (currentIndex > 0) {
      setCurrentYear(ERAS[currentIndex - 1].startYear);
    } else {
      // 已经是明治了，跳到最开始
      setCurrentYear(MIN_YEAR);
    }
  };

  // 切换到下一个年号的起始年
  const handleNextEra = () => {
    const currentIndex = ERAS.findIndex((e) => e.key === yearData.era.key);
    if (currentIndex < ERAS.length - 1) {
      setCurrentYear(ERAS[currentIndex + 1].startYear);
    } else {
      setCurrentYear(MAX_YEAR);
    }
  };

  return (
    <div className={styles.container}>
      {/* 上半部分：HUD 信息面板 */}
      <div className={styles.topSection}>
        <YearCard
          data={yearData}
          onPrevEra={handlePrevEra}
          onNextEra={handleNextEra}
        />
      </div>

      {/* 下半部分：时间轮盘 */}
      <div className={styles.bottomSection}>
        {/* 一个渐变的遮罩，让轮盘与卡片区过渡自然 */}
        <div className={styles.gradientOverlay} />

        <TimeWheel
          minYear={MIN_YEAR}
          maxYear={MAX_YEAR}
          currentYear={currentYear}
          onYearChange={setCurrentYear}
        />

        {/* 底部安全区 */}
        <div className={styles.safeArea} />
      </div>
    </div>
  );
};
