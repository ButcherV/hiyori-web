// src/pages/Dates/Datas/holidayData.ts
// key 字段必须与 japanese-holidays 包返回值完全一致

// ─── 原有类型（保持兼容，DateDetailPanel 在用）──────────────────────────────
export interface HolidayMeta {
  kana: string;
  romaji: string;
  en: string;
}

export const HOLIDAY_METADATA: Record<string, HolidayMeta> = {
  元日: { kana: 'がんじつ', romaji: 'ga·n·ji·tsu', en: "New Year's Day" },
  成人の日: { kana: 'せいじんのひ', romaji: 'se·i·ji·n·no·hi', en: 'Coming of Age Day' },
  建国記念の日: { kana: 'けんこくきねんのひ', romaji: 'ke·n·ko·ku·ki·ne·n·no·hi', en: 'Foundation Day' },
  天皇誕生日: { kana: 'てんのうたんじょうび', romaji: 'te·n·no·u·ta·n·jo·u·bi', en: "Emperor's Birthday" },
  春分の日: { kana: 'しゅんぶんのひ', romaji: 'shu·n·bu·n·no·hi', en: 'Vernal Equinox Day' },
  昭和の日: { kana: 'しょうわのひ', romaji: 'sho·u·wa·no·hi', en: 'Showa Day' },
  憲法記念日: { kana: 'けんぽうきねんび', romaji: 'ke·n·po·u·ki·ne·n·bi', en: 'Constitution Memorial Day' },
  みどりの日: { kana: 'みどりのひ', romaji: 'mi·do·ri·no·hi', en: 'Greenery Day' },
  こどもの日: { kana: 'こどものひ', romaji: 'ko·do·mo·no·hi', en: "Children's Day" },
  海の日: { kana: 'うみのひ', romaji: 'u·mi·no·hi', en: 'Marine Day' },
  山の日: { kana: 'やまのひ', romaji: 'ya·ma·no·hi', en: 'Mountain Day' },
  敬老の日: { kana: 'けいろうのひ', romaji: 'ke·i·ro·u·no·hi', en: 'Respect for the Aged Day' },
  秋分の日: { kana: 'しゅうぶんのひ', romaji: 'shu·u·bu·n·no·hi', en: 'Autumnal Equinox Day' },
  スポーツの日: { kana: 'すぽーつのひ', romaji: 'su·po·o·tsu·no·hi', en: 'Sports Day' },
  文化の日: { kana: 'ぶんかのひ', romaji: 'bu·n·ka·no·hi', en: 'Culture Day' },
  勤労感謝の日: { kana: 'きんろうかんしゃのひ', romaji: 'ki·n·ro·u·ka·n·sha·no·hi', en: 'Labor Thanksgiving Day' },
  振替休日: { kana: 'ふりかえきゅうじつ', romaji: 'fu·ri·ka·e·kyu·u·ji·tsu', en: 'Substitute Holiday' },
  国民の休日: { kana: 'こくみんのきゅうじつ', romaji: 'ko·ku·mi·n·no·kyu·u·ji·tsu', en: "Citizen's Holiday" },
};

export const getHolidayMeta = (name: string): HolidayMeta => {
  return HOLIDAY_METADATA[name] || { kana: 'しゅくじつ', romaji: 'shu·ku·ji·tsu', en: 'National Holiday' };
};

// ─── 新增：完整学习数据 ───────────────────────────────────────────────────────
export type HolidayBadgeType = 'national' | 'traditional';

export interface HolidayTheme {
  bg: string;
  accent: string;
  sub: string;
  divider: string;
}

export interface HolidayItem {
  key: string;
  kanji: string;
  kana: string;
  romaji: string;
  badgeType: HolidayBadgeType;
  theme: HolidayTheme;
  culturalNote: { zh: string; en: string };
  expression: {
    jp: string;
    translation: { zh: string; en: string };
  };
}

export const holidaysData: HolidayItem[] = [
  // ─── 1月 ──────────────────────────────────────
  {
    key: '元日',
    kanji: '元日',
    kana: 'がんじつ',
    romaji: 'ga·n·ji·tsu',
    badgeType: 'national',
    theme: { bg: '#FFF0F0', accent: '#C0392B', sub: '#922B21', divider: '#FCCACA' },
    culturalNote: {
      zh: '新年第一天，日本最重要的公共假日。通常全家去神社参拜（初詣），吃年节料理迎接新年。',
      en: "New Year's Day. Families visit shrines (Hatsumode) and enjoy traditional New Year's cuisine together.",
    },
    expression: {
      jp: 'あけましておめでとうございます',
      translation: { zh: '新年快乐（正式问候）', en: 'Happy New Year (formal)' },
    },
  },
  {
    key: '成人の日',
    kanji: '成人の日',
    kana: 'せいじんのひ',
    romaji: 'se·i·ji·n·no·hi',
    badgeType: 'national',
    theme: { bg: '#F5F0FF', accent: '#7C3AED', sub: '#5B21B6', divider: '#DDD6FE' },
    culturalNote: {
      zh: '一月第二个周一，庆祝年满18岁青年成人的节日。各地举办成人式，女性通常穿振袖和服出席。',
      en: 'Second Monday of January. Celebrates young adults turning 18. Coming-of-age ceremonies are held nationwide.',
    },
    expression: {
      jp: '成人おめでとうございます',
      translation: { zh: '恭喜成年', en: 'Congratulations on becoming an adult' },
    },
  },

  // ─── 2月 ──────────────────────────────────────
  {
    key: '建国記念の日',
    kanji: '建国記念の日',
    kana: 'けんこくきねんのひ',
    romaji: 'ke·n·ko·ku·ki·ne·n·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFF1F2', accent: '#9F1239', sub: '#881337', divider: '#FECDD3' },
    culturalNote: {
      zh: '二月十一日，纪念神话中神武天皇即位、日本立国的节日。相关庆典活动在全国各地举行。',
      en: 'February 11th. Commemorates the mythological founding of Japan by Emperor Jinmu.',
    },
    expression: {
      jp: '今日は建国記念の日です。',
      translation: { zh: '今天是建国纪念日。', en: 'Today is National Foundation Day.' },
    },
  },
  {
    key: '天皇誕生日',
    kanji: '天皇誕生日',
    kana: 'てんのうたんじょうび',
    romaji: 'te·n·no·u·ta·n·jo·u·bi',
    badgeType: 'national',
    theme: { bg: '#FFFBEB', accent: '#B45309', sub: '#92400E', divider: '#FDE68A' },
    culturalNote: {
      zh: '二月二十三日，现任天皇（德仁天皇）的生日。皇居举办一般参贺，民众可入宫向天皇当面祝贺。',
      en: "February 23rd, birthday of Emperor Naruhito. The public is invited to the Imperial Palace for a general audience.",
    },
    expression: {
      jp: 'お誕生日おめでとうございます',
      translation: { zh: '生日快乐', en: 'Happy Birthday' },
    },
  },

  // ─── 3月 ──────────────────────────────────────
  {
    key: '春分の日',
    kanji: '春分の日',
    kana: 'しゅんぶんのひ',
    romaji: 'shu·n·bu·n·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFF0F5', accent: '#C2185B', sub: '#AD1457', divider: '#F8BBD9' },
    culturalNote: {
      zh: '三月下旬，昼夜等长的春分。也是「春のお彼岸」的中日，日本人习惯在此时扫墓祭祖、吃牡丹饼。',
      en: "Around March 20-21. The vernal equinox, midpoint of Spring Ohigan when families visit ancestral graves.",
    },
    expression: {
      jp: '今日は春分の日ですね。',
      translation: { zh: '今天是春分呢。', en: 'Today is the Spring Equinox.' },
    },
  },

  // ─── 4月 ──────────────────────────────────────
  {
    key: '昭和の日',
    kanji: '昭和の日',
    kana: 'しょうわのひ',
    romaji: 'sho·u·wa·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFF4ED', accent: '#9A3412', sub: '#7C2D12', divider: '#FDBA74' },
    culturalNote: {
      zh: '四月二十九日，昭和天皇（1926–1989年在位）的诞辰。也是黄金周（Golden Week）的第一天。',
      en: "April 29th, birthday of Emperor Showa (reigned 1926-1989). The first day of Golden Week.",
    },
    expression: {
      jp: 'ゴールデンウィーク楽しんでください。',
      translation: { zh: '请好好享受黄金周！', en: 'Enjoy Golden Week!' },
    },
  },

  // ─── 5月 ──────────────────────────────────────
  {
    key: '憲法記念日',
    kanji: '憲法記念日',
    kana: 'けんぽうきねんび',
    romaji: 'ke·n·po·u·ki·ne·n·bi',
    badgeType: 'national',
    theme: { bg: '#EEF2FF', accent: '#3730A3', sub: '#312E81', divider: '#C7D2FE' },
    culturalNote: {
      zh: '五月三日，1947年日本国宪法正式生效的纪念日。处于黄金周中间，是反思和平与民主的日子。',
      en: "May 3rd. Commemorates Japan's 1947 Constitution taking effect. Falls within Golden Week.",
    },
    expression: {
      jp: '今日は憲法記念日です。',
      translation: { zh: '今天是宪法纪念日。', en: 'Today is Constitution Day.' },
    },
  },
  {
    key: 'みどりの日',
    kanji: 'みどりの日',
    kana: 'みどりのひ',
    romaji: 'mi·do·ri·no·hi',
    badgeType: 'national',
    theme: { bg: '#F0FFF4', accent: '#2F6E3B', sub: '#1E4D29', divider: '#B7EBC7' },
    culturalNote: {
      zh: '五月四日，源于昭和天皇对自然的深厚热爱。鼓励人们亲近绿色自然的节日，黄金周期间。',
      en: "May 4th. Inspired by Emperor Showa's love of nature. A day to appreciate greenery, during Golden Week.",
    },
    expression: {
      jp: '自然を大切にしましょう。',
      translation: { zh: '让我们珍惜大自然吧。', en: "Let's cherish nature." },
    },
  },
  {
    key: 'こどもの日',
    kanji: 'こどもの日',
    kana: 'こどものひ',
    romaji: 'ko·do·mo·no·hi',
    badgeType: 'national',
    theme: { bg: '#EEF4FF', accent: '#1E3A8A', sub: '#163080', divider: '#BFDBFE' },
    culturalNote: {
      zh: '五月五日，庆祝儿童健康成长的节日。家家挂鲤鱼旗，吃柏饼，源于古代男孩节的传统。黄金周最后一天。',
      en: "May 5th. Celebrates children's happiness and growth. Families fly koinobori (carp kites). Last day of Golden Week.",
    },
    expression: {
      jp: 'こどもの日おめでとう！',
      translation: { zh: '儿童节快乐！', en: "Happy Children's Day!" },
    },
  },

  // ─── 7月 ──────────────────────────────────────
  {
    key: '海の日',
    kanji: '海の日',
    kana: 'うみのひ',
    romaji: 'u·mi·no·hi',
    badgeType: 'national',
    theme: { bg: '#F0F9FF', accent: '#0369A1', sub: '#075985', divider: '#BAE6FD' },
    culturalNote: {
      zh: '七月第三个周一，感谢大海恩惠的节日。也标志着夏季海水浴季节正式开始。',
      en: "Third Monday of July. Gratitude for the ocean's bounty, marking the start of the summer beach season.",
    },
    expression: {
      jp: '今年の夏も海に行きたいですね。',
      translation: { zh: '今年夏天也想去海边呢。', en: 'I want to go to the beach this summer too.' },
    },
  },

  // ─── 8月 ──────────────────────────────────────
  {
    key: '山の日',
    kanji: '山の日',
    kana: 'やまのひ',
    romaji: 'ya·ma·no·hi',
    badgeType: 'national',
    theme: { bg: '#F0FDF4', accent: '#15803D', sub: '#166534', divider: '#BBF7D0' },
    culturalNote: {
      zh: '八月十一日，2016年设立的最新国民假日。鼓励人们亲近山岳、感受山地自然恩惠。',
      en: "August 11th, Japan's newest national holiday (est. 2016). Encourages people to appreciate mountains and nature.",
    },
    expression: {
      jp: '山登りに行きませんか？',
      translation: { zh: '要不要去爬山？', en: 'Shall we go hiking?' },
    },
  },

  // ─── 9月 ──────────────────────────────────────
  {
    key: '敬老の日',
    kanji: '敬老の日',
    kana: 'けいろうのひ',
    romaji: 'ke·i·ro·u·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFF4ED', accent: '#EA580C', sub: '#C2410C', divider: '#FED7AA' },
    culturalNote: {
      zh: '九月第三个周一，向老年人表达敬意和感谢的节日。子孙通常会给长辈送礼物或一起用餐。',
      en: "Third Monday of September. A day to honor the elderly. Families typically give gifts or dine together.",
    },
    expression: {
      jp: 'いつもありがとうございます。',
      translation: { zh: '一直感谢您。', en: 'Thank you for everything.' },
    },
  },
  {
    key: '秋分の日',
    kanji: '秋分の日',
    kana: 'しゅうぶんのひ',
    romaji: 'shu·u·bu·n·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFF1F2', accent: '#9F1239', sub: '#881337', divider: '#FECDD3' },
    culturalNote: {
      zh: '九月下旬，秋季昼夜等长的日子。也是「秋のお彼岸」的中日，与春分一样是扫墓祭祖的季节。',
      en: "Around September 22-23. The autumnal equinox, midpoint of Autumn Ohigan for visiting ancestral graves.",
    },
    expression: {
      jp: 'お彼岸ですね。お墓参りに行きますか？',
      translation: { zh: '到彼岸了呢。去扫墓吗？', en: "It's Ohigan. Going to visit the graves?" },
    },
  },

  // ─── 10月 ─────────────────────────────────────
  {
    key: 'スポーツの日',
    kanji: 'スポーツの日',
    kana: 'すぽーつのひ',
    romaji: 'su·po·o·tsu·no·hi',
    badgeType: 'national',
    theme: { bg: '#EEF2F7', accent: '#4A6FA5', sub: '#2C4A7C', divider: '#C5D3E8' },
    culturalNote: {
      zh: '十月第二个周一，前身为「体育の日」，以1964年东京奥运会开幕为纪念。鼓励运动与健康。',
      en: "Second Monday of October. Formerly 'Health-Sports Day', commemorating the 1964 Tokyo Olympics.",
    },
    expression: {
      jp: '体を動かしましょう！',
      translation: { zh: '动起来吧！', en: "Let's get moving!" },
    },
  },

  // ─── 11月 ─────────────────────────────────────
  {
    key: '文化の日',
    kanji: '文化の日',
    kana: 'ぶんかのひ',
    romaji: 'bu·n·ka·no·hi',
    badgeType: 'national',
    theme: { bg: '#F3F4F6', accent: '#374151', sub: '#1F2937', divider: '#D1D5DB' },
    culturalNote: {
      zh: '十一月三日，1946年日本国宪法公布纪念日。鼓励热爱文化、追求自由和平，各地举办文化活动。',
      en: "November 3rd. Commemorates Japan's Constitution promulgation. Celebrates culture, freedom, and peace.",
    },
    expression: {
      jp: '文化的な一日を楽しみましょう。',
      translation: { zh: '享受充满文化气息的一天吧。', en: "Let's enjoy a cultural day." },
    },
  },
  {
    key: '勤労感謝の日',
    kanji: '勤労感謝の日',
    kana: 'きんろうかんしゃのひ',
    romaji: 'ki·n·ro·u·ka·n·sha·no·hi',
    badgeType: 'national',
    theme: { bg: '#FFFCEB', accent: '#B45309', sub: '#92400E', divider: '#FDE68A' },
    culturalNote: {
      zh: '十一月二十三日，感谢劳动和生产的节日。传统上源于宫中祭祀新谷（新米）的「新嘗祭」仪式。',
      en: "November 23rd. Thanks for labor and production, rooted in the ancient imperial harvest ceremony (Niinamesai).",
    },
    expression: {
      jp: 'いつもお疲れ様です。',
      translation: { zh: '辛苦了。', en: 'Good work as always.' },
    },
  },

  // ─── 特殊 ─────────────────────────────────────
  {
    key: '振替休日',
    kanji: '振替休日',
    kana: 'ふりかえきゅうじつ',
    romaji: 'fu·ri·ka·e·kyu·u·ji·tsu',
    badgeType: 'national',
    theme: { bg: '#F8FAFC', accent: '#64748B', sub: '#475569', divider: '#CBD5E1' },
    culturalNote: {
      zh: '当国民假日恰逢周日时，顺延至下一个工作日作为补休。是日本假日制度保障劳动者权益的机制。',
      en: 'A substitute holiday when a national holiday falls on Sunday. Ensures workers always get their day off.',
    },
    expression: {
      jp: '今日は振替休日ですね。',
      translation: { zh: '今天是补休日呢。', en: 'Today is a substitute holiday.' },
    },
  },
  {
    key: '国民の休日',
    kanji: '国民の休日',
    kana: 'こくみんのきゅうじつ',
    romaji: 'ko·ku·mi·n·no·kyu·u·ji·tsu',
    badgeType: 'national',
    theme: { bg: '#F8FAFC', accent: '#64748B', sub: '#475569', divider: '#CBD5E1' },
    culturalNote: {
      zh: '当某个平日被两个国民假日夹在中间时，该天自动成为休假日。是较为罕见的特殊假日。',
      en: "A holiday when a non-holiday weekday is sandwiched between two national holidays. Rare but legally mandated.",
    },
    expression: {
      jp: '今日は国民の休日です。',
      translation: { zh: '今天是国民假日。', en: "Today is a Citizens' Holiday." },
    },
  },
];

/** 按 japanese-holidays 返回的节日名查找完整学习数据 */
export const getHolidayItem = (name: string): HolidayItem | undefined => {
  return holidaysData.find((h) => h.key === name);
};
