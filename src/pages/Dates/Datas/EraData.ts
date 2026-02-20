// src/pages/Dates/Datas/EraData.ts

export interface EraItem {
  key: string;
  kanji: string; // '令和'
  kana: string; // 'れいわ'
  romaji: string; // 're·i·wa'
  startYear: number; // 2019
  endYear: number | null; // null = current / ongoing
  totalYears: number | null;
  /** Meaning of each character in the era name */
  charMeaning: { zh: string; en: string };
  /** Literary source of the era name */
  source: {
    title: string; // '万葉集'
    titleKana: string; // 'まんようしゅう'
    zh: string;
    en: string;
  };
  /** Short cultural description */
  culturalNote: { zh: string; en: string };
  /** Visual theme (matches holiday-card palette convention) */
  theme: { bg: string; accent: string; sub: string; divider: string };
}

export const ERAS_DATA: EraItem[] = [
  // ─── 明治 ───────────────────────────────────────────────────────────────
  {
    key: 'meiji',
    kanji: '明治',
    kana: 'めいじ',
    romaji: 'me·i·ji',
    startYear: 1868,
    endYear: 1912,
    totalYears: 45,
    charMeaning: {
      zh: '明（めい）＝ 光明・英明\n治（じ）＝ 治める・統治する',
      en: 'Mei (明) = bright, enlightened\nJi (治) = govern, rule',
    },
    source: {
      title: '易経',
      titleKana: 'えききょう',
      zh: '出处：中国古典《易经》说卦传。原文"向明而治"（面向光明而治理天下），取"明"与"治"二字。',
      en: 'Source: I Ching (易経 — Yijing), a Chinese classic. From the Shuogua Zhuan section: "向明而治" — "to govern by facing toward the light." Characters 明 and 治 were taken from this phrase.',
    },
    culturalNote: {
      zh: '明治时代（1868–1912）是日本从封建幕府制度向近代中央集权国家急速转型的时代。"明治维新"打破了江户时代的闭关锁国，大规模引进西方科技、制度与文化，日本在约40年内完成了工业化，跃升为亚洲强国。',
      en: 'The Meiji era (1868–1912) transformed Japan from a feudal shogunate into a modern nation-state. The Meiji Restoration ended centuries of isolation, rapidly importing Western technology and institutions — industrializing within a generation.',
    },
    theme: {
      bg: '#FFF1F2',
      accent: '#BE123C',
      sub: '#9F1239',
      divider: '#FECDD3',
    },
  },

  // ─── 大正 ───────────────────────────────────────────────────────────────
  {
    key: 'taisho',
    kanji: '大正',
    kana: 'たいしょう',
    romaji: 'ta·i·sho·u',
    startYear: 1912,
    endYear: 1926,
    totalYears: 15,
    charMeaning: {
      zh: '大（たい）＝ 偉大・盛大\n正（しょう）＝ 正しい・正義',
      en: 'Tai (大) = great, grand\nShō (正) = righteous, correct',
    },
    source: {
      title: '易経',
      titleKana: 'えききょう',
      zh: '出处：中国古典《易经》临卦彖传。原文"大亨以正，天之道也"（大道亨通，以正为本，此乃天道），取"大"与"正"二字。',
      en: 'Source: I Ching (易経 — Yijing), a Chinese classic. From the Lin hexagram commentary: "大亨以正，天之道也" — "great success through righteousness — this is the way of Heaven." Characters 大 and 正 were taken from this phrase.',
    },
    culturalNote: {
      zh: '大正时代（1912–1926）虽只有短短15年，却是日本文化最为璀璨的时期之一。"大正民主"运动兴起，自由主义与民权思想盛行；文学、美术、音乐蓬勃发展，西洋文化与日本传统深度融合，留下了独特的"大正浪漫"风格。',
      en: 'Though brief (1912–1926), the Taisho era was culturally vibrant. The "Taisho Democracy" championed liberal and civil rights ideals, while literature and arts flourished in a blend of Western and Japanese tradition — leaving behind the distinctive "Taisho Romantic" aesthetic.',
    },
    theme: {
      bg: '#F0FDF4',
      accent: '#166534',
      sub: '#14532D',
      divider: '#BBF7D0',
    },
  },

  // ─── 昭和 ───────────────────────────────────────────────────────────────
  {
    key: 'showa',
    kanji: '昭和',
    kana: 'しょうわ',
    romaji: 'sho·u·wa',
    startYear: 1926,
    endYear: 1989,
    totalYears: 64,
    charMeaning: {
      zh: '昭（しょう）＝ 輝く・照らす\n和（わ）＝ 和む・平和・日本',
      en: 'Shō (昭) = illuminate, radiant\nWa (和) = harmony, peace, Japan',
    },
    source: {
      title: '書経',
      titleKana: 'しょきょう',
      zh: '出处：中国古典《书经》尧典。原文"百姓昭明，协和万邦"（使万民蒙受光明，使万国协调共处），取"昭"与"和"二字。',
      en: 'Source: Shujing (書経 — Book of Documents), a Chinese classic. From the Yao Dian chapter: "百姓昭明，協和万邦" — "illuminate all people; bring all nations into harmony." Characters 昭 and 和 were taken from this phrase.',
    },
    culturalNote: {
      zh: '昭和时代（1926–1989）长达64年，是近代日本最漫长的年号。这64年跨越了太平洋战争与战败、战后废墟中的重建，以及创造"经济奇迹"跻身世界第二大经济体的辉煌历程。昭和的故事，是一个民族从谷底重新站立的史诗。',
      en: "The Showa era (1926–1989) spanned 64 years — Japan's longest modern era. It witnessed WWII, devastating defeat, postwar reconstruction from ruins, and an astonishing economic miracle that made Japan the world's second-largest economy. Showa is the story of a nation rising from the abyss.",
    },
    theme: {
      bg: '#FFFBEB',
      accent: '#B45309',
      sub: '#78350F',
      divider: '#FDE68A',
    },
  },

  // ─── 平成 ───────────────────────────────────────────────────────────────
  {
    key: 'heisei',
    kanji: '平成',
    kana: 'へいせい',
    romaji: 'he·i·se·i',
    startYear: 1989,
    endYear: 2019,
    totalYears: 31,
    charMeaning: {
      zh: '平（へい）＝ 平穏・太平\n成（せい）＝ 成し遂げる・達成',
      en: 'Hei (平) = peaceful, calm\nSei (成) = achieve, accomplish',
    },
    source: {
      title: '史記・書経',
      titleKana: 'しき・しょきょう',
      zh: '出处：中国古典《史记》五帝本纪"内平外成"与《书经》虞书"地平天成"，取"平"（内外和平）与"成"（天地成就）二字。',
      en: 'Sources: Shiji (史記 — Records of the Grand Historian) and Shujing (書経 — Book of Documents), both Chinese classics. From "内平外成" ("peace within, success without") and "地平天成" ("earth level, heaven complete"). Characters 平 and 成 were taken from these phrases.',
    },
    culturalNote: {
      zh: '平成时代（1989–2019）始于昭和天皇驾崩与冷战终结。这31年见证了日本泡沫经济的崩溃、阪神大震灾、东日本大震灾，以及互联网与手机的普及。平成天皇（明仁）于2019年4月30日主动退位，成为日本近现代史极为罕见的皇位传承。',
      en: "The Heisei era (1989–2019) began with Emperor Shōwa's death and the Cold War's end. Japan experienced the bubble economy's collapse, the Hanshin and 3/11 earthquakes, and the rise of the internet age. Emperor Akihito's voluntary abdication on April 30, 2019 was a historic first.",
    },
    theme: {
      bg: '#EFF6FF',
      accent: '#1D4ED8',
      sub: '#1E3A8A',
      divider: '#BFDBFE',
    },
  },

  // ─── 令和 ───────────────────────────────────────────────────────────────
  {
    key: 'reiwa',
    kanji: '令和',
    kana: 'れいわ',
    romaji: 're·i·wa',
    startYear: 2019,
    endYear: null,
    totalYears: null,
    charMeaning: {
      zh: '令（れい）＝ 良い・美しい（令月＝良い月）\n和（わ）＝ 和やか・平和・日本',
      en: 'Rei (令) = good, beautiful (令月 = a good/auspicious month)\nWa (和) = harmony, peace, Japan',
    },
    source: {
      title: '万葉集',
      titleKana: 'まんようしゅう',
      zh: '出处：日本古典诗歌集《万叶集》卷五《梅花歌》序文"初春令月，气淑风和"（初春佳月，气清风和），取"令"与"和"二字。这是日本史上首次从本国古典中取字命名年号，打破了沿用中国古典达1300年之久的惯例。',
      en: 'Source: Man\'yōshū (万葉集), an 8th-century Japanese poetry anthology. From the Plum Blossom preface: "初春令月、気淑風和" — "in the good month of early spring, the air is pure and the wind is gentle." Characters 令 and 和 were taken from this phrase. This is the first era name drawn from a Japanese classic, breaking 1,300 years of using Chinese texts.',
    },
    culturalNote: {
      zh: '令和元年（2019年5月1日），德仁天皇即位，日本迎来新时代。"令和"蕴含"美好和谐"之意，也体现了日本对本国古典文化的自信与回归。令和是日本目前的年号。',
      en: 'Emperor Naruhito ascended on May 1, 2019 (Reiwa 1). The name embodies "beautiful harmony" and reflects renewed confidence in Japan\'s own classical heritage. Reiwa is the current era — its story is still being written.',
    },
    theme: {
      bg: '#F5F0FF',
      accent: '#7C3AED',
      sub: '#5B21B6',
      divider: '#DDD6FE',
    },
  },
];

export const getEraItem = (key: string): EraItem | undefined =>
  ERAS_DATA.find((e) => e.key === key);

/**
 * Returns kana + romaji for a duration like "15年間"
 * e.g. getYearsKana(15) → { kana: 'じゅうごねんかん', romaji: 'ju·u·go·nen·kan' }
 */
export const getYearsKana = (
  years: number
): { kana: string; romaji: string } => {
  const tens = Math.floor(years / 10);
  const units = years % 10;

  const tensKana = [
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
  const tensRomaji = [
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

  // Before ねん: 4=よ, 7=しち, 9=く (standard year-counting)
  const unitsKana = [
    '',
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
  const unitsRomaji = [
    '',
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

  let k = '';
  let r = '';

  if (tens > 0) {
    k += tensKana[tens];
    r += tensRomaji[tens];
  }
  if (units > 0) {
    k += unitsKana[units];
    r += (r ? '·' : '') + unitsRomaji[units];
  }

  return { kana: k + 'ねんかん', romaji: r + '·nen·kan' };
};
