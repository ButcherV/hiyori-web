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

export type PointItem = Omit<RelativeTimeItem, 'granularity' | 'offset'>;

export const getRelativeItem = (granularity: Granularity, offset: number): PointItem | undefined =>
  RELATIVE_TIME_DATA.find((i) => i.granularity === granularity && i.offset === offset);

// ── Timeline node types ───────────────────────────────────────────────────

export interface TimelineNode {
  type: 'major' | 'minor';
  dayOffset: number;
  unitOffset?: number; // major unit offset (week/month/year offset)
  flex?: number;       // override CSS flex value (default: major=2, minor=1)
}

// ── Day reading tables ────────────────────────────────────────────────────

const DAY_READINGS: Record<number, { kana: string; romaji: string; irregular: boolean }> = {
  1:  { kana: 'いちにち',     romaji: 'i·chi·ni·chi',       irregular: false },
  2:  { kana: 'ふつか',       romaji: 'fu·tsu·ka',           irregular: true  },
  3:  { kana: 'みっか',       romaji: 'mi·k·ka',             irregular: true  },
  4:  { kana: 'よっか',       romaji: 'yo·k·ka',             irregular: true  },
  5:  { kana: 'いつか',       romaji: 'i·tsu·ka',            irregular: true  },
  6:  { kana: 'むいか',       romaji: 'mu·i·ka',             irregular: true  },
  7:  { kana: 'なのか',       romaji: 'na·no·ka',            irregular: true  },
  8:  { kana: 'ようか',       romaji: 'yo·u·ka',             irregular: true  },
  9:  { kana: 'ここのか',     romaji: 'ko·ko·no·ka',         irregular: true  },
  10: { kana: 'とおか',       romaji: 'to·o·ka',             irregular: true  },
  11: { kana: 'じゅういちにち', romaji: 'ju·u·i·chi·ni·chi', irregular: false },
  12: { kana: 'じゅうににち',   romaji: 'ju·u·ni·ni·chi',    irregular: false },
  13: { kana: 'じゅうさんにち', romaji: 'ju·u·sa·n·ni·chi',  irregular: false },
  14: { kana: 'じゅうよっか',   romaji: 'ju·u·yo·k·ka',      irregular: true  },
};

const DAY_KANJI: Record<number, string> = {
  1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
  6: '六', 7: '七', 8: '八', 9: '九', 10: '十',
  11: '十一', 12: '十二', 13: '十三', 14: '十四',
};

const WEEK_KANJI  = ['', '一', '二', '三', '四'];
const WEEK_KANA   = ['', 'いっ', 'に', 'さん', 'よん'];
const MONTH_KANJI = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
const MONTH_KANA  = ['', 'いっ', 'に', 'さん', 'よん', 'ご', 'ろっ', 'なな', 'はち', 'きゅう', 'じゅう', 'じゅういち', 'じゅうに'];

/** Build a PointItem for a minor timeline tick in any granularity. */
export function getMinorNodeItem(dayOffset: number, granularity: Granularity = 'week'): PointItem {
  const isPast = dayOffset < 0;
  const dirKana   = isPast ? 'まえ' : 'ご';
  const dirRomaji = isPast ? '·ma·e' : '·go';
  const dirKanji  = isPast ? '前' : '後';

  if (granularity === 'week') {
    const n = Math.abs(dayOffset);
    const r = DAY_READINGS[n] ?? { kana: `${n}にち`, romaji: `${n}·ni·chi`, irregular: false };
    const kj = DAY_KANJI[n] ?? String(n);
    return {
      kanji: `${kj}日${dirKanji}`,
      kana: `${r.kana}${dirKana}`,
      romaji: `${r.romaji}${dirRomaji}`,
      meaning: {
        zh: isPast ? `${n}天前` : `${n}天后`,
        en: isPast ? `${n} day${n !== 1 ? 's' : ''} ago` : `In ${n} day${n !== 1 ? 's' : ''}`,
      },
      trap: r.irregular,
      note: r.irregular ? {
        zh: `${n}日使用不规则读音「${r.kana}」，须直接记忆`,
        en: `${n} days uses the irregular reading ${r.kana} — must be memorized`,
      } : undefined,
    };
  }

  if (granularity === 'month') {
    const weeks = Math.max(1, Math.round(Math.abs(dayOffset) / 7));
    const wk = WEEK_KANJI[weeks] ?? String(weeks);
    const wn = WEEK_KANA[weeks] ?? String(weeks);
    return {
      kanji: `${wk}週間${dirKanji}`,
      kana: `${wn}しゅうかん${dirKana}`,
      romaji: `${wn}·shu·u·ka·n${dirRomaji}`,
      meaning: {
        zh: isPast ? `约${weeks}周前` : `约${weeks}周后`,
        en: isPast ? `~${weeks} week${weeks !== 1 ? 's' : ''} ago` : `In ~${weeks} week${weeks !== 1 ? 's' : ''}`,
      },
    };
  }

  // year granularity
  const months = Math.max(1, Math.round(Math.abs(dayOffset) / 30));
  const mk = MONTH_KANJI[months] ?? String(months);
  const mn = MONTH_KANA[months] ?? String(months);
  return {
    kanji: `${mk}ヶ月${dirKanji}`,
    kana: `${mn}かげつ${dirKana}`,
    romaji: `${mn}·ka·ge·tsu${dirRomaji}`,
    meaning: {
      zh: isPast ? `约${months}个月前` : `约${months}个月后`,
      en: isPast ? `~${months} month${months !== 1 ? 's' : ''} ago` : `In ~${months} month${months !== 1 ? 's' : ''}`,
    },
  };
}

// ── Timeline node generation ──────────────────────────────────────────────

export const generateTimelineNodes = (granularity: Granularity): TimelineNode[] => {
  if (granularity === 'day') {
    return [-2, -1, 0, 1, 2].map((o) => ({ type: 'major' as const, dayOffset: o, unitOffset: o }));
  }

  if (granularity === 'week') {
    const majorDayOffsets = [-14, -7, 0, 7, 14];
    const nodes: TimelineNode[] = [];
    majorDayOffsets.forEach((wday, i) => {
      nodes.push({ type: 'major', dayOffset: wday, unitOffset: i - 2 });
      if (i < 4) {
        for (let d = 1; d <= 6; d++) {
          nodes.push({ type: 'minor', dayOffset: wday + d });
        }
      }
    });
    return nodes; // 29 nodes
  }

  if (granularity === 'month') {
    // 3 minor nodes per gap = 3 inter-week dividers within a month (4 weeks).
    // flex:2 on each minor → total flex = 5×2 + 12×2 = 34, same as week view.
    const majorDayOffsets = [-60, -30, 0, 30, 60];
    const nodes: TimelineNode[] = [];
    majorDayOffsets.forEach((mday, i) => {
      nodes.push({ type: 'major', dayOffset: mday, unitOffset: i - 2 });
      if (i < 4) {
        const step = 30 / 4; // 7.5 days per minor step (quarter-month)
        for (let j = 1; j <= 3; j++) {
          nodes.push({ type: 'minor', dayOffset: Math.round(mday + step * j), flex: 2 });
        }
      }
    });
    return nodes; // 17 nodes, flex total = 34
  }

  // year — 3 minor nodes per gap = quarters (Q1/Q2/Q3 dividers).
  // flex:2 on each minor → total flex = 5×2 + 12×2 = 34, same as week view.
  const majorDayOffsets = [-730, -365, 0, 365, 730];
  const nodes: TimelineNode[] = [];
  majorDayOffsets.forEach((yday, i) => {
    nodes.push({ type: 'major', dayOffset: yday, unitOffset: i - 2 });
    if (i < 4) {
      const step = 365 / 4; // ~91 days per minor step (quarter-year)
      for (let j = 1; j <= 3; j++) {
        nodes.push({ type: 'minor', dayOffset: Math.round(yday + step * j), flex: 2 });
      }
    }
  });
  return nodes; // 17 nodes, flex total = 34
};

// ── Duration data ─────────────────────────────────────────────────────────

export interface DurationItem {
  unit: 'day' | 'week' | 'month' | 'year';
  count: number;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: { zh: string; en: string };
  note?: { zh: string; en: string };
}

export const DURATION_DATA: DurationItem[] = [
  // 日間
  { unit: 'day', count: 1,  kanji: '一日間',   kana: 'いちにちかん',    romaji: 'i·chi·ni·chi·ka·n',  meaning: { zh: '1天',  en: '1 day'    } },
  { unit: 'day', count: 2,  kanji: '二日間',   kana: 'ふつかかん',      romaji: 'fu·tsu·ka·ka·n',     meaning: { zh: '2天',  en: '2 days'   }, note: { zh: '使用不规则读音「ふつか」', en: 'Uses irregular reading ふつか' } },
  { unit: 'day', count: 3,  kanji: '三日間',   kana: 'みっかかん',      romaji: 'mi·k·ka·ka·n',       meaning: { zh: '3天',  en: '3 days'   }, note: { zh: '使用不规则读音「みっか」', en: 'Uses irregular reading みっか' } },
  { unit: 'day', count: 4,  kanji: '四日間',   kana: 'よっかかん',      romaji: 'yo·k·ka·ka·n',       meaning: { zh: '4天',  en: '4 days'   }, note: { zh: '使用不规则读音「よっか」', en: 'Uses irregular reading よっか' } },
  { unit: 'day', count: 5,  kanji: '五日間',   kana: 'いつかかん',      romaji: 'i·tsu·ka·ka·n',      meaning: { zh: '5天',  en: '5 days'   }, note: { zh: '使用不规则读音「いつか」', en: 'Uses irregular reading いつか' } },
  { unit: 'day', count: 6,  kanji: '六日間',   kana: 'むいかかん',      romaji: 'mu·i·ka·ka·n',       meaning: { zh: '6天',  en: '6 days'   }, note: { zh: '使用不规则读音「むいか」', en: 'Uses irregular reading むいか' } },
  { unit: 'day', count: 7,  kanji: '七日間',   kana: 'なのかかん',      romaji: 'na·no·ka·ka·n',      meaning: { zh: '7天',  en: '7 days'   }, note: { zh: '等于一週間；使用不规则读音「なのか」', en: 'Equal to 一週間; irregular reading なのか' } },
  { unit: 'day', count: 8,  kanji: '八日間',   kana: 'ようかかん',      romaji: 'yo·u·ka·ka·n',       meaning: { zh: '8天',  en: '8 days'   }, note: { zh: '使用不规则读音「ようか」', en: 'Uses irregular reading ようか' } },
  { unit: 'day', count: 9,  kanji: '九日間',   kana: 'ここのかかん',    romaji: 'ko·ko·no·ka·ka·n',   meaning: { zh: '9天',  en: '9 days'   }, note: { zh: '使用不规则读音「ここのか」', en: 'Uses irregular reading ここのか' } },
  { unit: 'day', count: 10, kanji: '十日間',   kana: 'とおかかん',      romaji: 'to·o·ka·ka·n',       meaning: { zh: '10天', en: '10 days'  }, note: { zh: '使用不规则读音「とおか」', en: 'Uses irregular reading とおか' } },
  { unit: 'day', count: 14, kanji: '十四日間', kana: 'じゅうよっかかん', romaji: 'ju·u·yo·k·ka·ka·n', meaning: { zh: '14天', en: '14 days'  }, note: { zh: '使用不规则读音「じゅうよっか」', en: 'Uses irregular reading じゅうよっか' } },
  // 週間
  { unit: 'week', count: 1, kanji: '一週間', kana: 'いっしゅうかん', romaji: 'i·s·shu·u·ka·n',  meaning: { zh: '1周', en: '1 week'   } },
  { unit: 'week', count: 2, kanji: '二週間', kana: 'にしゅうかん',   romaji: 'ni·shu·u·ka·n',   meaning: { zh: '2周', en: '2 weeks'  } },
  { unit: 'week', count: 3, kanji: '三週間', kana: 'さんしゅうかん', romaji: 'sa·n·shu·u·ka·n', meaning: { zh: '3周', en: '3 weeks'  } },
  { unit: 'week', count: 4, kanji: '四週間', kana: 'よんしゅうかん', romaji: 'yo·n·shu·u·ka·n', meaning: { zh: '4周', en: '4 weeks'  } },
  // ヶ月
  { unit: 'month', count: 1, kanji: '一ヶ月', kana: 'いっかげつ',   romaji: 'i·k·ka·ge·tsu',  meaning: { zh: '1个月', en: '1 month'   } },
  { unit: 'month', count: 2, kanji: '二ヶ月', kana: 'にかげつ',     romaji: 'ni·ka·ge·tsu',   meaning: { zh: '2个月', en: '2 months'  } },
  { unit: 'month', count: 3, kanji: '三ヶ月', kana: 'さんかげつ',   romaji: 'sa·n·ka·ge·tsu', meaning: { zh: '3个月', en: '3 months'  } },
  { unit: 'month', count: 4, kanji: '四ヶ月', kana: 'よんかげつ',   romaji: 'yo·n·ka·ge·tsu', meaning: { zh: '4个月', en: '4 months'  } },
  { unit: 'month', count: 5, kanji: '五ヶ月', kana: 'ごかげつ',     romaji: 'go·ka·ge·tsu',   meaning: { zh: '5个月', en: '5 months'  } },
  { unit: 'month', count: 6, kanji: '六ヶ月', kana: 'ろっかげつ',   romaji: 'ro·k·ka·ge·tsu', meaning: { zh: '6个月', en: '6 months'  } },
  // 年間
  { unit: 'year', count: 1, kanji: '一年間', kana: 'いちねんかん', romaji: 'i·chi·nen·ka·n', meaning: { zh: '1年', en: '1 year'   } },
  { unit: 'year', count: 2, kanji: '二年間', kana: 'にねんかん',   romaji: 'ni·nen·ka·n',    meaning: { zh: '2年', en: '2 years'  } },
  { unit: 'year', count: 3, kanji: '三年間', kana: 'さんねんかん', romaji: 'sa·n·nen·ka·n',  meaning: { zh: '3年', en: '3 years'  } },
  { unit: 'year', count: 4, kanji: '四年間', kana: 'よねんかん',   romaji: 'yo·nen·ka·n',    meaning: { zh: '4年', en: '4 years'  } },
];

const findDuration = (unit: DurationItem['unit'], count: number) =>
  DURATION_DATA.find((d) => d.unit === unit && d.count === count);

export function getDurationExpression(
  granularity: Granularity,
  anchorDayOffset: number,
  focusDayOffset: number,
): DurationItem | undefined {
  const spanDays = Math.abs(focusDayOffset - anchorDayOffset);
  if (spanDays === 0) return undefined;

  if (granularity === 'week') {
    const weeks = spanDays / 7;
    if (Number.isInteger(weeks) && weeks >= 1 && weeks <= 4) return findDuration('week', weeks);
    if (spanDays <= 14) return findDuration('day', spanDays);
    return findDuration('week', Math.round(spanDays / 7));
  }

  if (granularity === 'month') {
    const months = Math.round(spanDays / 30);
    if (months >= 1 && months <= 6) return findDuration('month', months);
    const weeks = Math.round(spanDays / 7);
    if (weeks >= 1 && weeks <= 4) return findDuration('week', weeks);
    return findDuration('month', 1);
  }

  if (granularity === 'year') {
    const years = Math.round(spanDays / 365);
    if (years >= 1 && years <= 4) return findDuration('year', years);
    const months = Math.round(spanDays / 30);
    if (months >= 1 && months <= 6) return findDuration('month', months);
    return findDuration('year', 1);
  }

  // day granularity
  if (spanDays <= 14) return findDuration('day', spanDays);
  return findDuration('day', 7);
}

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
