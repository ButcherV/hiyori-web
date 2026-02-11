// src/pages/Dates/components/DateDetailPanel/index.tsx

import React, { useMemo } from 'react';
import styles from './DateDetailPanel.module.css';
import { getYearData } from '../../Datas/YearData';
import { datesData } from '../../Datas/DayData';
import {
  getJapaneseHoliday,
  getRelativeLabel,
  toKanjiNum,
  getJapaneseWeekday,
  getWesternYearReading,
} from '../../../../utils/dateHelper';
import { type NavMode } from '../../PageDates';
import { useTTS } from '../../../../hooks/useTTS';
import { ChevronRight, Volume2 } from 'lucide-react';

import { getHolidayMeta } from '../../Datas/holidayData';

import {
  WEEKDAY_DATA,
  MONTH_DATA,
  ERA_DATA_MAP,
  RELATIVE_MAP,
} from '../../Datas/DateDetailData';

interface CardConfig {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  translation: string;
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
  const holidayName = getJapaneseHoliday(date);
  const relative = getRelativeLabel(date);
  const dayOfWeek = date.getDay();

  const cards: CardConfig[] = useMemo(() => {
    const list: CardConfig[] = [];

    // [1] 日 (Day)
    const dayItem = datesData.find((d) => d.id === date.getDate());
    list.push({
      id: 'day',
      // kanji: `${date.getDate()}日`,
      kanji: dayItem?.kanji || `${toKanjiNum(date.getDate())}日`,
      kana: dayItem?.kana || '',
      romaji: dayItem?.romaji || '', // 🟢 移除 toUpperCase，datesData 本身就是小写+点
      translation: `Day ${date.getDate()}`,
      action: '日期读写学习',
      mode: 'day',
    });

    // [2] 相对时间 (Relative)
    if (relative) {
      const relData = RELATIVE_MAP[relative] || {
        kana: '...',
        romaji: '...',
        en: 'Relative Time',
      };
      list.push({
        id: 'rel',
        kanji: relative,
        kana: relData.kana,
        romaji: relData.romaji,
        translation: relData.en,
        action: '学习相对时间',
        mode: 'relative',
        theme: 'cyan',
      });
    }

    // [3] 节假日 (Holiday)
    if (holidayName) {
      // 🟢 3. 数据层：用名字去查详细数据
      const holidayInfo = getHolidayMeta(holidayName);

      list.push({
        id: 'hol',
        kanji: holidayName, // 显示名字：元日
        kana: holidayInfo.kana, // 显示假名：がんじつ
        romaji: holidayInfo.romaji, // 显示罗马音：ga·n·ji·tsu
        translation: holidayInfo.en, // 显示英文：New Year's Day
        action: '节假日学习',
        mode: 'holiday',
        theme: 'red',
      });
    }

    // [4] 月份 (Month)
    const monthIdx = date.getMonth();
    const monthInfo = MONTH_DATA[monthIdx];
    list.push({
      id: 'month',
      kanji: `${toKanjiNum(monthIdx + 1)}月`,
      kana: monthInfo.kana,
      romaji: monthInfo.romaji,
      translation: monthInfo.en,
      action: '月份学习',
      mode: 'month',
    });

    // [5] 星期 (Weekday)
    const weekInfo = WEEKDAY_DATA[dayOfWeek];
    list.push({
      id: 'week',
      kanji: getJapaneseWeekday(date),
      kana: weekInfo.kana,
      romaji: weekInfo.romaji,
      translation: weekInfo.en,
      action: '星期学习',
      mode: 'week',
      theme:
        dayOfWeek === 0 || holidayName
          ? 'red'
          : dayOfWeek === 6
            ? 'blue'
            : 'neutral',
    });

    // [6] 年号 (Era)
    const eraKey = yearData.era.key;
    const eraInfo = ERA_DATA_MAP[eraKey];
    list.push({
      id: 'era',
      kanji: yearData.era.kanji,
      kana: eraInfo?.kana || yearData.era.romaji,
      romaji: eraInfo?.romaji || yearData.era.romaji.toLowerCase(), // 🟢 优先使用带点的字典数据
      translation: 'Japanese Era',
      action: '年号学习',
      mode: 'year',
    });

    // [7] 西历 (Western Year)
    const westernReading = getWesternYearReading(yearData.year);
    list.push({
      id: 'year',
      // 汉字：二〇二六年（跟中文一样，逐字写）
      kanji: `${toKanjiNum(yearData.year)}年`,
      // 发音：跟中文不一样，虽然逐字写，但还是按数字单位读（千、百、十）
      kana: westernReading.kana,
      romaji: westernReading.romaji,
      translation: `Year ${yearData.year}`,
      action: '年份学习',
      mode: 'year',
    });

    return list;
  }, [date, yearData, holidayName, relative, dayOfWeek]);

  // 智能字号计算
  const getFontSize = (text: string) => {
    const len = text.length;
    if (len >= 8) return '18px';
    if (len >= 6) return '20px';
    if (len >= 5) return '24px';
    return '28px';
  };

  return (
    <div className={styles.panel}>
      <div className={styles.gridContainer}>
        {cards.map((card, index) => {
          const isLast = index === cards.length - 1;
          const isWide = cards.length % 2 !== 0 && isLast;

          return (
            <div
              key={card.id}
              className={`${styles.bentoCard} ${isWide ? styles.spanCol2 : ''}`}
              data-theme={card.theme || 'neutral'}
              onClick={() => speak(card.kana || card.kanji)}
            >
              <Volume2 size={14} className={styles.speakerHint} />

              <div className={styles.cardContent}>
                <div className={styles.metaInfo}>
                  <div className={`${styles.romaji} jaFont`}>{card.romaji}</div>
                  <span className={`${styles.kana} jaFont`}>{card.kana}</span>
                </div>

                <div className={styles.mainInfo}>
                  <div
                    className={`${styles.kanji} jaFont`}
                    style={{ fontSize: getFontSize(card.kanji) }}
                  >
                    {card.kanji}
                  </div>
                  <div className={styles.translation}>{card.translation}</div>
                </div>
              </div>

              <div
                className={styles.actionArea}
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(card.mode);
                }}
              >
                <span className={styles.actionLabel}>{card.action}</span>
                <ChevronRight size={14} className={styles.arrowIcon} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
