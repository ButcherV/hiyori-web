import React from 'react';
import type { ReviewItem } from '../lessonLogic';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';

import styles from './ReviewCard.module.css';
import commonStyles from '../TestStudySession.module.css';
import { Volume2 } from 'lucide-react';

interface Props {
  items: ReviewItem[];
  onPlaySound: (char: string) => void;
}

export const ReviewCard: React.FC<Props> = ({ items, onPlaySound }) => {
  const { i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  const getMeaning = (m: any) => {
    if (!m) return '';
    const lang = i18n.language;
    if (lang === 'zh-Hant') return m.zhHant;
    if (lang.startsWith('zh')) return m.zh;
    return m.en;
  };

  const handlePlayClick = (item: ReviewItem) => {
    const text = item.word || item.wordKana || item.char;
    onPlaySound(text);
  };

  const renderWordInfo = (item: ReviewItem) => {
    // 如果没有单词，显示占位符或空白
    if (!item.word) {
      return <span className={styles.emptyWord}>-</span>;
    }

    // 汉字背景模式 (显示假名注音、汉字、 意义)
    // 又是平假名
    if (
      ['h-seion', 'h-dakuon', 'h-yoon'].includes(item.kind) &&
      kanjiBackground
    ) {
      return (
        <>
          <span className={`${styles.wordReading} ${commonStyles.jaFont}`}>
            {item.wordKana}
          </span>
          <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
            {item.word}
          </span>
          <span className={styles.reviewMeaning}>
            {getMeaning(item.meaning)}
          </span>
        </>
      );
    }

    // 无汉字背景模式
    // 平假名相关, word 是汉字： 显示罗马音 + 假名 + 意义
    // 片假名相关，没有 wordKana, word 本身就是平假名： 显示罗马音 + 假名（单词本身）+ 意义
    return (
      <>
        {item.wordRomaji && (
          <span className={styles.wordReading}>{item.wordRomaji}</span>
        )}
        {item.wordKana && (
          <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
            {item.wordKana}
          </span>
        )}
        {['k-seion', 'k-dakuon', 'k-yoon'].includes(item.kind) && (
          <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
            {item.word}
          </span>
        )}
        <span className={styles.reviewMeaning}>{getMeaning(item.meaning)}</span>
      </>
    );
  };

  return (
    <div className={styles.container}>
      {items.map((item, idx) => {
        // 过滤掉非 h-seion / k-seion 的情况 (防御性编程)
        // if (!['h-seion', 'k-seion'].includes(item.kind)) return null;

        return (
          <div
            key={`${item.char}-${idx}`}
            className={styles.reviewRow}
            // 点击整行也可以播放，体验更好，如果不想要可以删掉
            onClick={() => handlePlayClick(item)}
          >
            {/* 1. 左侧：假名胶囊 */}
            <div className={styles.kanaBox}>
              <span className={`${styles.reviewChar} ${commonStyles.jaFont}`}>
                {item.char}
              </span>
              <span className={styles.reviewRomaji}>{item.romaji}</span>
            </div>

            {/* 2. 中间：单词详情 (左对齐) */}
            <div className={styles.wordInfo}>{renderWordInfo(item)}</div>

            {/* 3. 右侧：喇叭按钮 */}
            <div
              className={`speakerBtn ${styles.soundBtn} ${item.word ? styles.active : ''}`}
              onClick={(e) => {
                e.stopPropagation(); // 防止冒泡触发整行点击
                handlePlayClick(item);
              }}
            >
              <Volume2 />
            </div>
          </div>
        );
      })}
    </div>
  );
};
