// src/pages/Dates/components/DateDetailPanel/index.tsx

import React, { useMemo } from 'react';
import styles from './DateDetailPanel.module.css';
import { getYearData } from '../../Levels/Level4/Level4Data';
import {
  getJapaneseHoliday,
  getRelativeLabel,
  toKanjiNum,
  getKanjiEraYear,
  getJapaneseWeekday,
} from '../../../../utils/dateHelper';
import { type NavMode } from '../../PageDates';
import {
  ChevronRight,
  Target,
  Calendar,
  Clock,
  Hash,
  Flag,
} from 'lucide-react';

interface Props {
  date: Date;
  onNavigate: (mode: NavMode) => void;
}

export const DateDetailPanel: React.FC<Props> = ({ date, onNavigate }) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 获取各种数据
  const yearData = useMemo(() => getYearData(year), [year]);
  const holiday = getJapaneseHoliday(date);
  const relative = getRelativeLabel(date);
  const weekday = getJapaneseWeekday(date); // 需要确保 dateHelpers 里有这个函数

  // 格式化展示文本
  const eraText = `${yearData.era.kanji}${getKanjiEraYear(yearData.eraYear)}`;
  const monthText = `${toKanjiNum(month)}月`; // 二月

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerLabel}>TARGET DATA // 选定情报</span>
        <div className={styles.divider} />
      </div>

      <div className={styles.list}>
        {/* 1. YEAR 区块 */}
        <div className={styles.item} onClick={() => onNavigate('year')}>
          <div className={styles.labelGroup}>
            <Clock size={14} className={styles.icon} />
            <span className={styles.label}>YEAR</span>
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.mainValue}>{eraText}</span>
            <span className={styles.subValue}>{year}</span>
          </div>
          <div className={styles.action}>
            <span className={styles.actionText}>INIT</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* 2. MONTH 区块 */}
        <div className={styles.item} onClick={() => onNavigate('month')}>
          <div className={styles.labelGroup}>
            <Calendar size={14} className={styles.icon} />
            <span className={styles.label}>MONTH</span>
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.mainValue}>{monthText}</span>
            <span className={styles.subValue}>{month}月</span>
          </div>
          <div className={styles.action}>
            <span className={styles.actionText}>INIT</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* 3. DAY 区块 */}
        <div className={styles.item} onClick={() => onNavigate('day')}>
          <div className={styles.labelGroup}>
            <Hash size={14} className={styles.icon} />
            <span className={styles.label}>DAY</span>
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.mainValue}>{day}日</span>
            <span className={styles.subValue}>Date</span>
          </div>
          <div className={styles.action}>
            <span className={styles.actionText}>INIT</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* 4. WEEK 区块 */}
        <div className={styles.item} onClick={() => onNavigate('week')}>
          <div className={styles.labelGroup}>
            <Target size={14} className={styles.icon} />
            <span className={styles.label}>WEEK</span>
          </div>
          <div className={styles.valueGroup}>
            <span className={styles.mainValue}>{weekday}</span>
          </div>
          <div className={styles.action}>
            <span className={styles.actionText}>INIT</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* 5. 动态区块：相对时间 (今天/明天) */}
        {relative && (
          <div
            className={`${styles.item} ${styles.itemHighlight}`}
            onClick={() => onNavigate('relative')}
          >
            <div className={styles.labelGroup}>
              <div className={styles.statusDot} />
              <span className={styles.label}>REL</span>
            </div>
            <div className={styles.valueGroup}>
              <span className={styles.mainValue}>{relative}</span>
              <span className={styles.subValue}>Relative Time</span>
            </div>
            <div className={styles.action}>
              <span className={styles.actionText}>VIEW</span>
              <ChevronRight size={14} />
            </div>
          </div>
        )}

        {/* 6. 动态区块：节日 */}
        {holiday && (
          <div
            className={`${styles.item} ${styles.itemDanger}`}
            onClick={() => onNavigate('holiday')}
          >
            <div className={styles.labelGroup}>
              <Flag size={14} className={styles.icon} />
              <span className={styles.label}>EVENT</span>
            </div>
            <div className={styles.valueGroup}>
              <span className={styles.mainValue}>{holiday}</span>
              <span className={styles.subValue}>Holiday</span>
            </div>
            <div className={styles.action}>
              <span className={styles.actionText}>VIEW</span>
              <ChevronRight size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
