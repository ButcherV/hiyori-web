import React from 'react';
import type { ReviewItem } from '../lessonLogic';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';

import styles from './ReviewCard.module.css';
import commonStyles from '../TestStudySession.module.css';

interface Props {
  items: ReviewItem[];
  onPlaySound: (char: string) => void;
}

export const ReviewCard: React.FC<Props> = ({ items }) => {
  const { i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  const getMeaning = (m: any) => {
    if (!m) return '';

    const lang = i18n.language;
    if (lang === 'zh-Hant') {
      return m.zhHant;
    }

    if (lang.startsWith('zh')) {
      return m.zh;
    }

    return m.en;
  };

  return (
    <div className={styles.container}>
      {items.map((item, idx) => (
        <div key={`${item.char}-${idx}`} className={styles.reviewRow}>
          <div className={styles.reviewLeft}>
            <span className={`${styles.reviewChar} ${commonStyles.jaFont}`}>
              {item.char}
            </span>
            <span className={styles.reviewRomaji}>{item.romaji}</span>
          </div>

          <div className={styles.reviewRight}>
            {kanjiBackground ? (
              <div>
                <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
                  {item.word ? `${item.word}` : ''}
                </span>
                {item.word && (
                  <span
                    style={{
                      margin: '0 4px',
                      color: '#484848ff',
                      fontWeight: 'bold',
                    }}
                  >
                    ·
                  </span>
                )}
                <span className={styles.reviewWord}>{item.wordKana}</span>
              </div>
            ) : (
              <div>
                <span className={styles.reviewWord}>{item.wordKana}</span>
                <span className={styles.reviewWord}>
                  {` [${item.wordRomaji}]`}
                </span>
              </div>
            )}

            <span className={styles.reviewMeaning}>
              {getMeaning(item.meaning)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
