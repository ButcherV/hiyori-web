import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../../../datas/kanaData';
import type { WordOrigin } from '../../../datas/kanaData/core';
import styles from './WordCard.module.css';
import commonStyles from '../TestStudySession.module.css';

/**
 * 根据字数返回对应的字体大小类名
 * @param text - 要显示的文本
 * @returns CSS 类名
 */
const getWordSizeClass = (text: string): string => {
  const length = text.length;
  
  if (length <= 3) {
    return styles.wordSizeXL; // 1-3字：超大
  } else if (length <= 5) {
    return styles.wordSizeLarge; // 4-5字：大
  } else if (length <= 7) {
    return styles.wordSizeMedium; // 6-7字：中
  } else if (length <= 10) {
    return styles.wordSizeSmall; // 8-10字：小
  } else {
    return styles.wordSizeXS; // 11字以上：超小
  }
};

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const WordCard: React.FC<Props> = ({ data, onPlaySound }) => {
  if (!data.word) return null;
  const { i18n, t } = useTranslation();
  const { kanjiBackground } = useSettings();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 平假名：播放 wordKana（假名读音）
    // 片假名：播放 word（本身就是假名）
    const textToPlay =
      data.kind === 'h-seion' || data.kind === 'h-dakuon' || data.kind === 'h-yoon'
        ? data.wordKana || data.word!
        : data.word!;
    onPlaySound(textToPlay);
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
      case 'ru':
        return { icon: '🇷🇺', label: 'Russia' };
      case 'it':
        return { icon: '🇮🇹', label: 'Italian' };
      case 'zh':
        return { icon: '🇨🇳', label: 'Chinese' };
      case 'ja':
        return { icon: '🇯🇵', label: 'Japan Origin' };
      case 'es':
        return { icon: '🇪🇸', label: 'Spanish' };
      case 'ko':
        return { icon: '🇰🇷', label: 'Korean' };
      case 'ko-KP':
        return { icon: '🇰🇵', label: 'North Korean' };
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

  // 1. 平假名情况
  if (
    data.kind === 'h-seion' ||
    data.kind === 'h-dakuon' ||
    data.kind === 'h-yoon'
  ) {
    const renderMainContent = () => {
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
      return (
        <>
          <div className={`${styles.furigana} ${commonStyles.jaFont}`}>
            {data.wordKana}
          </div>
          {!!data.wordEmoji && (
            <div className={styles.emoji}>{data.wordEmoji}</div>
          )}
        </>
      );

      return null;
    };

    return (
      <div className={styles.container}>
        {/* 1. 喇叭：直接使用全局定位类 */}
        <div className="speakerBtn" onClick={handlePlay}>
          <Volume2 />
        </div>

        {/* 2. 核心区 (居中) */}
        <div className={styles.mainZone}>
          <div className={styles.romajiBottom}>{data.wordRomaji}</div>
          {renderMainContent()}
          <div className={styles.meaningText}>{meaningText}</div>
        </div>

        {/* 3. 底部 Note (绝对定位沉底) */}
        <div className={styles.footerNote}>
          {data.wordNoteKey && (
            <div className="notePill">
              <Lightbulb size={14} className="noteIcon" />
              <span>{t(data.wordNoteKey)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. 片假名情况 (k-seion, k-dakuon, k-yoon)
  if (
    data.kind === 'k-seion' ||
    data.kind === 'k-dakuon' ||
    data.kind === 'k-yoon'
  ) {
    const badge = data.wordOrigin ? getOriginBadge(data.wordOrigin) : null;

    return (
      <div className={styles.container}>
        {/* 1. 喇叭 */}
        <div className="speakerBtn" onClick={handlePlay}>
          <Volume2 />
        </div>

        {/* 2. 核心区 */}
        <div className={styles.mainZone}>
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
          <div className={styles.romajiBottom}>{data.wordRomaji}</div>
          <div className={`${styles.kanjiMainSmall} ${getWordSizeClass(data.word)} ${commonStyles.jaFont}`}>
            {data.word}
          </div>
          {data.wordEmoji && (
            <div className={styles.emoji}>{data.wordEmoji}</div>
          )}
          <div className={styles.meaningText}>{meaningText}</div>
        </div>

        {/* 3. 底部 Note */}
        <div className={styles.footerNote}>
          {data.wordNoteKey && (
            <div className="notePill">
              <Lightbulb size={14} className="noteIcon" />
              <span>{t(data.wordNoteKey)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
