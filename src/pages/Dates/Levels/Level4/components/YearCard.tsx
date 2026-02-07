import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './YearCard.module.css';
import { type YearData } from '../Level4Data';

interface YearCardProps {
  data: YearData;
  onPrevEra: () => void;
  onNextEra: () => void;
}

export const YearCard: React.FC<YearCardProps> = ({
  data,
  onPrevEra,
  onNextEra,
}) => {
  return (
    <div className={styles.cardContainer}>
      {/* 顶部：年号切换器 */}
      <div className={styles.eraHeader} style={{ color: data.era.color }}>
        <button className={styles.navBtn} onClick={onPrevEra}>
          <ChevronLeft size={20} />
        </button>
        <div className={styles.eraTitle}>
          <span className={styles.eraRomaji}>{data.era.romaji}</span>
          <span className={styles.eraKanji}>{data.era.kanji}时代</span>
        </div>
        <button className={styles.navBtn} onClick={onNextEra}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 中间：核心数据展示 */}
      <div className={styles.mainContent}>
        {/* 左侧：天皇/时代占位符 (Avatar) */}
        <div
          className={styles.avatarPlaceholder}
          style={{ borderColor: data.era.color }}
        >
          <div className={styles.avatarText}>{data.era.kanji.charAt(0)}</div>
        </div>

        {/* 右侧：年份信息 */}
        <div className={styles.infoGroup}>
          <div className={styles.westernYear}>
            {data.year}
            <span className={styles.unit}>年</span>
          </div>

          <div
            className={styles.japaneseYear}
            style={{ background: data.era.color }}
          >
            {data.kanji}
          </div>

          <div className={styles.readings}>
            <div className={styles.romaji}>{data.romaji}</div>
          </div>

          {/* 特殊标签 (今年/陷阱) */}
          <div className={styles.tags}>
            {data.isTrap && <span className={styles.tagTrap}>注意读音</span>}
            {data.specialTag && (
              <span className={styles.tagSpecial}>{data.specialTag}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
