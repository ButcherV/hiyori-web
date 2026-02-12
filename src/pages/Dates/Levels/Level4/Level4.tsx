import { useState, useMemo } from 'react';
import styles from './Level4.module.css';
import { getYearData, ERAS } from './Level4Data';
import { TimeWheel } from './components/TimeWheel';
import { YearCard } from './components/YearCard';

export const Level4 = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const MIN_YEAR = 1868;
  const MAX_YEAR = 2035;

  const yearData = useMemo(() => getYearData(currentYear), [currentYear]);

  const handlePrevEra = () => {
    const currentIndex = ERAS.findIndex((e) => e.key === yearData.era.key);
    if (currentIndex > 0) {
      setCurrentYear(ERAS[currentIndex - 1].startYear);
    } else {
      setCurrentYear(MIN_YEAR);
    }
  };

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
      <TimeWheel
        minYear={MIN_YEAR}
        maxYear={MAX_YEAR}
        currentYear={currentYear}
        onYearChange={setCurrentYear}
      >
        <YearCard
          data={yearData}
          onPrevEra={handlePrevEra}
          onNextEra={handleNextEra}
        />
      </TimeWheel>
    </div>
  );
};
