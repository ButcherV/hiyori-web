import React from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2, Footprints } from 'lucide-react'; // 引入一个脚印或火焰图标表示进度
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

  const renderWordInfo = (item: MistakeItem) => {
    // ... (保持原有的 renderWordInfo 逻辑不变) ...
    // 为了节省篇幅，这里省略，直接复制原来的即可
    if (!item.word) {
      return <span className={styles.emptyWord}>-</span>;
    }
    if (
      ['h-seion', 'h-dakuon', 'h-yoon'].includes(item.kind) &&
      kanjiBackground
    ) {
      return (
        <div className={styles.wordContent}>
          <div className={styles.wordRow}>
            <span className={`${styles.reviewWord} ${commonStyles.jaFont}`}>
              {item.word}
            </span>
            <span className={`${styles.wordReading} ${commonStyles.jaFont}`}>
              {item.wordKana}
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
          {item.wordRomaji && (
            <span className={styles.wordReading}>{item.wordRomaji}</span>
          )}
        </div>
        <span className={styles.reviewMeaning}>{getMeaning(item.meaning)}</span>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <div
          key={item.id}
          className={styles.reviewRow}
          onClick={() => handlePlay(item)}
        >
          {/* 左侧：假名主体 */}
          <div className={styles.kanaBox}>
            <span className={`${styles.reviewChar} ${commonStyles.jaFont}`}>
              {item.char}
            </span>
            <span className={styles.reviewRomaji}>{item.romaji}</span>

            {/* 🔥 状态展示区 (进度环方案) */}
            <div className={styles.badgeContainer} onClick={handleBadgeClick}>
              {/* 如果 streak > 0，显示绿色的半圆环 */}
              {item.streak > 0 && <div className={styles.progressRing} />}

              {/* 核心 Badge：显示错误次数 */}
              <div className={styles.mistakeBadge}>{item.mistakeCount}</div>
            </div>
          </div>

          <div className={styles.wordInfo}>{renderWordInfo(item)}</div>

          <div className={styles.soundIcon}>
            <Volume2 size={20} />
          </div>
        </div>
      ))}
    </div>
  );
};
