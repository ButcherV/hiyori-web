// src/pages/Dates/Datas/RelativeTimeData.ts

export type Granularity = 'day' | 'week' | 'month' | 'year';

export interface RelativeTimeItem {
  granularity: Granularity;
  offset: number; // -2 to +2
  kanji: string;
  kana: string;
  romaji: string;
  meaning: { zh: string; en: string };
  altKanji?: string;
  altKana?: string;
  altRomaji?: string;
  trap?: boolean;
  note?: { zh: string; en: string };
}

export const RELATIVE_TIME_DATA: RelativeTimeItem[] = [
  // ── 日 ──────────────────────────────────────────────────────────────────
  {
    granularity: 'day', offset: -2,
    kanji: '一昨日', kana: 'おととい', romaji: 'o·to·to·i',
    meaning: { zh: '前天', en: 'Day before yesterday' },
    trap: true,
    note: {
      zh: '完全不规则读音，须直接记忆。正式书面语读いっさくじつ。',
      en: 'Completely irregular — must be memorized. Formal written: いっさくじつ.',
    },
  },
  {
    granularity: 'day', offset: -1,
    kanji: '昨日', kana: 'きのう', romaji: 'ki·no·u',
    meaning: { zh: '昨天', en: 'Yesterday' },
    altKana: 'さくじつ', altRomaji: 'sa·ku·ji·tsu',
    note: {
      zh: '口语读きのう；さくじつ为正式书面用语。',
      en: 'Spoken: きのう. Formal/written: さくじつ.',
    },
  },
  {
    granularity: 'day', offset: 0,
    kanji: '今日', kana: 'きょう', romaji: 'kyo·u',
    meaning: { zh: '今天', en: 'Today' },
    altKana: 'こんにち', altRomaji: 'ko·n·ni·chi',
    note: {
      zh: '日常读きょう；こんにち多见于复合词，如こんにちは。',
      en: 'Everyday: きょう. こんにち appears in compounds, e.g. こんにちは.',
    },
  },
  {
    granularity: 'day', offset: 1,
    kanji: '明日', kana: 'あした', romaji: 'a·shi·ta',
    meaning: { zh: '明天', en: 'Tomorrow' },
    altKana: 'あす', altRomaji: 'a·su',
    note: {
      zh: 'あした是口语；あす较为正式，多见于新闻与文学。',
      en: 'あした is colloquial; あす is formal, used in news and writing.',
    },
  },
  {
    granularity: 'day', offset: 2,
    kanji: '明後日', kana: 'あさって', romaji: 'a·sa·t·te',
    meaning: { zh: '后天', en: 'Day after tomorrow' },
    trap: true,
    note: {
      zh: '不规则读音，无法从汉字推导，须直接记忆。',
      en: 'Irregular — cannot be derived from the kanji. Must be memorized.',
    },
  },

  // ── 週 ──────────────────────────────────────────────────────────────────
  { granularity: 'week', offset: -2, kanji: '先々週', kana: 'せんせんしゅう', romaji: 'se·n·se·n·shu·u', meaning: { zh: '上上周', en: 'Two weeks ago' } },
  { granularity: 'week', offset: -1, kanji: '先週',   kana: 'せんしゅう',     romaji: 'se·n·shu·u',     meaning: { zh: '上周',   en: 'Last week' } },
  { granularity: 'week', offset:  0, kanji: '今週',   kana: 'こんしゅう',     romaji: 'ko·n·shu·u',     meaning: { zh: '本周',   en: 'This week' } },
  { granularity: 'week', offset:  1, kanji: '来週',   kana: 'らいしゅう',     romaji: 'ra·i·shu·u',     meaning: { zh: '下周',   en: 'Next week' } },
  { granularity: 'week', offset:  2, kanji: '再来週', kana: 'さらいしゅう',   romaji: 'sa·ra·i·shu·u',  meaning: { zh: '下下周', en: 'In two weeks' } },

  // ── 月 ──────────────────────────────────────────────────────────────────
  { granularity: 'month', offset: -2, kanji: '先々月', kana: 'せんせんげつ', romaji: 'se·n·se·n·ge·tsu', meaning: { zh: '上上个月', en: 'Two months ago' } },
  { granularity: 'month', offset: -1, kanji: '先月',   kana: 'せんげつ',     romaji: 'se·n·ge·tsu',     meaning: { zh: '上个月',   en: 'Last month' } },
  { granularity: 'month', offset:  0, kanji: '今月',   kana: 'こんげつ',     romaji: 'ko·n·ge·tsu',     meaning: { zh: '本月',     en: 'This month' } },
  { granularity: 'month', offset:  1, kanji: '来月',   kana: 'らいげつ',     romaji: 'ra·i·ge·tsu',     meaning: { zh: '下个月',   en: 'Next month' } },
  { granularity: 'month', offset:  2, kanji: '再来月', kana: 'さらいげつ',   romaji: 'sa·ra·i·ge·tsu',  meaning: { zh: '下下个月', en: 'In two months' } },

  // ── 年 ──────────────────────────────────────────────────────────────────
  {
    granularity: 'year', offset: -2,
    kanji: '一昨年', kana: 'おととし', romaji: 'o·to·to·shi',
    meaning: { zh: '前年', en: 'Two years ago' },
    trap: true,
    note: {
      zh: '完全不规则读音，须直接记忆。正式书面语读いっさくねん。',
      en: 'Completely irregular — must be memorized. Formal written: いっさくねん.',
    },
  },
  {
    granularity: 'year', offset: -1,
    kanji: '去年', kana: 'きょねん', romaji: 'kyo·nen',
    meaning: { zh: '去年', en: 'Last year' },
    altKanji: '昨年', altKana: 'さくねん', altRomaji: 'sa·ku·nen',
    note: {
      zh: '口语常用去年きょねん；昨年さくねん为正式书面用语。',
      en: 'Spoken: 去年 きょねん. Formal/written: 昨年 さくねん.',
    },
  },
  {
    granularity: 'year', offset: 0,
    kanji: '今年', kana: 'ことし', romaji: 'ko·to·shi',
    meaning: { zh: '今年', en: 'This year' },
    trap: true,
    note: {
      zh: '读ことし，不读こんねん。こんねん是错误读法。',
      en: 'Read as ことし, not こんねん. こんねん is incorrect.',
    },
  },
  { granularity: 'year', offset: 1, kanji: '来年',   kana: 'らいねん',   romaji: 'ra·i·nen',   meaning: { zh: '明年', en: 'Next year' } },
  { granularity: 'year', offset: 2, kanji: '再来年', kana: 'さらいねん', romaji: 'sa·ra·i·nen', meaning: { zh: '后年', en: 'In two years' } },
];

export const getRelativeItem = (granularity: Granularity, offset: number) =>
  RELATIVE_TIME_DATA.find((i) => i.granularity === granularity && i.offset === offset);

// ── Date label utilities ─────────────────────────────────────────────────

const fmtMD = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

export const getDateLabel = (granularity: Granularity, offset: number): string => {
  const today = new Date();

  if (granularity === 'day') {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return fmtMD(d);
  }

  if (granularity === 'week') {
    const dow = today.getDay();
    const toMon = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + toMon + offset * 7);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    if (mon.getMonth() === sun.getMonth()) {
      return `${mon.getMonth() + 1}/${mon.getDate()}〜${sun.getDate()}`;
    }
    return `${fmtMD(mon)}〜${fmtMD(sun)}`;
  }

  if (granularity === 'month') {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return `${d.getFullYear()}/${d.getMonth() + 1}`;
  }

  // year
  return String(today.getFullYear() + offset);
};
