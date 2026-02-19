// src/pages/Dates/components/DateHelp/MonthHelpContent.tsx

import React from 'react';
import { AlertTriangle, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DateHelpContent.module.css';

const TRAP_MONTHS = [
  { key: '4', kana: 'しがつ', romaji: 'shi·ga·tsu' },
  { key: '7', kana: 'しちがつ', romaji: 'shi·chi·ga·tsu' },
  { key: '9', kana: 'くがつ', romaji: 'ku·ga·tsu' },
] as const;

export const MonthHelpContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <AlertTriangle size={16} color="var(--color-type-trap-bg, #facc15)" />
          <span>{t('date_study.help.month.traps_title')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text} style={{ marginBottom: 10 }}>
            {t('date_study.help.month.traps_desc')}
          </p>
        </div>
        <div className={styles.trapList}>
          {TRAP_MONTHS.map(({ key, kana, romaji }) => (
            <div key={key} className={styles.trapRow}>
              <span className={styles.trapMonth}>
                {t(`date_study.help.month.trap_${key}_month`)}
              </span>
              <span className={`${styles.trapKana} jaFont`}>
                {kana}
              </span>
              <span className={styles.trapRule}>
                {t(`date_study.help.month.trap_${key}_rule`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <BookOpen size={16} color="var(--color-Gray6)" />
          <span>{t('date_study.help.month.classical_title')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            {t('date_study.help.month.classical_desc')}
          </p>
        </div>
      </div>
    </div>
  );
};
