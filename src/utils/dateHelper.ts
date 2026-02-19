import JapaneseHolidays from 'japanese-holidays';

/**
 * 1. 获取日语问候语 (Morning/Afternoon/Evening)
 */
export const getJapaneseGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'おはよう';
  if (hour >= 11 && hour < 18) return 'こんにちは';
  return 'こんばんは';
};

/**
 * 2. 获取日期字符串 (例如: "12月18日")
 */
export const getJapaneseDateStr = (date: Date = new Date()): string => {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 3. 获取星期几字符串 (例如: "木曜日")
 */
export const getJapaneseWeekday = (date: Date = new Date()): string => {
  const weekdays = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ];
  return weekdays[date.getDay()];
};

/**
 * 4. 获取节日名称 (如果是平日返回 null，如果是节日返回 "元日" 等)
 */
export const getJapaneseHoliday = (date: Date = new Date()): string | null => {
  // isHoliday 返回节日名称 string 或 undefined
  return JapaneseHolidays.isHoliday(date) || null;
};

/**
 * 5. 判断是否是 "红日子" (周日 或 节日)
 * 用于 UI 变色逻辑
 */
export const isRedDay = (date: Date = new Date()): boolean => {
  const isSunday = date.getDay() === 0;
  const isHoliday = !!JapaneseHolidays.isHoliday(date);
  return isSunday || isHoliday;
};

/**
 * 在指定月份中找出第一个节日，没有则返回 null
 */
export const findFirstHolidayInMonth = (
  year: number,
  month: number
): Date | null => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    if (JapaneseHolidays.isHoliday(date)) return date;
  }
  return null;
};

export const getRelativeLabel = (targetDate: Date): string | null => {
  const now = new Date();
  // 只比较日期部分，忽略时间
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '明日';
  if (diffDays === -1) return '昨日';
  return null;
};

// 🟢 新增：数字转汉字 (用于月份 1-12)
export const toKanjiNum = (num: number): string => {
  const kanji = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  // 1. 针对年份的大数字逻辑 (>= 100)
  // 规则：直接一位一位翻译，例如 2024 -> 二〇二四
  if (num >= 100) {
    return num
      .toString()
      .split('')
      .map((char) => kanji[parseInt(char)])
      .join('');
  }

  // 2. 针对日期/月份的小数字逻辑 (< 100)
  // 规则：使用“十”的进位读法，例如 12 -> 十二，24 -> 二十四

  // 特殊处理 10
  if (num === 10) return '十';

  // 个位数 (0-9)
  if (num < 10) return kanji[num];

  // 11-19 (十X)
  if (num < 20) {
    return '十' + (num % 10 === 0 ? '' : kanji[num % 10]);
  }

  // 20-99 (X十X)
  return (
    kanji[Math.floor(num / 10)] + '十' + (num % 10 === 0 ? '' : kanji[num % 10])
  );
};

// 🟢 新增：获取汉字年号数字 (特殊处理元年)
export const getKanjiEraYear = (yearNum: number): string => {
  if (yearNum === 1) return '元年';
  return toKanjiNum(yearNum) + '年';
};

// 🟢 新增：和风月名常量
export const WAFU_GETSUMEI = [
  '睦月', // 1月
  '如月', // 2月
  '弥生', // 3月
  '卯月', // 4月
  '皐月', // 5月
  '水無月', // 6月
  '文月', // 7月
  '葉月', // 8月
  '長月', // 9月
  '神無月', // 10月
  '霜月', // 11月
  '師走', // 12月
];

/**
 * 获取月份的和风雅称
 * @param monthIndex 0-11 (Date.getMonth() 的返回值)
 */
export const getWafuMonth = (monthIndex: number): string => {
  return WAFU_GETSUMEI[monthIndex] || '';
};

/**
 * 获取西历年份的完整读音 (Kana + Romaji)
 * 例如：2024 -> { kana: 'にせんにじゅうよねん', romaji: 'ni·sen·ni·ju·u·yo·nen' }
 */
export const getWesternYearReading = (year: number) => {
  const digits = year.toString().split('').map(Number);

  // 简单防护：只处理 4 位数年份 (1000-9999)，其他直接返回
  if (digits.length !== 4) {
    return { kana: `${year}ねん`, romaji: `${year}·nen` };
  }

  const [th, hu, te, un] = digits;
  let k = '';
  let r = '';

  // 1. 千位 (Thousands)
  // 1000=sen, 3000=sanzen, 8000=hassen
  const thKana = [
    '',
    'せん',
    'にせん',
    'さんぜん',
    'よんせん',
    'ごせん',
    'ろくせん',
    'ななせん',
    'はっせん',
    'きゅうせん',
  ];
  const thRomaji = [
    '',
    'sen',
    'ni·sen',
    'san·zen',
    'yon·sen',
    'go·sen',
    'ro·ku·sen',
    'na·na·sen',
    'has·sen',
    'kyu·u·sen',
  ];

  k += thKana[th];
  r += thRomaji[th];

  // 2. 百位 (Hundreds)
  // 100=hyaku, 300=sanbyaku, 600=roppyaku, 800=happyaku
  if (hu > 0) {
    const huKana = [
      '',
      'ひゃく',
      'にひゃく',
      'さんびゃく',
      'よんひゃく',
      'ごひゃく',
      'ろっぴゃく',
      'ななひゃく',
      'はっぴゃく',
      'きゅうひゃく',
    ];
    const huRomaji = [
      '',
      'hya·ku',
      'ni·hya·ku',
      'san·bya·ku',
      'yon·hya·ku',
      'go·hya·ku',
      'rop·pya·ku',
      'na·na·hya·ku',
      'hap·pya·ku',
      'kyu·u·hya·ku',
    ];
    k += huKana[hu];
    r += (r ? '·' : '') + huRomaji[hu];
  }

  // 3. 十位 (Tens)
  // 10=juu (不是 ichi-juu), 20=ni-juu
  if (te > 0) {
    const teKana = [
      '',
      'じゅう',
      'にじゅう',
      'さんじゅう',
      'よんじゅう',
      'ごじゅう',
      'ろくじゅう',
      'ななじゅう',
      'はちじゅう',
      'きゅうじゅう',
    ];
    const teRomaji = [
      '',
      'ju·u',
      'ni·ju·u',
      'san·ju·u',
      'yon·ju·u',
      'go·ju·u',
      'ro·ku·ju·u',
      'na·na·ju·u',
      'ha·chi·ju·u',
      'kyu·u·ju·u',
    ];
    k += teKana[te];
    r += (r ? '·' : '') + teRomaji[te];
  }

  // 4. 个位 (Units) + 年 (Nen)
  // ⚠️ 特殊规则：4=yo-nen, 7=shichi-nen, 9=ku-nen
  const unKana = [
    'ぜろ',
    'いち',
    'に',
    'さん',
    'よ',
    'ご',
    'ろく',
    'しち',
    'はち',
    'く',
  ];
  const unRomaji = [
    'ze·ro',
    'i·chi',
    'ni',
    'san',
    'yo',
    'go',
    'ro·ku',
    'shi·chi',
    'ha·chi',
    'ku',
  ];

  if (un === 0) {
    // 结尾是0，例如 2020，十位已经读了 juu，这里直接加 nen
    k += 'ねん';
    r += '·nen';
  } else {
    k += unKana[un] + 'ねん';
    r += (r ? '·' : '') + unRomaji[un] + '·nen';
  }

  return { kana: k, romaji: r };
};
