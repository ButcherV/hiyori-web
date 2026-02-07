import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Level1Hero.module.css'; // 🟢 引用自己的样式
import { type DateItem } from '../Level1Data';
import { useTranslation } from 'react-i18next';

interface Level1HeroProps {
  item: DateItem | undefined;
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const Level1Hero: React.FC<Level1HeroProps> = ({
  item,
  onPrev,
  onNext,
  isFirst,
  isLast,
}) => {
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const descText = item?.description?.[currentLang] ?? '';

  if (!item)
    return (
      <div className={styles.heroSection}>{t('date_study.level1.loading')}</div>
    );

  return (
    <div className={`${styles.heroSection} ${styles[`heroType_${item.type}`]}`}>
      <div className={`${styles.typeBadge} ${styles[`badge_${item.type}`]}`}>
        {t(`date_study.level1.types.${item.type}.badge`)}
      </div>

      <div className={styles.heroMainRow}>
        <button className={styles.navArrow} onClick={onPrev} disabled={isFirst}>
          <ChevronLeft size={24} />
        </button>

        <div className={styles.heroContent}>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div className={`${styles.heroSubNumber} jaFont`}>
                {item.id} 日
              </div>
              <div className={`${styles.heroKanji} jaFont`}>{item.kanji}</div>
              <div className={styles.heroRomaji}>{item.romaji}</div>
              <div className={`${styles.heroKana} jaFont`}>{item.kana}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className={styles.navArrow} onClick={onNext} disabled={isLast}>
          <ChevronRight size={24} />
        </button>

        {/* Description 区域 */}
        <div className={styles.heroDescWrapper}>
          <AnimatePresence mode="wait">
            {item.description && (
              <motion.div
                key={`desc-${item.id}`}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                transition={{ delay: 0.06, duration: 0.25, ease: 'easeOut' }}
              >
                {/* 🟢 替换 notePill，使用专属样式的 Pill */}
                <span className={`${styles.descPill}`}>
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
