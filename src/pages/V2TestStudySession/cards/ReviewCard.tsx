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
      {items.map((item, idx) => {
        // 🔥🔥🔥 核心修改：在这里做判断 🔥🔥🔥

        // =================================================
        // 🟢 情况 1: 平假名清音 (Hiragana Seion)
        // =================================================
        if (item.kind === 'h-seion') {
          return (
            <div key={`${item.char}-${idx}`} className={styles.reviewRow}>
              {/* 左侧 */}
              <div className={styles.reviewLeft}>
                <span className={`${styles.reviewChar} ${commonStyles.jaFont}`}>
                  {item.char}
                </span>
                <span className={styles.reviewRomaji}>{item.romaji}</span>
              </div>

              {/* 右侧 */}
              {/* 有的假名没法组词，比如 "を” */}
              {item.word && (
                <div className={styles.reviewRight}>
                  {kanjiBackground ? (
                    // 有汉字背景：汉字 [读音的平假名]
                    <div>
                      <span
                        className={`${styles.reviewWord} ${commonStyles.jaFont}`}
                      >
                        {item.word ? `${item.word}` : ''}
                      </span>
                      {/* {item.word && (
                      <span
                        style={{
                          margin: '0 4px',
                          color: '#484848',
                          fontWeight: 'bold',
                        }}
                      >
                        ·
                      </span>
                    )} */}
                      <span
                        className={`${styles.reviewWord} ${commonStyles.jaFont}`}
                      >
                        {` [${item.wordKana}]`}
                      </span>
                    </div>
                  ) : (
                    // 无汉字背景：平假名 [罗马音]
                    <div>
                      <span
                        className={`${styles.reviewWord} ${commonStyles.jaFont}`}
                      >
                        {item.wordKana}
                      </span>
                      {item.wordRomaji && (
                        <span className={styles.reviewWord}>
                          {` [${item.wordRomaji}]`}
                        </span>
                      )}
                    </div>
                  )}
                  <span className={styles.reviewMeaning}>
                    {getMeaning(item.meaning)}
                  </span>
                </div>
              )}
            </div>
          );
        }

        // =================================================
        // 🔵 情况 2: 片假名清音 (Katakana Seion)
        // =================================================
        if (item.kind === 'k-seion') {
          return (
            <div key={`${item.char}-${idx}`} className={styles.reviewRow}>
              <div className={styles.reviewLeft}>
                <span className={`${styles.reviewChar} ${commonStyles.jaFont}`}>
                  {item.char}
                </span>
                <span className={styles.reviewRomaji}>{item.romaji}</span>
              </div>

              {/* 右侧 */}
              <div className={styles.reviewRight}>
                {/* 
                    罗马音
                    片假名单词
                    翻译
                */}
                {item.wordRomaji && (
                  <span className={styles.reviewMeaning}>
                    {item.wordRomaji}
                  </span>
                )}
                <span className={styles.reviewWord}>{item.word}</span>
                <span className={styles.reviewMeaning}>
                  {getMeaning(item.meaning)}
                </span>
              </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};
