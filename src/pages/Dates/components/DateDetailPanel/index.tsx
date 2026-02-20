// src/pages/Dates/components/DateDetailPanel/index.tsx

import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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

import { getHolidayMeta, getCustomHolidayName, getHolidayItem } from '../../Datas/holidayData';

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
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const yearData = useMemo(() => getYearData(date.getFullYear()), [date]);
  const holidayName = getJapaneseHoliday(date) ?? getCustomHolidayName(date);
  const relative = getRelativeLabel(date);
  const dayOfWeek = date.getDay();

  const cards: CardConfig[] = useMemo(() => {
    const list: CardConfig[] = [];

    // [1] 日 (Day)
    const dayItem = datesData.find((d) => d.id === date.getDate());
    list.push({
      id: 'day',
      kanji: dayItem?.kanji || `${toKanjiNum(date.getDate())}日`,
      kana: dayItem?.kana || '',
      romaji: dayItem?.romaji || '',
      translation: t('date_study.bento.day_label', { day: date.getDate() }),
      action: t('date_study.bento.action_day'),
      mode: 'day',
    });

    // [2] 相对时间 (Relative)
    if (relative) {
      const relData = RELATIVE_MAP[relative] || {
        kana: '...',
        romaji: '...',
        en: 'Relative Time',
        zh: '相对时间',
      };
      list.push({
        id: 'rel',
        kanji: relative,
        kana: relData.kana,
        romaji: relData.romaji,
        translation: relData[locale],
        action: t('date_study.bento.action_relative'),
        mode: 'relative',
        theme: 'cyan',
      });
    }

    // [3] 节假日 (Holiday)
    if (holidayName) {
      const holidayItem = getHolidayItem(holidayName);
      const holidayInfo = getHolidayMeta(holidayName);

      list.push({
        id: 'hol',
        kanji: holidayName,
        kana: holidayItem?.kana || holidayInfo.kana,
        romaji: holidayItem?.romaji || holidayInfo.romaji,
        translation: holidayInfo[locale],
        action: t('date_study.bento.action_holiday'),
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
      translation: monthInfo[locale],
      action: t('date_study.bento.action_month'),
      mode: 'month',
    });

    // [5] 星期 (Weekday)
    const weekInfo = WEEKDAY_DATA[dayOfWeek];
    list.push({
      id: 'week',
      kanji: getJapaneseWeekday(date),
      kana: weekInfo.kana,
      romaji: weekInfo.romaji,
      translation: weekInfo[locale],
      action: t('date_study.bento.action_week'),
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
      romaji: eraInfo?.romaji || yearData.era.romaji.toLowerCase(),
      translation: t('date_study.bento.era_label'),
      action: t('date_study.bento.action_era'),
      mode: 'year',
    });

    // [7] 西历 (Western Year)
    const westernReading = getWesternYearReading(yearData.year);
    list.push({
      id: 'year',
      kanji: `${toKanjiNum(yearData.year)}年`,
      kana: westernReading.kana,
      romaji: westernReading.romaji,
      translation: t('date_study.bento.year_label', { year: yearData.year }),
      action: t('date_study.bento.action_year'),
      mode: 'year',
    });

    return list;
  }, [date, yearData, holidayName, relative, dayOfWeek, t, locale]);

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
