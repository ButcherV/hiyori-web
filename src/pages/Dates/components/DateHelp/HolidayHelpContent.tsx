// src/pages/Dates/components/DateHelp/HolidayHelpContent.tsx

import React from 'react';
import { Sun, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './DateHelpContent.module.css';

const RED_DAY_TYPES = ['national', 'substitute', 'citizen'] as const;

const CATEGORY_ACCENTS = {
  national:    '#E11D48',
  traditional: '#7C3AED',
  global:      '#EA580C',
} as const;

export const HolidayHelpContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* ── Red Day system ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Sun size={16} color="#ef4444" fill="#ef4444" fillOpacity={0.15} />
          <span>{t('date_study.help.holiday.redday_title')}</span>
        </div>
        <div className={styles.holidayTypeList}>
          {RED_DAY_TYPES.map((type) => (
            <div key={type} className={styles.holidayTypeRow}>
              <span className={styles.holidayTypeName}>
                {t(`date_study.help.holiday.type_${type}_name`)}
              </span>
              <p className={styles.holidayTypeDesc}>
                {t(`date_study.help.holiday.type_${type}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Three categories ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Tag size={16} color="var(--color-Gray6)" />
          <span>{t('date_study.help.holiday.categories_title')}</span>
        </div>
        <div className={styles.holidayTypeList}>
          {(['national', 'traditional', 'global'] as const).map((cat) => (
            <div key={cat} className={styles.holidayTypeRow}>
              <span
                className={styles.holidayTypeName}
                style={{ color: CATEGORY_ACCENTS[cat] }}
              >
                {t(`date_study.help.holiday.cat_${cat}_name`)}
              </span>
              <p className={styles.holidayTypeDesc}>
                {t(`date_study.help.holiday.cat_${cat}_desc`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
