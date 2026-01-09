// src/pages/TestStudySession/kana-data/hiragana-yoon.ts

import { defineHYoon, type HiraganaYoon } from '../core';

export const HIRAGANA_YOON: Record<string, HiraganaYoon> = {
  // ==========================================
  // K- 行 (Kya, Kyu, Kyo)
  // ==========================================
  きゃ: defineHYoon({
    id: 'h-yoon-kya',
    kana: 'きゃ',
    romaji: 'kya',
    kanaKanjiOrigin: 'き (ki) + ゃ (ya)',
    kanaDistractors: ['きや', 'ぎゃ', 'くゃ', 'きゅ'],
    romajiDistractors: ['kiya', 'kay', 'kyo', 'ka'],
    word: 'お客さん',
    wordKana: 'おきゃくさん',
    wordRomaji: 'o·kya·ku·sa·n',
    wordMeaning: { en: 'Guest', zh: '客人', zhHant: '客人' },
    wordEmoji: '👥',
    wordDistractors: ['おきやくさん', 'おかっくさん', 'おぎゃくさん'],
  }),

  きゅ: defineHYoon({
    id: 'h-yoon-kyu',
    kana: 'きゅ',
    romaji: 'kyu',
    kanaKanjiOrigin: 'き (ki) + ゅ (yu)',
    kanaDistractors: ['きゆ', 'ぎゅ', 'くゅ', 'きゃ'],
    romajiDistractors: ['kiyu', 'ku', 'kyo', 'kyou'],
    word: '救急車',
    wordKana: 'きゅうきゅうしゃ',
    wordRomaji: 'kyu·u·kyu·u·sha',
    wordMeaning: { en: 'Ambulance', zh: '救护车', zhHant: '救護車' },
    wordEmoji: '🚑',
    wordDistractors: ['きゆきゆしゃ', 'きゅきゅしゃ', 'くうくうしゃ'],
  }),

  きょ: defineHYoon({
    id: 'h-yoon-kyo',
    kana: 'きょ',
    romaji: 'kyo',
    kanaKanjiOrigin: 'き (ki) + ょ (yo)',
    kanaDistractors: ['きよ', 'ぎょ', 'こょ', 'きゅ'],
    romajiDistractors: ['kiyo', 'ko', 'kya', 'kyou'],
    word: '教科書',
    wordKana: 'きょうかしょ',
    wordRomaji: 'kyo·u·ka·sho',
    wordMeaning: { en: 'Textbook', zh: '教科书', zhHant: '教科書' },
    wordEmoji: '📚',
    wordDistractors: ['きよかしょ', 'きょかしょ', 'こうかしょ'],
  }),

  // ==========================================
  // S- 行 (Sha, Shu, Sho)
  // ==========================================
  しゃ: defineHYoon({
    id: 'h-yoon-sha',
    kana: 'しゃ',
    romaji: 'sha',
    kanaKanjiOrigin: 'し (shi) + ゃ (ya)',
    kanaDistractors: ['しや', 'じゃ', 'さ', 'しゅ'],
    romajiDistractors: ['shiya', 'sa', 'sho', 'shya'],
    word: '写真',
    wordKana: 'しゃしん',
    wordRomaji: 'sha·shi·n',
    wordMeaning: { en: 'Photo', zh: '照片', zhHant: '照片' },
    wordEmoji: '📷',
    wordDistractors: ['しやしん', 'さしん', 'じゃしん'],
  }),

  しゅ: defineHYoon({
    id: 'h-yoon-shu',
    kana: 'しゅ',
    romaji: 'shu',
    kanaKanjiOrigin: 'し (shi) + ゅ (yu)',
    kanaDistractors: ['しゆ', 'じゅ', 'す', 'しょ'],
    romajiDistractors: ['shiyu', 'su', 'sho', 'shyu'],
    word: '趣味',
    wordKana: 'しゅみ',
    wordRomaji: 'shu·mi',
    wordMeaning: { en: 'Hobby', zh: '爱好', zhHant: '愛好' },
    wordEmoji: '🎨',
    wordDistractors: ['しゆみ', 'すみ', 'じゅみ'],
  }),

  しょ: defineHYoon({
    id: 'h-yoon-sho',
    kana: 'しょ',
    romaji: 'sho',
    kanaKanjiOrigin: 'し (shi) + ょ (yo)',
    kanaDistractors: ['しよ', 'じょ', 'そ', 'しゃ'],
    romajiDistractors: ['shiyo', 'so', 'shu', 'shou'],
    word: '辞書',
    wordKana: 'じしょ',
    wordRomaji: 'ji·sho',
    wordMeaning: { en: 'Dictionary', zh: '词典', zhHant: '辭典' },
    wordEmoji: '📖',
    wordDistractors: ['じしよ', 'じそ', 'ぢしょ'],
  }),

  // ==========================================
  // C- 行 (Cha, Chu, Cho)
  // ==========================================
  ちゃ: defineHYoon({
    id: 'h-yoon-cha',
    kana: 'ちゃ',
    romaji: 'cha',
    kanaKanjiOrigin: 'ち (chi) + ゃ (ya)',
    kanaDistractors: ['ちや', 'ぢゃ', 'た', 'ちゅ'],
    romajiDistractors: ['chiya', 'tya', 'cho', 'che'],
    word: 'お茶',
    wordKana: 'おちゃ',
    wordRomaji: 'o·cha',
    wordMeaning: { en: 'Tea', zh: '茶', zhHant: '茶' },
    wordEmoji: '🍵',
    wordDistractors: ['おちや', 'おつゃ', 'おた'],
  }),

  ちゅ: defineHYoon({
    id: 'h-yoon-chu',
    kana: 'ちゅ',
    romaji: 'chu',
    kanaKanjiOrigin: 'ち (chi) + ゅ (yu)',
    kanaDistractors: ['ちゆ', 'つ', 'ちょ', 'ちゃ'],
    romajiDistractors: ['chiyu', 'tsu', 'cho', 'cha'],
    word: '注意',
    wordKana: 'ちゅうい',
    wordRomaji: 'chu·u·i',
    wordMeaning: { en: 'Caution', zh: '注意', zhHant: '注意' },
    wordEmoji: '⚠️',
    wordDistractors: ['ちゆい', 'つうい', 'ちょい'],
  }),

  ちょ: defineHYoon({
    id: 'h-yoon-cho',
    kana: 'ちょ',
    romaji: 'cho',
    kanaKanjiOrigin: 'ち (chi) + ょ (yo)',
    kanaDistractors: ['ちよ', 'ぢょ', 'と', 'ちゃ'],
    romajiDistractors: ['chiyo', 'tyo', 'chu', 'chou'],
    word: '蝶々',
    wordKana: 'ちょうちょう',
    wordRomaji: 'cho·u·cho·u',
    wordMeaning: { en: 'Butterfly', zh: '蝴蝶', zhHant: '蝴蝶' },
    wordEmoji: '🦋',
    wordDistractors: ['ちよちよ', 'ちょちょ', 'ちゅうちゅう'],
  }),

  // ==========================================
  // N- 行 (Nya, Nyu, Nyo)
  // ==========================================
  にゃ: defineHYoon({
    id: 'h-yoon-nya',
    kana: 'にゃ',
    romaji: 'nya',
    kanaKanjiOrigin: 'に (ni) + ゃ (ya)',
    kanaDistractors: ['にや', 'ぬ', 'な', 'にゅ'],
    romajiDistractors: ['niya', 'na', 'nu', 'nyo'],
    word: 'こんにゃく',
    wordKana: 'こんにゃく',
    wordRomaji: 'ko·n·nya·ku',
    wordMeaning: { en: 'Konjac', zh: '魔芋', zhHant: '魔芋' },
    wordEmoji: '🍢',
    wordDistractors: ['こんにやく', 'こんなく', 'こんやく'],
  }),

  にゅ: defineHYoon({
    id: 'h-yoon-nyu',
    kana: 'にゅ',
    romaji: 'nyu',
    kanaKanjiOrigin: 'に (ni) + ゅ (yu)',
    kanaDistractors: ['にゆ', 'ぬ', 'にょ', 'にゃ'],
    romajiDistractors: ['niyu', 'nu', 'nyo', 'nya'],
    word: '牛乳',
    wordKana: 'ぎゅうにゅう',
    wordRomaji: 'gyu·u·nyu·u',
    wordMeaning: { en: 'Milk', zh: '牛奶', zhHant: '牛奶' },
    wordEmoji: '🥛',
    wordDistractors: ['ぎゆうにゆう', 'ぎゅにゅ', 'ぎゅうぬう'],
  }),

  にょ: defineHYoon({
    id: 'h-yoon-nyo',
    kana: 'にょ',
    romaji: 'nyo',
    kanaKanjiOrigin: 'に (ni) + ょ (yo)',
    kanaDistractors: ['によ', 'の', 'にゃ', 'にゅ'],
    romajiDistractors: ['niyo', 'no', 'nya', 'nyu'],
    word: '女房',
    wordKana: 'にょうぼう',
    wordRomaji: 'nyo·u·bo·u',
    wordMeaning: { en: 'Wife', zh: '妻子', zhHant: '妻子' },
    wordEmoji: '👩',
    wordDistractors: ['によぼう', 'にょぼ', 'のうぼう'],
  }),

  // ==========================================
  // H- 行 (Hya, Hyu, Hyo)
  // ==========================================
  ひゃ: defineHYoon({
    id: 'h-yoon-hya',
    kana: 'ひゃ',
    romaji: 'hya',
    kanaKanjiOrigin: 'ひ (hi) + ゃ (ya)',
    kanaDistractors: ['ひや', 'びゃ', 'ぴゃ', 'ひゅ'],
    romajiDistractors: ['hiya', 'hyaa', 'hyo', 'ha'],
    word: '百',
    wordKana: 'ひゃく',
    wordRomaji: 'hya·ku',
    wordMeaning: { en: 'Hundred', zh: '百', zhHant: '百' },
    wordEmoji: '💯',
    wordDistractors: ['ひやく', 'はく', 'びゃく'],
  }),

  ひゅ: defineHYoon({
    id: 'h-yoon-hyu',
    kana: 'ひゅ',
    romaji: 'hyu',
    kanaKanjiOrigin: 'ひ (hi) + ゅ (yu)',
    kanaDistractors: ['ひゆ', 'ふ', 'ひょ', 'ひゃ'],
    romajiDistractors: ['hiyu', 'hu', 'hyo', 'hya'],

    // 词非常少。只有拟声词
    // word: 'ヒューヒュー',
    // wordKana: 'ひゅーひゅー',
    // wordRomaji: 'hyu·u·hyu·u',
    // wordMeaning: {
    //   en: 'Whistling sound',
    //   zh: '呼呼声(风)',
    //   zhHant: '呼呼聲(風)',
    // },
    // wordEmoji: '🌬️',
    // wordDistractors: ['ひゆひゆ', 'ふうふう', 'ひよひよ'],
  }),

  ひょ: defineHYoon({
    id: 'h-yoon-hyo',
    kana: 'ひょ',
    romaji: 'hyo',
    kanaKanjiOrigin: 'ひ (hi) + ょ (yo)',
    kanaDistractors: ['ひよ', 'ほ', 'ひゃ', 'ひゅ'],
    romajiDistractors: ['hiyo', 'ho', 'hya', 'hyu'],
    word: 'ひょう',
    wordKana: 'ひょう',
    wordRomaji: 'hyo·u',
    wordMeaning: { en: 'Hail / Leopard', zh: '豹 / 冰雹', zhHant: '豹 / 冰雹' },
    wordEmoji: '🐆',
    wordDistractors: ['ひよう', 'ほお', 'ひよ'],
  }),

  // ==========================================
  // M- 行 (Mya, Myu, Myo)
  // ==========================================
  みゃ: defineHYoon({
    id: 'h-yoon-mya',
    kana: 'みゃ',
    romaji: 'mya',
    kanaKanjiOrigin: 'み (mi) + ゃ (ya)',
    kanaDistractors: ['みや', 'ま', 'みゅ', 'みょ'],
    romajiDistractors: ['miya', 'ma', 'myu', 'myo'],
    word: '脈',
    wordKana: 'みゃく',
    wordRomaji: 'mya·ku',
    wordMeaning: { en: 'Pulse', zh: '脉搏', zhHant: '脈搏' },
    wordEmoji: '💓',
    wordDistractors: ['みやく', 'まく', 'むゃく'],
  }),

  みゅ: defineHYoon({
    id: 'h-yoon-myu',
    kana: 'みゅ',
    romaji: 'myu',
    kanaKanjiOrigin: 'み (mi) + ゅ (yu)',
    kanaDistractors: ['みゆ', 'む', 'みょ', 'みゃ'],
    romajiDistractors: ['miyu', 'mu', 'myo', 'mya'],
    // 拟声词，因为 Myu 平假名原词极少
    // wordKana: 'みゅう',
    // wordRomaji: 'myu·u',
    // wordMeaning: { en: 'Meow (Sound)', zh: '喵 (拟声)', zhHant: '喵 (擬聲)' },
    // wordEmoji: '🐱',
    // wordDistractors: ['みゆう', 'むう', 'みよ'],
  }),

  みょ: defineHYoon({
    id: 'h-yoon-myo',
    kana: 'みょ',
    romaji: 'myo',
    kanaKanjiOrigin: 'み (mi) + ょ (yo)',
    kanaDistractors: ['みよ', 'も', 'みゃ', 'みゅ'],
    romajiDistractors: ['miyo', 'mo', 'mya', 'myu'],
    word: '名字',
    wordKana: 'みょうじ',
    wordRomaji: 'myo·u·ji',
    wordMeaning: { en: 'Surname', zh: '姓氏', zhHant: '姓氏' },
    wordEmoji: '📛',
    wordDistractors: ['みようじ', 'もじ', 'みょじ'],
  }),

  // ==========================================
  // R- 行 (Rya, Ryu, Ryo)
  // ==========================================
  りゃ: defineHYoon({
    id: 'h-yoon-rya',
    kana: 'りゃ',
    romaji: 'rya',
    kanaKanjiOrigin: 'り (ri) + ゃ (ya)',
    kanaDistractors: ['りや', 'ら', 'りゅ', 'りょ'],
    romajiDistractors: ['riya', 'ra', 'ryu', 'ryo'],
    word: '略',
    wordKana: 'りゃく',
    wordRomaji: 'rya·ku',
    wordMeaning: { en: 'Abbreviation', zh: '省略', zhHant: '省略' },
    wordEmoji: '✂️',
    wordDistractors: ['りやく', 'らく', 'りょく'],
  }),

  りゅ: defineHYoon({
    id: 'h-yoon-ryu',
    kana: 'りゅ',
    romaji: 'ryu',
    kanaKanjiOrigin: 'り (ri) + ゅ (yu)',
    kanaDistractors: ['りゆ', 'る', 'りょ', 'りゃ'],
    romajiDistractors: ['riyu', 'ru', 'ryo', 'rya'],
    word: '龍',
    wordKana: 'りゅう',
    wordRomaji: 'ryu·u',
    wordMeaning: { en: 'Dragon', zh: '龙', zhHant: '龍' },
    wordEmoji: '🐉',
    wordDistractors: ['りゆう', 'るう', 'りょ'],
  }),

  りょ: defineHYoon({
    id: 'h-yoon-ryo',
    kana: 'りょ',
    romaji: 'ryo',
    kanaKanjiOrigin: 'り (ri) + ょ (yo)',
    kanaDistractors: ['りよ', 'ろ', 'りゃ', 'りゅ'],
    romajiDistractors: ['riyo', 'ro', 'ryu', 'rya'],
    word: '料理',
    wordKana: 'りょうり',
    wordRomaji: 'ryo·u·ri',
    wordMeaning: { en: 'Cooking', zh: '料理', zhHant: '料理' },
    wordEmoji: '🍳',
    wordDistractors: ['りより', 'ろり', 'りょり'],
  }),

  // ==========================================
  // G- 行 (Gya, Gyu, Gyo)
  // ==========================================
  ぎゃ: defineHYoon({
    id: 'h-yoon-gya',
    kana: 'ぎゃ',
    romaji: 'gya',
    kanaKanjiOrigin: 'ぎ (gi) + ゃ (ya)',
    kanaDistractors: ['ぎや', 'きゃ', 'じゃ', 'ぎゅ'],
    romajiDistractors: ['giya', 'kya', 'ja', 'gyo'],
    word: '逆',
    wordKana: 'ぎゃく',
    wordRomaji: 'gya·ku',
    wordMeaning: { en: 'Reverse', zh: '逆 / 相反', zhHant: '逆 / 相反' },
    wordEmoji: '🔄',
    wordDistractors: ['ぎやく', 'がく', 'きゃく'],
  }),

  ぎゅ: defineHYoon({
    id: 'h-yoon-gyu',
    kana: 'ぎゅ',
    romaji: 'gyu',
    kanaKanjiOrigin: 'ぎ (gi) + ゅ (yu)',
    kanaDistractors: ['ぎゆ', 'ぐ', 'ぎょ', 'ぎゃ'],
    romajiDistractors: ['giyu', 'gu', 'gyo', 'gya'],
    word: '牛丼',
    wordKana: 'ぎゅうどん',
    wordRomaji: 'gyu·u·do·n',
    wordMeaning: { en: 'Beef bowl', zh: '牛肉盖饭', zhHant: '牛肉蓋飯' },
    wordEmoji: '🍲',
    wordDistractors: ['ぎゆうどん', 'ぐどん', 'ぎゅどん'],
  }),

  ぎょ: defineHYoon({
    id: 'h-yoon-gyo',
    kana: 'ぎょ',
    romaji: 'gyo',
    kanaKanjiOrigin: 'ぎ (gi) + ょ (yo)',
    kanaDistractors: ['ぎよ', 'ご', 'ぎゃ', 'ぎゅ'],
    romajiDistractors: ['giyo', 'go', 'gya', 'gyu'],
    word: '金魚',
    wordKana: 'きんぎょ',
    wordRomaji: 'ki·n·gyo',
    wordMeaning: { en: 'Goldfish', zh: '金鱼', zhHant: '金魚' },
    wordEmoji: '🐠',
    wordDistractors: ['きんぎよ', 'きんご', 'きんぎゃ'],
  }),

  // ==========================================
  // J- 行 (Ja, Ju, Jo)
  // ==========================================
  じゃ: defineHYoon({
    id: 'h-yoon-ja',
    kana: 'じゃ',
    romaji: 'ja',
    kanaKanjiOrigin: 'じ (ji) + ゃ (ya)',
    kanaDistractors: ['じや', 'しゃ', 'ざ', 'じゅ'],
    romajiDistractors: ['jiya', 'sha', 'za', 'jo'],
    word: '邪魔',
    wordKana: 'じゃま',
    wordRomaji: 'ja·ma',
    wordMeaning: { en: 'Disturbance', zh: '打扰', zhHant: '打擾' },
    wordEmoji: '🚧',
    wordDistractors: ['じやま', 'ざま', 'しゃま'],
  }),

  じゅ: defineHYoon({
    id: 'h-yoon-ju',
    kana: 'じゅ',
    romaji: 'ju',
    kanaKanjiOrigin: 'じ (ji) + ゅ (yu)',
    kanaDistractors: ['じゆ', 'ず', 'じょ', 'じゃ'],
    romajiDistractors: ['jiyu', 'zu', 'jo', 'ja'],
    word: '住所',
    wordKana: 'じゅうしょ',
    wordRomaji: 'ju·u·sho',
    wordMeaning: { en: 'Address', zh: '地址', zhHant: '地址' },
    wordEmoji: '🏠',
    wordDistractors: ['じゆうしょ', 'ずしょ', 'じゅしょ'],
  }),

  じょ: defineHYoon({
    id: 'h-yoon-jo',
    kana: 'じょ',
    romaji: 'jo',
    kanaKanjiOrigin: 'じ (ji) + ょ (yo)',
    kanaDistractors: ['じよ', 'ぞ', 'じゃ', 'じゅ'],
    romajiDistractors: ['jiyo', 'zo', 'ja', 'ju'],
    word: '上手',
    wordKana: 'じょうず',
    wordRomaji: 'jo·u·zu',
    wordMeaning: { en: 'Skillful', zh: '擅长', zhHant: '擅長' },
    wordEmoji: '👍',
    wordDistractors: ['じようず', 'ぞうず', 'じょず'],
  }),

  // ==========================================
  // B- 行 (Bya, Byu, Byo)
  // ==========================================
  びゃ: defineHYoon({
    id: 'h-yoon-bya',
    kana: 'びゃ',
    romaji: 'bya',
    kanaKanjiOrigin: 'び (bi) + ゃ (ya)',
    kanaDistractors: ['びや', 'ぴゃ', 'ば', 'びゅ'],
    romajiDistractors: ['biya', 'pya', 'ba', 'byu'],
    word: '三百',
    wordKana: 'さんびゃく',
    wordRomaji: 'sa·n·bya·ku',
    wordMeaning: { en: 'Three hundred', zh: '三百', zhHant: '三百' },
    wordEmoji: '3️⃣0️⃣0️⃣',
    wordDistractors: ['さんびやく', 'さんばく', 'さんびゃ'],
  }),

  びゅ: defineHYoon({
    id: 'h-yoon-byu',
    kana: 'びゅ',
    romaji: 'byu',
    kanaKanjiOrigin: 'び (bi) + ゅ (yu)',
    kanaDistractors: ['びゆ', 'ぶ', 'びょ', 'びゃ'],
    romajiDistractors: ['biyu', 'bu', 'byo', 'bya'],
    // 拟声词
    // word: 'びゅんびゅん',
    // wordKana: 'びゅんびゅん',
    // wordRomaji: 'byu·n·byu·n',
    // wordMeaning: {
    //   en: 'Whiz / Zoom',
    //   zh: '嗖嗖声(速度)',
    //   zhHant: '嗖嗖聲(速度)',
    // },
    // wordEmoji: '🏎️',
    // wordDistractors: ['びゆんびゆん', 'ぶんぶん', 'びょんびょん'],
  }),

  びょ: defineHYoon({
    id: 'h-yoon-byo',
    kana: 'びょ',
    romaji: 'byo',
    kanaKanjiOrigin: 'び (bi) + ょ (yo)',
    kanaDistractors: ['びよ', 'ぴょ', 'ぼ', 'びゃ'],
    romajiDistractors: ['biyo', 'pyo', 'bo', 'bya'],
    word: '病院',
    wordKana: 'びょういん',
    wordRomaji: 'byo·u·i·n',
    wordMeaning: { en: 'Hospital', zh: '医院', zhHant: '醫院' },
    wordEmoji: '🏥',
    wordDistractors: ['びよいん', 'ぼういん', 'びょいん'],
  }),

  // ==========================================
  // P- 行 (Pya, Pyu, Pyo)
  // ==========================================
  ぴゃ: defineHYoon({
    id: 'h-yoon-pya',
    kana: 'ぴゃ',
    romaji: 'pya',
    kanaKanjiOrigin: 'ぴ (pi) + ゃ (ya)',
    kanaDistractors: ['ぴや', 'びゃ', 'ぱ', 'ぴゅ'],
    romajiDistractors: ['piya', 'bya', 'pa', 'pyu'],
    word: '八百',
    wordKana: 'はっぴゃく',
    wordRomaji: 'ha·ppya·ku',
    wordMeaning: { en: 'Eight hundred', zh: '八百', zhHant: '八百' },
    wordEmoji: '8️⃣0️⃣0️⃣',
    wordDistractors: ['はっぴやく', 'はっぱく', 'はっぴょく'],
  }),

  ぴゅ: defineHYoon({
    id: 'h-yoon-pyu',
    kana: 'ぴゅ',
    romaji: 'pyu',
    kanaKanjiOrigin: 'ぴ (pi) + ゅ (yu)',
    kanaDistractors: ['ぴゆ', 'ぷ', 'ぴょ', 'ぴゃ'],
    romajiDistractors: ['piyu', 'pu', 'pyo', 'pya'],
    // 没有词汇，除了拟声词
    // word: 'ぴゅーぴゅー',
    // wordKana: 'ぴゅーぴゅー',
    // wordRomaji: 'pyu·u·pyu·u',
    // wordMeaning: {
    //   en: 'Whistling wind',
    //   zh: '呼呼的风声',
    //   zhHant: '呼呼的風聲',
    // },
    // wordEmoji: '🍃',
    // wordDistractors: ['ぴゆぴゆ', 'ぷうぷう', 'ぴょぴょ'],
  }),

  ぴょ: defineHYoon({
    id: 'h-yoon-pyo',
    kana: 'ぴょ',
    romaji: 'pyo',
    kanaKanjiOrigin: 'ぴ (pi) + ょ (yo)',
    kanaDistractors: ['ぴよ', 'びょ', 'ぽ', 'ぴゃ'],
    romajiDistractors: ['piyo', 'byo', 'po', 'pya'],
    word: '発表',
    wordKana: 'はっぴょう',
    wordRomaji: 'ha·ppyo·u',
    wordMeaning: { en: 'Presentation', zh: '发表', zhHant: '發表' },
    wordEmoji: '📢',
    wordDistractors: ['はっぴよ', 'はっぴょ', 'はっぼう'],
  }),
};
