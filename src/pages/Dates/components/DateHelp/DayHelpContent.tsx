// src/pages/Dates/components/DateHelp/DayHelpContent.tsx

import React from 'react';
import { Target, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DateHelpContent.module.css';

const TYPES = ['rune', 'mutant', 'trap', 'regular'] as const;

export const DayHelpContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Target size={16} color="var(--color-error)" />
          <span>{t('date_study.help.day.types_title')}</span>
        </div>
        <div className={styles.typeList}>
          {TYPES.map((type) => (
            <div key={type} className={styles.typeRow}>
              <div className={styles.typeHeader}>
                <span
                  className={`${styles.typeBadge} ${styles[`badge_${type}`]}`}
                >
                  {type.toUpperCase()}
                </span>
                <span className={styles.typeName}>
                  {t(`date_study.help.day.${type}_name`)}
                </span>
              </div>
              <p className={styles.typeDesc}>
                {t(`date_study.help.day.${type}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Lightbulb
            size={16}
            color="var(--color-study-date, #f59e0b)"
            fill="var(--color-study-date, #f59e0b)"
            fillOpacity={0.2}
          />
          <span>{t('date_study.help.day.tip_title')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>{t('date_study.help.day.tip_desc')}</p>
        </div>
      </div>
    </div>
  );
};
