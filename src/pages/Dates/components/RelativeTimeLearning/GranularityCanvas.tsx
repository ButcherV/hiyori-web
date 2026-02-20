// src/pages/Dates/components/RelativeTimeLearning/GranularityCanvas.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { type Granularity } from '../../Datas/RelativeTimeData';
import styles from './GranularityCanvas.module.css';

const ACCENT = '#0369A1';

const ITEMS: { key: Granularity }[] = [
  { key: 'day' },
  { key: 'week' },
  { key: 'month' },
  { key: 'year' },
];

interface GranularityCanvasProps {
  active: Granularity;
  onSelect: (g: Granularity) => void;
}

export const GranularityCanvas: React.FC<GranularityCanvasProps> = ({
  active,
  onSelect,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {ITEMS.map(({ key }) => {
        const isActive = key === active;
        return (
          <div
            key={key}
            className={styles.chip}
            onClick={() => onSelect(key)}
          >
            {isActive && (
              <motion.div
                layoutId="granularity-pill"
                className={styles.activePill}
                style={{ background: ACCENT }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span
              className={styles.chipLabel}
              style={isActive ? { color: '#fff' } : undefined}
            >
              {t(`date_study.granularity.${key}`)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
