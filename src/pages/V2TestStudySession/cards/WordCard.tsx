import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../kanaData';

import styles from './WordCard.module.css';
import commonStyles from '../TestStudySession.module.css';

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const WordCard: React.FC<Props> = ({ data, onPlaySound }) => {
  if (!data.word) return null;

  const { i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound(data.kana);
  };

  let targetKey: 'zh' | 'zhHant' | 'en' = 'en';

  if (i18n.language === 'zh-Hant') {
    targetKey = 'zhHant';
  } else if (i18n.language.startsWith('zh')) {
    targetKey = 'zh';
  }

  const meaningText = data.wordMeaning
    ? data.wordMeaning[targetKey] || data.wordMeaning.en
    : '';

  if (data.kind === 'h-seion') {
    const renderMainContent = () => {
      // 场景 A: 汉字背景开启
      if (kanjiBackground) {
        return (
          <>
            <div className={`${styles.furigana} ${commonStyles.jaFont}`}>
              {data.wordKana}
            </div>
            <div className={`${styles.kanjiMain} ${commonStyles.jaFont}`}>
              {data.word}
            </div>
          </>
        );
      }

      // 场景 B: 汉字背景关闭
      // B1. Emoji
      if (data.wordEmoji) {
        return (
          <>
            <div className={`${styles.furigana} ${commonStyles.jaFont}`}>
              {data.wordKana}
            </div>
            <div className={styles.emoji}>{data.wordEmoji}</div>
          </>
        );
      }

      // B2. 纯假名
      return (
        <div className={`${styles.kanjiMain} ${commonStyles.jaFont}`}>
          {data.wordKana}
        </div>
      );
    };

    return (
      <div className={styles.container}>
        {renderMainContent()}
        <div className={styles.romajiBottom}>{data.wordRomaji}</div>
        <div className={styles.meaningText}>{meaningText}</div>
        <div className={commonStyles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  if (data.kind === 'k-seion') {
    const renderMainContent = () => {
      return (
        <>
          <div className={`${styles.furigana} ${commonStyles.jaFont}`}>
            {data.wordKana}
          </div>
          <div className={`${styles.kanjiMain} ${commonStyles.jaFont}`}>
            {data.word}
          </div>
          {data.wordEmoji && (
            <div className={styles.emoji}>{data.wordEmoji}</div>
          )}
        </>
      );
    };

    return (
      <div className={styles.container}>
        {renderMainContent()}
        <div className={styles.romajiBottom}>{data.wordRomaji}</div>
        <div className={styles.meaningText}>{meaningText}</div>
        <div className={commonStyles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  return null;
};
