export interface HolidayMeta {
  kana: string;
  romaji: string;
  en: string;
}

// 🟢 核心字典：Key 必须严格匹配 getJapaneseHoliday 返回的日文汉字
export const HOLIDAY_METADATA: Record<string, HolidayMeta> = {
  元日: { kana: 'がんじつ', romaji: 'ga·n·ji·tsu', en: "New Year's Day" },
  成人の日: {
    kana: 'せいじんのひ',
    romaji: 'se·i·ji·n·no·hi',
    en: 'Coming of Age Day',
  },
  建国記念の日: {
    kana: 'けんこくきねんのひ',
    romaji: 'ke·n·ko·ku·ki·ne·n·no·hi',
    en: 'Foundation Day',
  },
  天皇誕生日: {
    kana: 'てんのうたんじょうび',
    romaji: 'te·n·no·u·ta·n·jo·u·bi',
    en: "Emperor's Birthday",
  },
  春分の日: {
    kana: 'しゅんぶんのひ',
    romaji: 'shu·n·bu·n·no·hi',
    en: 'Vernal Equinox Day',
  },
  昭和の日: { kana: 'しょうわのひ', romaji: 'sho·u·wa·no·hi', en: 'Showa Day' },
  憲法記念日: {
    kana: 'けんぽうきねんび',
    romaji: 'ke·n·po·u·ki·ne·n·bi',
    en: 'Constitution Memorial Day',
  },
  みどりの日: {
    kana: 'みどりのひ',
    romaji: 'mi·do·ri·no·hi',
    en: 'Greenery Day',
  },
  こどもの日: {
    kana: 'こどものひ',
    romaji: 'ko·do·mo·no·hi',
    en: "Children's Day",
  },
  海の日: { kana: 'うみのひ', romaji: 'u·mi·no·hi', en: 'Marine Day' },
  山の日: { kana: 'やまのひ', romaji: 'ya·ma·no·hi', en: 'Mountain Day' },
  敬老の日: {
    kana: 'けいろうのひ',
    romaji: 'ke·i·ro·u·no·hi',
    en: 'Respect for the Aged Day',
  },
  秋分の日: {
    kana: 'しゅうぶんのひ',
    romaji: 'shu·u·bu·n·no·hi',
    en: 'Autumnal Equinox Day',
  },
  スポーツの日: {
    kana: 'すぽーつのひ',
    romaji: 'su·po·o·tsu·no·hi',
    en: 'Sports Day',
  },
  文化の日: { kana: 'ぶんかのひ', romaji: 'bu·n·ka·no·hi', en: 'Culture Day' },
  勤労感謝の日: {
    kana: 'きんろうかんしゃのひ',
    romaji: 'ki·n·ro·u·ka·n·sha·no·hi',
    en: 'Labor Thanksgiving Day',
  },

  // 🟢 补全动态节日 (库可能会返回这些)
  振替休日: {
    kana: 'ふりかえきゅうじつ',
    romaji: 'fu·ri·ka·e·kyu·u·ji·tsu',
    en: 'Substitute Holiday',
  },
  国民の休日: {
    kana: 'こくみんのきゅうじつ',
    romaji: 'ko·ku·mi·n·no·kyu·u·ji·tsu',
    en: "Citizen's Holiday",
  },
};

// 辅助函数：安全获取节日详情 (查不到就给默认值)
export const getHolidayMeta = (name: string): HolidayMeta => {
  return (
    HOLIDAY_METADATA[name] || {
      kana: 'しゅくじつ', // Fallback
      romaji: 'shu·ku·ji·tsu',
      en: 'National Holiday',
    }
  );
};
