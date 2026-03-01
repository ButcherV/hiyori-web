import { useTranslation } from 'react-i18next';
import { Volume2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimePeriod } from './types';
import styles from './PeriodInfo.module.css';

interface PeriodInfoProps {
  selectedPeriod: TimePeriod | null;
  onPlayPeriod: () => void;
}

export function PeriodInfo({ selectedPeriod, onPlayPeriod }: PeriodInfoProps) {
  const { t } = useTranslation();

  // 生成时间范围文本
  const getTimeRangeText = (period: TimePeriod) => {
    if (period.start === period.end) {
      return `${period.start}:00`;
    }
    const endH = period.end === 0 ? 24 : period.end;
    return `${period.start}:00 ~ ${endH}:00`;
  };

  // 用于 AnimatePresence 的唯一 key
  const contentKey = selectedPeriod ? selectedPeriod.i18nKey : 'empty';

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          className={styles.content}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className={styles.timeRow}>
            {selectedPeriod ? (
              <>
                <div className={styles.segment}>
                  <span className={`${styles.segKana} jaFont`}>{selectedPeriod.kana}</span>
                  <span className={`${styles.segKanji} jaFont`}>{selectedPeriod.name}</span>
                </div>
                <button className={styles.speakerBtnSmall} onClick={onPlayPeriod}>
                  <Volume2 size={14} />
                </button>
              </>
            ) : (
              <div className={styles.segment}>
                <span className={`${styles.segKana} jaFont`}>じかんたい</span>
                <span className={styles.segKanji}>—</span>
              </div>
            )}
          </div>

          {selectedPeriod && (
            <>
              <div className={styles.timeRange}>
                {getTimeRangeText(selectedPeriod)}
              </div>
              <div className="notePill">
                <Lightbulb size={14} className="noteIcon" />
                <span className="noteText">
                  {t(`clock_study.period.${selectedPeriod.i18nKey}`, '')}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
