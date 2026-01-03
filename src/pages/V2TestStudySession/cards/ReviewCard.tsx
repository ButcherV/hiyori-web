import React from 'react';
import type { ReviewItem } from '../lessonLogic';
import styles from '../TestStudySession.module.css'; // ✅ 向上引用样式

interface Props {
  items: ReviewItem[];
  settings: {
    kanjiBackground: boolean;
    language: 'zh' | 'en' | 'zhHant';
  };
  onPlaySound: (char: string) => void;
}

export const ReviewCard: React.FC<Props> = ({
  items,
  settings,
  onPlaySound,
}) => {
  const getMeaning = (m: any) => {
    if (!m) return '';
    return m[settings.language] || m.en;
  };

  return (
    <div className={styles.reviewListContainer}>
      {items.map((item, idx) => (
        <div
          key={`${item.char}-${idx}`}
          className={styles.reviewRow}
          onClick={(e) => {
            e.stopPropagation();
            onPlaySound(item.char);
          }}
        >
          <div className={styles.reviewLeft}>
            <span className={styles.reviewChar}>{item.char}</span>
            <span className={styles.reviewRomaji}>{item.romaji}</span>
          </div>

          <div className={styles.reviewRight}>
            {settings.kanjiBackground ? (
              <span className={styles.reviewWord}>
                {item.word ? `${item.word}` : ''}
              </span>
            ) : (
              <span className={styles.reviewWord}>{item.wordRomaji}</span>
            )}

            <span className={styles.reviewMeaning}>
              {getMeaning(item.meaning)}
            </span>
          </div>
        </div>
      ))}

      {/* 底部提示文字 */}
      <div className={styles.swipeHint}>Swipe right to start quiz</div>
    </div>
  );
};
