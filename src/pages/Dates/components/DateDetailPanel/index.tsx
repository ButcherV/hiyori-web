// src/pages/Dates/components/DateDetailPanel/index.tsx

import React, { useMemo } from 'react';
import styles from './DateDetailPanel.module.css';
import { getYearData } from '../../Levels/Level4/Level4Data';
import { datesData } from '../../Levels/Level1/Level1Data';
import {
  getJapaneseHoliday,
  getRelativeLabel,
  toKanjiNum,
  getKanjiEraYear,
  getJapaneseWeekday,
  getWafuMonth,
} from '../../../../utils/dateHelper';
import { type NavMode } from '../../PageDates';
import { useTTS } from '../../../../hooks/useTTS';
import { ChevronRight, Volume2 } from 'lucide-react';

interface CardConfig {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  action: string;
  mode: NavMode;
  theme?: 'neutral' | 'blue' | 'red' | 'cyan';
}

export const DateDetailPanel: React.FC<{
  date: Date;
  onNavigate: (m: NavMode) => void;
}> = ({ date, onNavigate }) => {
  const { speak } = useTTS();
  const yearData = useMemo(() => getYearData(date.getFullYear()), [date]);
  const holiday = getJapaneseHoliday(date);
  const relative = getRelativeLabel(date);
  const dayOfWeek = date.getDay();

  // 1. 构建动态卡片列表 (严格排序：变动的在前，稳固在后)
  const cards: CardConfig[] = useMemo(() => {
    const list: CardConfig[] = [];

    // [1] 日 (Day)
    const dayItem = datesData.find((d) => d.id === date.getDate());
    list.push({
      id: 'day',
      kanji: `${date.getDate()}`,
      kana: dayItem?.kana || '',
      romaji: dayItem?.romaji || '',
      action: '学习所有日子',
      mode: 'day',
    });

    // [2] 相对时间 (Relative) - 动态
    if (relative) {
      list.push({
        id: 'rel',
        kanji: relative,
        kana: relative === '今日' ? 'きょう' : '...',
        romaji: 'relative',
        action: '学习相对时间',
        mode: 'relative',
        theme: 'cyan',
      });
    }

    // [3] 节假日 (Holiday) - 动态
    if (holiday) {
      list.push({
        id: 'hol',
        kanji: holiday,
        kana: 'しゅくじつ',
        romaji: 'holiday',
        action: '学习节假日',
        mode: 'holiday',
        theme: 'red',
      });
    }

    // [4] 月份 (Month)
    list.push({
      id: 'month',
      kanji: `${toKanjiNum(date.getMonth() + 1)}月`,
      kana: getWafuMonth(date.getMonth()),
      romaji: 'Month',
      action: '学习所有月份',
      mode: 'month',
    });

    // [5] 星期 (Weekday)
    list.push({
      id: 'week',
      kanji: getJapaneseWeekday(date),
      kana: 'ようび',
      romaji: 'Weekday',
      action: '学习所有星期',
      mode: 'week',
      theme:
        dayOfWeek === 0 || holiday
          ? 'red'
          : dayOfWeek === 6
            ? 'blue'
            : 'neutral',
    });

    // [6] 年号 (Era)
    list.push({
      id: 'era',
      kanji: yearData.era.kanji,
      kana: yearData.era.romaji,
      romaji: 'Era',
      action: '学习所有年号',
      mode: 'year',
    });

    // [7] 公历年 (Year) - 永远垫底
    list.push({
      id: 'year',
      kanji: `${yearData.year}年`,
      kana: `${yearData.eraYear}年`,
      romaji: 'Western Year',
      action: '学习所有年号',
      mode: 'year',
    });

    return list;
  }, [date, yearData, holiday, relative, dayOfWeek]);

  return (
    <div className={styles.panel}>
      <div className={styles.gridContainer}>
        {cards.map((card, index) => {
          // 🟢 动态布局计算：如果总数是奇数，且当前是最后一个卡片，则变为横向长卡
          const isLast = index === cards.length - 1;
          const isWide = cards.length % 2 !== 0 && isLast;

          return (
            <div
              key={card.id}
              className={`${styles.bentoCard} ${isWide ? styles.spanCol2 : ''}`}
              data-theme={card.theme || 'neutral'}
              onClick={() => speak(card.kana || card.kanji)}
            >
              <div className={styles.cardTop}>
                <Volume2 size={14} className={styles.speakerHint} />
              </div>

              <div className={styles.cardMain}>
                <div className={styles.kanji}>{card.kanji}</div>
                <div className={styles.kana}>{card.kana}</div>
                <div className={styles.romaji}>{card.romaji}</div>
              </div>

              {/* 底部导航区：点击跳转 */}
              <div
                className={styles.actionArea}
                onClick={(e) => {
                  e.stopPropagation(); // 防止触发发音
                  onNavigate(card.mode);
                }}
              >
                <span className={styles.actionLabel}>{card.action}</span>
                <ChevronRight size={12} className={styles.arrowIcon} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
