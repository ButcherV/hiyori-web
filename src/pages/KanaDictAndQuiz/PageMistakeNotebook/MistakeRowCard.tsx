import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
import { useSettings } from '../../../context/SettingsContext';
import styles from './MistakeRowCard.module.css';
import commonStyles from '../../TestStudySession/TestStudySession.module.css';

export interface MistakeItem {
  id: string;
  char: string;
  romaji: string;
  mistakeCount: number;
  streak: number;
  word?: string;
  wordKana?: string;
  wordRomaji?: string;
  meaning?: any;
  kind: string;
}

interface Props {
  items: MistakeItem[];
  onBadgeClick?: () => void;
  onPlaySound: (text: string) => void;
}

export const MistakeRowCard: React.FC<Props> = ({
  items,
  onPlaySound,
  onBadgeClick,
}) => {
  const { i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  const getMeaning = (m: any) => {
    if (!m) return '';
    const lang = i18n.language;
    if (lang === 'zh-Hant') return m.zhHant;
    if (lang.startsWith('zh')) return m.zh;
    return m.en;
  };

  const handlePlay = (item: MistakeItem) => {
    const text = item.word || item.wordKana || item.char;
    onPlaySound(text);
  };

  const handleBadgeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 关键！阻止冒泡，防止触发 handlePlay (播放声音)
    if (onBadgeClick) {
      onBadgeClick();
    }
  };

  // 计算 Badge 显示逻辑的辅助函数
  const getBadgeConfig = (count: number) => {
    if (count >= 100) {
      // 爆表：显示 99+，用最小字体
      return { text: '99+', className: styles.badgeMax };
    }
    if (count >= 10) {
      // 两位数：显示原数字，用中等字体
      return { text: count, className: styles.badgeDouble };
    }
    // 个位数：显示原数字，用最大字体
    return { text: count, className: styles.badgeSingle };
  };

  const renderWordInfo = (item: MistakeItem) => {
    if (!item.word) {
      return <span className={styles.emptyWord}>-</span>;
    }
    if (
      ['h-seion', 'h-dakuon', 'h-yoon'].includes(item.kind) &&
      kanjiBackground
    ) {
      return (
        <div className={styles.wordContent}>
          <span className={`${styles.wordReading} ${commonStyles.jaFont}`}>
            {item.wordKana}
          </span>
          <div className={styles.wordRow}>
            <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
              {item.word}
            </span>
          </div>
          <span className={styles.reviewMeaning}>
            {getMeaning(item.meaning)}
          </span>
        </div>
      );
    }
    return (
      <div className={styles.wordContent}>
        {item.wordRomaji && (
          <span className={styles.wordReading}>{item.wordRomaji}</span>
        )}
        <div className={styles.wordRow}>
          {item.wordKana ? (
            <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
              {item.wordKana}
            </span>
          ) : (
            <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
              {item.word}
            </span>
          )}
        </div>
        <span className={styles.reviewMeaning}>{getMeaning(item.meaning)}</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {items.map((item) => {
        const { text, className } = getBadgeConfig(item.mistakeCount);

        const isKatakana = item.id.startsWith('k-');
        const typeClass = isKatakana ? styles.katakana : '';

        return (
          <div
            key={item.id}
            className={styles.reviewRow}
            onClick={() => handlePlay(item)}
          >
            {/* 左侧：假名主体 */}
            <div className={`${styles.kanaBox} ${typeClass}`}>
              <span
                className={`${styles.reviewChar} ${commonStyles.jaFont} ${typeClass}`}
              >
                {item.char}
              </span>

              <span className={`${styles.reviewRomaji} ${typeClass}`}>
                {item.romaji}
              </span>

              <div className={styles.badgeContainer} onClick={handleBadgeClick}>
                {item.streak > 0 && <div className={styles.progressRing} />}

                <div className={`${styles.mistakeBadge} ${className}`}>
                  {text}
                </div>
              </div>
            </div>

            <div className={styles.wordInfo}>{renderWordInfo(item)}</div>

            <div className={styles.soundIcon}>
              <Volume2 size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
