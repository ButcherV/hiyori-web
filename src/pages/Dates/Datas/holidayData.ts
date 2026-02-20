// src/pages/Dates/Datas/holidayData.ts
// key 字段必须与 japanese-holidays 包返回值完全一致

// ─── 原有类型（保持兼容，DateDetailPanel 在用）──────────────────────────────
export interface HolidayMeta {
  kana: string;
  romaji: string;
  en: string;
  zh: string;
}

export const HOLIDAY_METADATA: Record<string, HolidayMeta> = {
  // 国民の祝日
  元日:         { kana: 'がんじつ',           romaji: 'ga·n·ji·tsu',               en: "New Year's Day",          zh: '元旦' },
  成人の日:     { kana: 'せいじんのひ',       romaji: 'se·i·ji·n·no·hi',           en: 'Coming of Age Day',       zh: '成人节' },
  建国記念の日: { kana: 'けんこくきねんのひ', romaji: 'ke·n·ko·ku·ki·ne·n·no·hi', en: 'Foundation Day',          zh: '建国纪念日' },
  天皇誕生日:   { kana: 'てんのうたんじょうび', romaji: 'te·n·no·u·ta·n·jo·u·bi', en: "Emperor's Birthday",      zh: '天皇诞生日' },
  春分の日:     { kana: 'しゅんぶんのひ',     romaji: 'shu·n·bu·n·no·hi',         en: 'Vernal Equinox Day',      zh: '春分日' },
  昭和の日:     { kana: 'しょうわのひ',       romaji: 'sho·u·wa·no·hi',           en: 'Showa Day',               zh: '昭和日' },
  憲法記念日:   { kana: 'けんぽうきねんび',   romaji: 'ke·n·po·u·ki·ne·n·bi',     en: 'Constitution Memorial Day', zh: '宪法纪念日' },
  みどりの日:   { kana: 'みどりのひ',         romaji: 'mi·do·ri·no·hi',           en: 'Greenery Day',            zh: '绿之日' },
  こどもの日:   { kana: 'こどものひ',         romaji: 'ko·do·mo·no·hi',           en: "Children's Day",          zh: '儿童节' },
  海の日:       { kana: 'うみのひ',           romaji: 'u·mi·no·hi',               en: 'Marine Day',              zh: '海之日' },
  山の日:       { kana: 'やまのひ',           romaji: 'ya·ma·no·hi',              en: 'Mountain Day',            zh: '山之日' },
  敬老の日:     { kana: 'けいろうのひ',       romaji: 'ke·i·ro·u·no·hi',          en: 'Respect for the Aged Day', zh: '老人节' },
  秋分の日:     { kana: 'しゅうぶんのひ',     romaji: 'shu·u·bu·n·no·hi',         en: 'Autumnal Equinox Day',    zh: '秋分日' },
  スポーツの日: { kana: 'すぽーつのひ',       romaji: 'su·po·o·tsu·no·hi',        en: 'Sports Day',              zh: '体育日' },
  文化の日:     { kana: 'ぶんかのひ',         romaji: 'bu·n·ka·no·hi',            en: 'Culture Day',             zh: '文化节' },
  勤労感謝の日: { kana: 'きんろうかんしゃのひ', romaji: 'ki·n·ro·u·ka·n·sha·no·hi', en: 'Labor Thanksgiving Day', zh: '劳动感谢节' },
  振替休日:     { kana: 'ふりかえきゅうじつ', romaji: 'fu·ri·ka·e·kyu·u·ji·tsu', en: 'Substitute Holiday',      zh: '补休日' },
  国民の休日:   { kana: 'こくみんのきゅうじつ', romaji: 'ko·ku·mi·n·no·kyu·u·ji·tsu', en: "Citizen's Holiday",  zh: '市民节假日' },
  // 年中行事
  節分:         { kana: 'せつぶん',     romaji: 'se·tsu·bu·n',     en: 'Setsubun',                zh: '节分' },
  'ひな祭り':   { kana: 'ひなまつり',   romaji: 'hi·na·ma·tsu·ri', en: "Hinamatsuri / Girls' Day", zh: '女儿节' },
  七夕:         { kana: 'たなばた',     romaji: 'ta·na·ba·ta',     en: 'Tanabata',                zh: '七夕' },
  お盆:         { kana: 'おぼん',       romaji: 'o·bo·n',          en: 'Obon',                    zh: '盂兰盆节' },
  七五三:       { kana: 'しちごさん',   romaji: 'shi·chi·go·san',  en: 'Shichi-Go-San',           zh: '七五三' },
  大晦日:       { kana: 'おおみそか',   romaji: 'o·o·mi·so·ka',   en: "New Year's Eve",          zh: '除夕' },
  // 世界行事
  'バレンタインデー': { kana: 'ばれんたいんでー', romaji: 'ba·re·n·ta·i·n·de·e', en: "Valentine's Day", zh: '情人节' },
  'ホワイトデー':     { kana: 'ほわいとでー',     romaji: 'ho·wa·i·to·de·e',     en: 'White Day',       zh: '白色情人节' },
  'ハロウィン':       { kana: 'はろうぃん',       romaji: 'ha·ro·u·i·n',         en: 'Halloween',       zh: '万圣节' },
  'クリスマス':       { kana: 'くりすます',       romaji: 'ku·ri·su·ma·su',      en: 'Christmas',       zh: '圣诞节' },
};

export const getHolidayMeta = (name: string): HolidayMeta => {
  return HOLIDAY_METADATA[name] || { kana: 'しゅくじつ', romaji: 'shu·ku·ji·tsu', en: 'National Holiday', zh: '国定假日' };
};

// ─── 新增：完整学习数据 ───────────────────────────────────────────────────────
export type HolidayBadgeType = 'national' | 'traditional' | 'global';

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
  /** true for pure-kana/katakana names — skip the kana row in HolidayCard */
  hideKana?: boolean;
  /** optional emoji displayed after the name in HolidayCard */
  emoji?: string;
  /** word origin for katakana loan words */
  etymology?: { zh: string; en: string };
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
    emoji: '🎍',
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
    emoji: '🌸',
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
    emoji: '🌿',
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
    emoji: '🎏',
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
    emoji: '🌊',
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
    emoji: '⛰️',
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
    emoji: '🍂',
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

  // ─── 年中行事 (Traditional, fixed dates) ──────────
  {
    key: '節分',
    kanji: '節分',
    kana: 'せつぶん',
    romaji: 'se·tsu·bu·n',
    emoji: '👹',
    badgeType: 'traditional',
    theme: { bg: '#FEFCE8', accent: '#B45309', sub: '#78350F', divider: '#FDE68A' },
    culturalNote: {
      zh: '立春前一天（2月3日前后），人们撒豆驱鬼迎福，喊"鬼は外！福は内！"，并吃与年龄等数的豆子。',
      en: "The day before Setsubun (around Feb 3). People scatter roasted beans shouting 'Oni wa soto! Fuku wa uchi!' to drive away evil and invite good fortune.",
    },
    expression: {
      jp: '鬼は外！福は内！',
      translation: { zh: '鬼滚出去！福气进来！', en: 'Out with demons! In with good fortune!' },
    },
  },
  {
    key: 'ひな祭り',
    kanji: 'ひな祭り',
    kana: 'ひなまつり',
    romaji: 'hi·na·ma·tsu·ri',
    emoji: '🎎',
    badgeType: 'traditional',
    theme: { bg: '#FDF2F8', accent: '#DB2777', sub: '#9D174D', divider: '#FBCFE8' },
    culturalNote: {
      zh: '3月3日女儿节（桃の節句）。家中摆放象征皇室的雏人形，祈愿女儿健康成长，喝白酒吃菱饼。',
      en: "March 3rd. Girls' Festival (Momo no Sekku). Families display Hina dolls and pray for their daughters' health.",
    },
    expression: {
      jp: 'お雛様を飾りましたか？',
      translation: { zh: '摆好雏人形了吗？', en: 'Have you set up the Hina dolls?' },
    },
  },
  {
    key: '七夕',
    kanji: '七夕',
    kana: 'たなばた',
    romaji: 'ta·na·ba·ta',
    emoji: '🎋',
    badgeType: 'traditional',
    theme: { bg: '#EFF6FF', accent: '#1D4ED8', sub: '#1E3A8A', divider: '#BFDBFE' },
    culturalNote: {
      zh: '7月7日，源自牛郎织女传说（织姬と彦星）。人们将心愿写在彩色纸条（短冊）上，挂在竹枝祈愿。',
      en: "July 7th. Based on the legend of Orihime and Hikoboshi. People write wishes on colorful strips of paper (tanzaku) and hang them on bamboo.",
    },
    expression: {
      jp: '願いが叶いますように。',
      translation: { zh: '愿心愿成真。', en: 'May your wishes come true.' },
    },
  },
  {
    key: 'お盆',
    kanji: 'お盆',
    kana: 'おぼん',
    romaji: 'o·bo·n',
    emoji: '🏮',
    badgeType: 'traditional',
    theme: { bg: '#F5F3FF', accent: '#7C3AED', sub: '#5B21B6', divider: '#DDD6FE' },
    culturalNote: {
      zh: '8月13～16日，盂兰盆节（盆）。日本人相信此时祖先亡灵会回家探望，家家点迎火、送火，跳盆踊。',
      en: 'Mid-August. Obon is a Buddhist custom to honor the spirits of ancestors. Families light ceremonial fires and perform Bon Odori dances.',
    },
    expression: {
      jp: 'ご先祖様をお迎えします。',
      translation: { zh: '迎接祖先的亡灵归来。', en: 'We welcome the spirits of our ancestors.' },
    },
  },
  {
    key: '七五三',
    kanji: '七五三',
    kana: 'しちごさん',
    romaji: 'shi·chi·go·sa·n',
    emoji: '🎀',
    badgeType: 'traditional',
    theme: { bg: '#FFF1F2', accent: '#BE123C', sub: '#9F1239', divider: '#FECDD3' },
    culturalNote: {
      zh: '11月15日，为3岁、5岁（男孩）及7岁（女孩）的孩子举办的成长祝福仪式。穿和服去神社参拜，吃千歳飴。',
      en: "November 15th. A rite of passage for children aged 3, 5, and 7. They visit shrines in kimono and receive Chitose-ame (longevity candy).",
    },
    expression: {
      jp: '元気に育ちますように。',
      translation: { zh: '愿孩子健康茁壮成长。', en: 'May the children grow up healthy and strong.' },
    },
  },
  {
    key: '大晦日',
    kanji: '大晦日',
    kana: 'おおみそか',
    romaji: 'o·o·mi·so·ka',
    emoji: '🎆',
    badgeType: 'traditional',
    theme: { bg: '#EFF6FF', accent: '#1E40AF', sub: '#1E3A8A', divider: '#BFDBFE' },
    culturalNote: {
      zh: '12月31日除夕。晚上寺庙敲"除夜の鐘"108下，去除人的108种烦恼；全家看紅白歌合戰，吃跨年荞麦面（年越し蕎麦）。',
      en: "December 31st. New Year's Eve. Temple bells ring 108 times (Joya no Kane) to dispel worldly desires, and families enjoy Toshikoshi Soba noodles.",
    },
    expression: {
      jp: '良いお年をお迎えください。',
      translation: { zh: '祝您新年顺利！', en: 'Wishing you a wonderful New Year.' },
    },
  },

  // ─── 世界行事 (Global events) ──────────────────
  {
    key: 'バレンタインデー',
    kanji: 'バレンタインデー',
    kana: 'ばれんたいんでー',
    romaji: 'ba·re·n·ta·i·n·de·e',
    hideKana: true,
    emoji: '🍫',
    etymology: { zh: '源自英语 Valentine\'s Day', en: 'from English "Valentine\'s Day"' },
    badgeType: 'global',
    theme: { bg: '#FFF0F3', accent: '#E11D48', sub: '#9F1239', divider: '#FECDD3' },
    culturalNote: {
      zh: '2月14日情人节。日本独特习俗是女性向男性赠送巧克力，分为表达爱意的"本命チョコ"和社交用的"義理チョコ"两种。',
      en: "February 14th. In Japan, women give chocolate to men — romantic 'Honmei Choco' to their loved one and obligatory 'Giri Choco' to coworkers.",
    },
    expression: {
      jp: 'チョコレートをどうぞ。',
      translation: { zh: '请收下这份巧克力。', en: 'Please accept this chocolate.' },
    },
  },
  {
    key: 'ホワイトデー',
    kanji: 'ホワイトデー',
    kana: 'ほわいとでー',
    romaji: 'ho·wa·i·to·de·e',
    hideKana: true,
    emoji: '🍬',
    etymology: { zh: '源自英语 White Day（日本独创节日）', en: 'from English "White Day" (Japanese invention)' },
    badgeType: 'global',
    theme: { bg: '#FDF4FF', accent: '#A855F7', sub: '#7E22CE', divider: '#E9D5FF' },
    culturalNote: {
      zh: '3月14日白色情人节，是日本独创的节日。情人节收到巧克力的男性，在这天回赠糖果或白巧克力。',
      en: "March 14th. A Japanese invention. Men return a gift of sweets or white chocolate to women who gave them Valentine's chocolate.",
    },
    expression: {
      jp: 'バレンタインのお返しです。',
      translation: { zh: '这是情人节的回礼。', en: 'This is my return gift for Valentine\'s.' },
    },
  },
  {
    key: 'ハロウィン',
    kanji: 'ハロウィン',
    kana: 'はろうぃん',
    romaji: 'ha·ro·u·i·n',
    hideKana: true,
    emoji: '🎃',
    etymology: { zh: '源自英语 Halloween', en: 'from English "Halloween"' },
    badgeType: 'global',
    theme: { bg: '#FFF7ED', accent: '#EA580C', sub: '#9A3412', divider: '#FED7AA' },
    culturalNote: {
      zh: '10月31日万圣节前夕。在日本，渋谷等地会出现大规模的街头cosplay聚会，商业活动也极为热闹。',
      en: "October 31st. In Japan, streets like Shibuya fill with elaborate cosplay. It's more of a street festival than a spooky holiday.",
    },
    expression: {
      jp: 'トリック・オア・トリート！',
      translation: { zh: '不给糖就捣蛋！', en: 'Trick or treat!' },
    },
  },
  {
    key: 'クリスマス',
    kanji: 'クリスマス',
    kana: 'くりすます',
    romaji: 'ku·ri·su·ma·su',
    hideKana: true,
    emoji: '🎄',
    etymology: { zh: '源自英语 Christmas', en: 'from English "Christmas"' },
    badgeType: 'global',
    theme: { bg: '#F0FDF4', accent: '#15803D', sub: '#14532D', divider: '#BBF7D0' },
    culturalNote: {
      zh: '12月25日圣诞节。在日本更多是情侣和商业节日而非宗教节日，圣诞蛋糕（クリスマスケーキ）和KFC炸鸡是标志性习俗。',
      en: "December 25th. In Japan, Christmas is a romantic and commercial occasion. Couples share Christmas cake and KFC fried chicken — a beloved tradition since 1974.",
    },
    expression: {
      jp: 'メリークリスマス！',
      translation: { zh: '圣诞快乐！', en: 'Merry Christmas!' },
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

/** 按节日名查找完整学习数据（兼容国民の祝日 key 和自定义节日 key）*/
export const getHolidayItem = (name: string): HolidayItem | undefined => {
  return holidaysData.find((h) => h.key === name);
};

// ─── 固定日期自定义节日（年中行事 + 世界行事）────────────────────────────────
// 格式：'月-日' → 节日 key
const CUSTOM_HOLIDAY_DATES: Record<string, string> = {
  '2-3':   '節分',
  '2-14':  'バレンタインデー',
  '3-3':   'ひな祭り',
  '3-14':  'ホワイトデー',
  '7-7':   '七夕',
  '8-15':  'お盆',
  '10-31': 'ハロウィン',
  '11-15': '七五三',
  '12-25': 'クリスマス',
  '12-31': '大晦日',
};

/** 查询固定日期自定义节日名，没有则返回 null */
export const getCustomHolidayName = (date: Date): string | null => {
  const key = `${date.getMonth() + 1}-${date.getDate()}`;
  return CUSTOM_HOLIDAY_DATES[key] ?? null;
};
