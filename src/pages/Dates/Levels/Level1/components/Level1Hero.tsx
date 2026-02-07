import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Level1Hero.module.css'; // 🟢 引用自己的样式
import { type DateItem } from '../Level1Data';

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
  if (!item) return <div className={styles.heroSection}>Loading...</div>;

  return (
    <div className={`${styles.heroSection} ${styles[`heroType_${item.type}`]}`}>
      <div className={`${styles.typeBadge} ${styles[`badge_${item.type}`]}`}>
        {item.type === 'rune' && '特殊词 (Rune)'}
        {item.type === 'mutant' && '音变 (Mutant)'}
        {item.type === 'trap' && '注意 (Trap)'}
        {item.type === 'regular' && '规则 (Regular)'}
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
              <div className={styles.heroSubNumber}>{item.id}日</div>
              <div className={`${styles.heroKanji} jaFont`}>{item.kanji}</div>
              <div className={`${styles.heroKana} jaFont`}>{item.kana}</div>
              <div className={styles.heroRomaji}>{item.romaji}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button className={styles.navArrow} onClick={onNext} disabled={isLast}>
          <ChevronRight size={24} />
        </button>
      </div>

      <div className={styles.heroDescWrapper}>
        <AnimatePresence mode="wait">
          {item.description && (
            <motion.div
              key={`desc-${item.id}`}
              className={styles.heroDescription}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {item.description}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
