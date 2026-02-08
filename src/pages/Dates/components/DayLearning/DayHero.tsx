// src/pages/Dates/components/DayLearning/DayHero.tsx

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔴 引用独立的 CSS
import styles from './DayHero.module.css';
import { type DateItem } from '../../Levels/Level1/Level1Data';
import { useTranslation } from 'react-i18next';

interface DayHeroProps {
  item: DateItem | undefined;
}

export const DayHero: React.FC<DayHeroProps> = ({ item }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  if (!item) return <div className={styles.heroEmpty}>Select a date</div>;

  const descText = item.description?.[currentLang] ?? '';

  return (
    <div className={`${styles.heroSection} ${styles[`heroType_${item.type}`]}`}>
      <div className={`${styles.typeBadge} ${styles[`badge_${item.type}`]}`}>
        {t(`date_study.level1.types.${item.type}.badge`)}
      </div>

      <div className={styles.heroMainRow}>
        <div className={styles.heroContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={styles.heroInner}
            >
              {/* 🟢 加上 jaFont 保证字体正确 */}
              {/* <div className={`${styles.heroSubNumber} jaFont`}>
                {item.id} 日
              </div> */}
              <div className={`${styles.heroKanji} jaFont`}>{item.kanji}</div>
              <div className={styles.heroRomaji}>{item.romaji}</div>
              <div className={`${styles.heroKana} jaFont`}>{item.kana}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className={styles.heroDescWrapper}>
          <AnimatePresence mode="wait">
            {descText && (
              <motion.div
                key={`desc-${item.id}`}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                transition={{ delay: 0.1 }}
              >
                <span className={styles.descPill}>
                  {descText.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < descText.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
