import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../kanaData';
import type { WordOrigin } from '../kanaData/core';
import styles from './WordCard.module.css';
import commonStyles from '../TestStudySession.module.css';

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const WordCard: React.FC<Props> = ({ data, onPlaySound }) => {
  if (!data.word) return null;
  console.log('data', data);
  const { i18n, t } = useTranslation();
  const { kanjiBackground } = useSettings();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound(data.word!);
  };

  const getOriginBadge = (origin: WordOrigin) => {
    switch (origin.lang) {
      case 'en-US':
        return { icon: '🇺🇸', label: 'English(US)' };
      case 'en-GB':
        return { icon: '🇬🇧', label: 'English(UK)' };
      case 'de':
        return { icon: '🇩🇪', label: 'German' };
      case 'fr':
        return { icon: '🇫🇷', label: 'French' };
      case 'pt':
        return { icon: '🇵🇹', label: 'Portuguese' };
      case 'nl':
        return { icon: '🇳🇱', label: 'Dutch' };
      case 'sv':
        return { icon: '🇸🇪', label: 'Sweden' };
      case 'ja':
        return { icon: '🇯🇵', label: 'Japan Origin' };

      default:
        return null;
    }
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

  if (
    data.kind === 'h-seion' ||
    data.kind === 'h-dakuon' ||
    data.kind === 'h-yoon'
  ) {
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

      // // B2. 纯假名
      // return (
      //   <div className={`${styles.kanjiMain} ${commonStyles.jaFont}`}>
      //     {data.wordKana}
      //   </div>
      // );
    };

    return (
      <div className={styles.container}>
        <div className={styles.romajiBottom}>{data.wordRomaji}</div>
        {renderMainContent()}
        <div className={styles.meaningText}>{meaningText}</div>
        {data.wordNoteKey && (
          <div className={commonStyles.cardNoteLabel}>
            <Lightbulb size={14} className={commonStyles.noteIcon} />
            <span>{t(data.wordNoteKey)}</span>
          </div>
        )}
        <div className={commonStyles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  if (data.kind === 'k-seion') {
    const badge = data.wordOrigin ? getOriginBadge(data.wordOrigin) : null;
    const renderMainContent = () => {
      return (
        <>
          {data.wordOrigin && (
            <div className={styles.originTag}>
              <span className={styles.originLabel}>
                {t('borrowedWords.origin')}
              </span>
              <div className={styles.divider} />
              <div className={styles.originContent}>
                {badge && <span className={styles.flag}>{badge.icon}</span>}
                <span className={styles.originWord}>
                  {data.wordOrigin.word}
                </span>
              </div>
            </div>
          )}
          <div className={`${styles.kanjiMainSmall} ${commonStyles.jaFont}`}>
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
        <div className={styles.romajiBottom}>{data.wordRomaji}</div>
        {renderMainContent()}
        <div className={styles.meaningText}>{meaningText}</div>
        {data.wordNoteKey && (
          <div className={commonStyles.cardNoteLabel}>
            <Lightbulb size={14} className={commonStyles.noteIcon} />
            <span>{t(data.wordNoteKey)}</span>
          </div>
        )}
        <div className={commonStyles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  return null;
};
