// 片假名拗音 (Katakana Yoon)
// 拗音主要用于外来语的音译

import { defineKYoon, type KatakanaYoon } from '../core';

export const KATAKANA_YOON: Record<string, KatakanaYoon> = {
  // ==========================================
  // キャ 行 (Kya, Kyu, Kyo)
  // ==========================================
  キャ: defineKYoon({
    id: 'k-yoon-kya',
    kana: 'キャ',
    romaji: 'kya',
    kanaKanjiOrigin: 'キ (ki) + ャ (ya)',
    kanaDistractors: ['キヤ', 'ギャ', 'キュ', 'カ'],
    romajiDistractors: ['kiya', 'gya', 'kyu', 'ka'],

    word: 'キャンプ',
    wordRomaji: 'kya·n·pu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Camp',
      desc: '',
    },
    wordMeaning: { en: 'Camping', zh: '露营', zhHant: '露營' },
    wordEmoji: '⛺',
    wordDistractors: ['キヤンプ', 'ギャンプ', 'キャプン'],
  }),

  キュ: defineKYoon({
    id: 'k-yoon-kyu',
    kana: 'キュ',
    romaji: 'kyu',
    kanaKanjiOrigin: 'キ (ki) + ュ (yu)',
    kanaDistractors: ['キユ', 'ギュ', 'キョ', 'ク'],
    romajiDistractors: ['kiyu', 'gyu', 'kyo', 'ku'],

    word: 'レスキュー',
    wordRomaji: 're·su·kyu·u',
    wordOrigin: {
      lang: 'en-US',
      word: 'Rescue',
      desc: '',
    },
    wordMeaning: { en: 'Rescue', zh: '救援', zhHant: '救援' },
    wordEmoji: '🚁',
    wordDistractors: ['レスキユー', 'レスギュー', 'レスキュ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  キョ: defineKYoon({
    id: 'k-yoon-kyo',
    kana: 'キョ',
    romaji: 'kyo',
    kanaKanjiOrigin: 'キ (ki) + ョ (yo)',
    kanaDistractors: ['キヨ', 'ギョ', 'キャ', 'コ'],
    romajiDistractors: ['kiyo', 'gyo', 'kya', 'ko'],

    word: 'トーキョー',
    wordRomaji: 'to·o·kyo·o',
    wordOrigin: {
      lang: 'ja',
      word: '東京',
      desc: '',
    },
    wordMeaning: { en: 'Tokyo', zh: '东京', zhHant: '東京' },
    wordEmoji: '🗼',
    wordDistractors: ['トーキヨー', 'トーギョー', 'トキョー'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // ==========================================
  // シャ 行 (Sha, Shu, Sho)
  // ==========================================
  シャ: defineKYoon({
    id: 'k-yoon-sha',
    kana: 'シャ',
    romaji: 'sha',
    kanaKanjiOrigin: 'シ (shi) + ャ (ya)',
    kanaDistractors: ['シヤ', 'ジャ', 'シュ', 'サ'],
    romajiDistractors: ['shiya', 'ja', 'shu', 'sa'],

    word: 'シャワー',
    wordRomaji: 'sha·wa·a',
    wordOrigin: {
      lang: 'en-US',
      word: 'Shower',
      desc: '',
    },
    wordMeaning: { en: 'Shower', zh: '淋浴', zhHant: '淋浴' },
    wordEmoji: '🚿',
    wordDistractors: ['シヤワー', 'ジャワー', 'シャーワ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  シュ: defineKYoon({
    id: 'k-yoon-shu',
    kana: 'シュ',
    romaji: 'shu',
    kanaKanjiOrigin: 'シ (shi) + ュ (yu)',
    kanaDistractors: ['シユ', 'ジュ', 'ショ', 'ス'],
    romajiDistractors: ['shiyu', 'ju', 'sho', 'su'],

    word: 'シュガー',
    wordRomaji: 'shu·ga·a',
    wordOrigin: {
      lang: 'en-US',
      word: 'Sugar',
      desc: '',
    },
    wordMeaning: { en: 'Sugar', zh: '糖', zhHant: '糖' },
    wordEmoji: '🍬',
    wordDistractors: ['シユガー', 'ジュガー', 'シュガ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ショ: defineKYoon({
    id: 'k-yoon-sho',
    kana: 'ショ',
    romaji: 'sho',
    kanaKanjiOrigin: 'シ (shi) + ョ (yo)',
    kanaDistractors: ['シヨ', 'ジョ', 'シャ', 'ソ'],
    romajiDistractors: ['shiyo', 'jo', 'sha', 'so'],

    word: 'ショー',
    wordRomaji: 'sho·o',
    wordOrigin: {
      lang: 'en-US',
      word: 'Show',
      desc: '',
    },
    wordMeaning: { en: 'Show', zh: '表演', zhHant: '表演' },
    wordEmoji: '🎭',
    wordDistractors: ['シヨー', 'ジョー', 'ショ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // ==========================================
  // チャ 行 (Cha, Chu, Cho)
  // ==========================================
  チャ: defineKYoon({
    id: 'k-yoon-cha',
    kana: 'チャ',
    romaji: 'cha',
    kanaKanjiOrigin: 'チ (chi) + ャ (ya)',
    kanaDistractors: ['チヤ', 'ヂャ', 'チュ', 'タ'],
    romajiDistractors: ['chiya', 'ja', 'chu', 'ta'],

    word: 'チャンス',
    wordRomaji: 'cha·n·su',
    wordOrigin: {
      lang: 'en-US',
      word: 'Chance',
      desc: '',
    },
    wordMeaning: { en: 'Chance', zh: '机会', zhHant: '機會' },
    wordEmoji: '🎲',
    wordDistractors: ['チヤンス', 'チャスン', 'タンス'],
  }),

  チュ: defineKYoon({
    id: 'k-yoon-chu',
    kana: 'チュ',
    romaji: 'chu',
    kanaKanjiOrigin: 'チ (chi) + ュ (yu)',
    kanaDistractors: ['チユ', 'ヂュ', 'チョ', 'ツ'],
    romajiDistractors: ['chiyu', 'ju', 'cho', 'tsu'],

    word: 'チューリップ',
    wordRomaji: 'chu·u·ri·p·pu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Tulip',
      desc: '',
    },
    wordMeaning: { en: 'Tulip', zh: '郁金香', zhHant: '鬱金香' },
    wordEmoji: '🌷',
    wordDistractors: ['チユーリップ', 'チューリプ', 'ツーリップ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  チョ: defineKYoon({
    id: 'k-yoon-cho',
    kana: 'チョ',
    romaji: 'cho',
    kanaKanjiOrigin: 'チ (chi) + ョ (yo)',
    kanaDistractors: ['チヨ', 'ヂョ', 'チャ', 'ト'],
    romajiDistractors: ['chiyo', 'jo', 'cha', 'to'],

    word: 'チョコレート',
    wordRomaji: 'cho·ko·re·e·to',
    wordOrigin: {
      lang: 'en-US',
      word: 'Chocolate',
      desc: '',
    },
    wordMeaning: { en: 'Chocolate', zh: '巧克力', zhHant: '巧克力' },
    wordEmoji: '🍫',
    wordDistractors: ['チヨコレート', 'チョコレト', 'トコレート'],
  }),

  // ==========================================
  // ニャ 行 (Nya, Nyu, Nyo)
  // ==========================================
  ニャ: defineKYoon({
    id: 'k-yoon-nya',
    kana: 'ニャ',
    romaji: 'nya',
    kanaKanjiOrigin: 'ニ (ni) + ャ (ya)',
    kanaDistractors: ['ニヤ', 'ナ', 'ニュ', 'ミャ'],
    romajiDistractors: ['niya', 'na', 'nyu', 'mya'],

    word: 'ニャンコ',
    wordRomaji: 'nya·n·ko',
    wordOrigin: {
      lang: 'ja',
      word: 'にゃんこ',
      desc: '猫的可爱称呼',
    },
    wordMeaning: { en: 'Kitty', zh: '小猫咪', zhHant: '小貓咪' },
    wordEmoji: '🐱',
    wordDistractors: ['ニヤンコ', 'ニャコン', 'ナンコ'],
  }),

  ニュ: defineKYoon({
    id: 'k-yoon-nyu',
    kana: 'ニュ',
    romaji: 'nyu',
    kanaKanjiOrigin: 'ニ (ni) + ュ (yu)',
    kanaDistractors: ['ニユ', 'ヌ', 'ニョ', 'ミュ'],
    romajiDistractors: ['niyu', 'nu', 'nyo', 'myu'],

    word: 'ニュース',
    wordRomaji: 'nyu·u·su',
    wordOrigin: {
      lang: 'en-US',
      word: 'News',
      desc: '',
    },
    wordMeaning: { en: 'News', zh: '新闻', zhHant: '新聞' },
    wordEmoji: '📰',
    wordDistractors: ['ニユース', 'ニュス', 'ヌース'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ニョ: defineKYoon({
    id: 'k-yoon-nyo',
    kana: 'ニョ',
    romaji: 'nyo',
    kanaKanjiOrigin: 'ニ (ni) + ョ (yo)',
    kanaDistractors: ['ニヨ', 'ノ', 'ニャ', 'ミョ'],
    romajiDistractors: ['niyo', 'no', 'nya', 'myo'],
    wordDistractors: ['ニヨニヨ', 'ノニョ', 'ニャニョ'],
  }),

  // ==========================================
  // ヒャ 行 (Hya, Hyu, Hyo)
  // ==========================================
  ヒャ: defineKYoon({
    id: 'k-yoon-hya',
    kana: 'ヒャ',
    romaji: 'hya',
    kanaKanjiOrigin: 'ヒ (hi) + ャ (ya)',
    kanaDistractors: ['ヒヤ', 'ビャ', 'ピャ', 'ヒュ'],
    romajiDistractors: ['hiya', 'bya', 'pya', 'hyu'],

    word: 'ヒャクパーセント',
    wordRomaji: 'hya·ku·pa·a·se·n·to',
    wordOrigin: {
      lang: 'en-US',
      word: '100 Percent',
      desc: '',
    },
    wordMeaning: { en: '100 Percent', zh: '百分之百', zhHant: '百分之百' },
    wordEmoji: '💯',
    wordDistractors: ['ヒヤクパーセント', 'ヒャクパセント', 'ハクパーセント'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ヒュ: defineKYoon({
    id: 'k-yoon-hyu',
    kana: 'ヒュ',
    romaji: 'hyu',
    kanaKanjiOrigin: 'ヒ (hi) + ュ (yu)',
    kanaDistractors: ['ヒユ', 'ビュ', 'ピュ', 'フ'],
    romajiDistractors: ['hiyu', 'byu', 'pyu', 'fu'],

    word: 'ヒューマン',
    wordRomaji: 'hyu·u·ma·n',
    wordOrigin: {
      lang: 'en-US',
      word: 'Human',
      desc: '',
    },
    wordMeaning: { en: 'Human', zh: '人类', zhHant: '人類' },
    wordEmoji: '👤',
    wordDistractors: ['ヒユーマン', 'ヒューマヌ', 'フーマン'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ヒョ: defineKYoon({
    id: 'k-yoon-hyo',
    kana: 'ヒョ',
    romaji: 'hyo',
    kanaKanjiOrigin: 'ヒ (hi) + ョ (yo)',
    kanaDistractors: ['ヒヨ', 'ビョ', 'ピョ', 'ホ'],
    romajiDistractors: ['hiyo', 'byo', 'pyo', 'ho'],

    word: 'ヒョウ',
    wordRomaji: 'hyo·u',
    wordOrigin: {
      lang: 'en-US',
      word: 'Leopard',
      desc: '',
    },
    wordMeaning: { en: 'Leopard', zh: '豹', zhHant: '豹' },
    wordEmoji: '🐆',
    wordDistractors: ['ヒヨウ', 'ビョウ', 'ホウ'],
    wordNoteKey: 'studyKana.wordNotes.hhyo',
  }),

  // ==========================================
  // ミャ 行 (Mya, Myu, Myo)
  // ==========================================
  ミャ: defineKYoon({
    id: 'k-yoon-mya',
    kana: 'ミャ',
    romaji: 'mya',
    kanaKanjiOrigin: 'ミ (mi) + ャ (ya)',
    kanaDistractors: ['ミヤ', 'マ', 'ミュ', 'ニャ'],
    romajiDistractors: ['miya', 'ma', 'myu', 'nya'],

    word: 'ミャンマー',
    wordRomaji: 'mya·n·ma·a',
    wordOrigin: {
      lang: 'en-US',
      word: 'Myanmar',
      desc: '',
    },
    wordMeaning: { en: 'Myanmar', zh: '缅甸', zhHant: '緬甸' },
    wordDistractors: ['ミヤンマー', 'ミャマー', 'ミャンマ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ミュ: defineKYoon({
    id: 'k-yoon-myu',
    kana: 'ミュ',
    romaji: 'myu',
    kanaKanjiOrigin: 'ミ (mi) + ュ (yu)',
    kanaDistractors: ['ミユ', 'ム', 'ミョ', 'ニュ'],
    romajiDistractors: ['miyu', 'mu', 'myo', 'nyu'],

    word: 'ミュージック',
    wordRomaji: 'myu·u·ji·k·ku',
    wordOrigin: {
      lang: 'en-US',
      word: 'Music',
      desc: '',
    },
    wordMeaning: { en: 'Music', zh: '音乐', zhHant: '音樂' },
    wordEmoji: '🎵',
    wordDistractors: ['ミユージック', 'ミュジック', 'ムージック'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ミョ: defineKYoon({
    id: 'k-yoon-myo',
    kana: 'ミョ',
    romaji: 'myo',
    kanaKanjiOrigin: 'ミ (mi) + ョ (yo)',
    kanaDistractors: ['ミヨ', 'モ', 'ミャ', 'ニョ'],
    romajiDistractors: ['miyo', 'mo', 'mya', 'nyo'],
    wordDistractors: ['ミヨミヨ', 'モミョ', 'ミャミョ'],
  }),

  // ==========================================
  // リャ 行 (Rya, Ryu, Ryo)
  // ==========================================
  リャ: defineKYoon({
    id: 'k-yoon-rya',
    kana: 'リャ',
    romaji: 'rya',
    kanaKanjiOrigin: 'リ (ri) + ャ (ya)',
    kanaDistractors: ['リヤ', 'ラ', 'リュ', 'ギャ'],
    romajiDistractors: ['riya', 'ra', 'ryu', 'gya'],
    wordDistractors: ['リヤリヤ', 'ラリャ', 'リュリャ'],
  }),

  リュ: defineKYoon({
    id: 'k-yoon-ryu',
    kana: 'リュ',
    romaji: 'ryu',
    kanaKanjiOrigin: 'リ (ri) + ュ (yu)',
    kanaDistractors: ['リユ', 'ル', 'リョ', 'ギュ'],
    romajiDistractors: ['riyu', 'ru', 'ryo', 'gyu'],

    word: 'リュック',
    wordRomaji: 'ryu·k·ku',
    wordOrigin: {
      lang: 'de',
      word: 'Rucksack',
      desc: '',
    },
    wordMeaning: { en: 'Backpack', zh: '背包', zhHant: '背包' },
    wordEmoji: '🎒',
    wordDistractors: ['リユック', 'ルック', 'リュク'],
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  リョ: defineKYoon({
    id: 'k-yoon-ryo',
    kana: 'リョ',
    romaji: 'ryo',
    kanaKanjiOrigin: 'リ (ri) + ョ (yo)',
    kanaDistractors: ['リヨ', 'ロ', 'リャ', 'ギョ'],
    romajiDistractors: ['riyo', 'ro', 'rya', 'gyo'],
    wordDistractors: ['リヨリヨ', 'ロリョ', 'リャリョ'],
  }),

  // ==========================================
  // ギャ 行 (Gya, Gyu, Gyo)
  // ==========================================
  ギャ: defineKYoon({
    id: 'k-yoon-gya',
    kana: 'ギャ',
    romaji: 'gya',
    kanaKanjiOrigin: 'ギ (gi) + ャ (ya)',
    kanaDistractors: ['ギヤ', 'キャ', 'ガ', 'ギュ'],
    romajiDistractors: ['giya', 'kya', 'ga', 'gyu'],

    word: 'ギャング',
    wordRomaji: 'gya·n·gu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Gang',
      desc: '',
    },
    wordMeaning: { en: 'Gang', zh: '帮派', zhHant: '幫派' },
    wordDistractors: ['ギヤング', 'キャング', 'ギャグ'],
  }),

  ギュ: defineKYoon({
    id: 'k-yoon-gyu',
    kana: 'ギュ',
    romaji: 'gyu',
    kanaKanjiOrigin: 'ギ (gi) + ュ (yu)',
    kanaDistractors: ['ギユ', 'グ', 'ギョ', 'キュ'],
    romajiDistractors: ['giyu', 'gu', 'gyo', 'kyu'],
    wordDistractors: ['ギユギユ', 'グギュ', 'ギョギュ'],
  }),

  ギョ: defineKYoon({
    id: 'k-yoon-gyo',
    kana: 'ギョ',
    romaji: 'gyo',
    kanaKanjiOrigin: 'ギ (gi) + ョ (yo)',
    kanaDistractors: ['ギヨ', 'ゴ', 'ギャ', 'キョ'],
    romajiDistractors: ['giyo', 'go', 'gya', 'kyo'],
    wordDistractors: ['ギヨギヨ', 'ゴギョ', 'ギャギョ'],
  }),

  // ==========================================
  // ジャ 行 (Ja, Ju, Jo)
  // ==========================================
  ジャ: defineKYoon({
    id: 'k-yoon-ja',
    kana: 'ジャ',
    romaji: 'ja',
    kanaKanjiOrigin: 'ジ (ji) + ャ (ya)',
    kanaDistractors: ['ジヤ', 'シャ', 'ザ', 'ジュ'],
    romajiDistractors: ['jiya', 'sha', 'za', 'ju'],

    word: 'ジャズ',
    wordRomaji: 'ja·zu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Jazz',
      desc: '',
    },
    wordMeaning: { en: 'Jazz', zh: '爵士乐', zhHant: '爵士樂' },
    wordEmoji: '🎷',
    wordDistractors: ['ジヤズ', 'シャズ', 'ジャス'],
  }),

  ジュ: defineKYoon({
    id: 'k-yoon-ju',
    kana: 'ジュ',
    romaji: 'ju',
    kanaKanjiOrigin: 'ジ (ji) + ュ (yu)',
    kanaDistractors: ['ジユ', 'ズ', 'ジョ', 'シュ'],
    romajiDistractors: ['jiyu', 'zu', 'jo', 'shu'],

    word: 'ジュース',
    wordRomaji: 'ju·u·su',
    wordOrigin: {
      lang: 'en-US',
      word: 'Juice',
      desc: '',
    },
    wordMeaning: { en: 'Juice', zh: '果汁', zhHant: '果汁' },
    wordEmoji: '🧃',
    wordDistractors: ['ジユース', 'ズース', 'ジュス'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ジョ: defineKYoon({
    id: 'k-yoon-jo',
    kana: 'ジョ',
    romaji: 'jo',
    kanaKanjiOrigin: 'ジ (ji) + ョ (yo)',
    kanaDistractors: ['ジヨ', 'ゾ', 'ジャ', 'ショ'],
    romajiDistractors: ['jiyo', 'zo', 'ja', 'sho'],

    word: 'ジョギング',
    wordRomaji: 'jo·gi·n·gu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Jogging',
      desc: '',
    },
    wordMeaning: { en: 'Jogging', zh: '慢跑', zhHant: '慢跑' },
    wordEmoji: '🏃',
    wordDistractors: ['ジヨギング', 'ゾギング', 'ジョギグ'],
  }),

  // ==========================================
  // ビャ 行 (Bya, Byu, Byo)
  // ==========================================
  ビャ: defineKYoon({
    id: 'k-yoon-bya',
    kana: 'ビャ',
    romaji: 'bya',
    kanaKanjiOrigin: 'ビ (bi) + ャ (ya)',
    kanaDistractors: ['ビヤ', 'ピャ', 'バ', 'ビュ'],
    romajiDistractors: ['biya', 'pya', 'ba', 'byu'],
    wordDistractors: ['ビヤビヤ', 'ピャビャ', 'バビャ'],
  }),

  ビュ: defineKYoon({
    id: 'k-yoon-byu',
    kana: 'ビュ',
    romaji: 'byu',
    kanaKanjiOrigin: 'ビ (bi) + ュ (yu)',
    kanaDistractors: ['ビユ', 'ブ', 'ビョ', 'ピュ'],
    romajiDistractors: ['biyu', 'bu', 'byo', 'pyu'],

    word: 'ビュッフェ',
    wordRomaji: 'byu·f·fe',
    wordOrigin: {
      lang: 'fr',
      word: 'Buffet',
      desc: '',
    },
    wordMeaning: { en: 'Buffet', zh: '自助餐', zhHant: '自助餐' },
    wordEmoji: '🍽️',
    wordDistractors: ['ビユッフェ', 'ブッフェ', 'ビュフェ'],
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  ビョ: defineKYoon({
    id: 'k-yoon-byo',
    kana: 'ビョ',
    romaji: 'byo',
    kanaKanjiOrigin: 'ビ (bi) + ョ (yo)',
    kanaDistractors: ['ビヨ', 'ボ', 'ビャ', 'ピョ'],
    romajiDistractors: ['biyo', 'bo', 'bya', 'pyo'],
    wordDistractors: ['ビヨビヨ', 'ボビョ', 'ビャビョ'],
  }),

  // ==========================================
  // ピャ 行 (Pya, Pyu, Pyo)
  // ==========================================
  ピャ: defineKYoon({
    id: 'k-yoon-pya',
    kana: 'ピャ',
    romaji: 'pya',
    kanaKanjiOrigin: 'ピ (pi) + ャ (ya)',
    kanaDistractors: ['ピヤ', 'ビャ', 'パ', 'ピュ'],
    romajiDistractors: ['piya', 'bya', 'pa', 'pyu'],
    wordDistractors: ['ピヤピヤ', 'ビャピャ', 'パピャ'],
  }),

  ピュ: defineKYoon({
    id: 'k-yoon-pyu',
    kana: 'ピュ',
    romaji: 'pyu',
    kanaKanjiOrigin: 'ピ (pi) + ュ (yu)',
    kanaDistractors: ['ピユ', 'プ', 'ピョ', 'ビュ'],
    romajiDistractors: ['piyu', 'pu', 'pyo', 'byu'],

    word: 'コンピュータ',
    wordRomaji: 'ko·n·pyu·u·ta',
    wordOrigin: {
      lang: 'en-US',
      word: 'Computer',
      desc: '',
    },
    wordMeaning: { en: 'Computer', zh: '电脑', zhHant: '電腦' },
    wordEmoji: '💻',
    wordDistractors: ['コンピユータ', 'コンプータ', 'コンピュタ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ピョ: defineKYoon({
    id: 'k-yoon-pyo',
    kana: 'ピョ',
    romaji: 'pyo',
    kanaKanjiOrigin: 'ピ (pi) + ョ (yo)',
    kanaDistractors: ['ピヨ', 'ビョ', 'ポ', 'ピャ'],
    romajiDistractors: ['piyo', 'byo', 'po', 'pya'],

    word: 'ピョンヤン',
    wordRomaji: 'pyo·n·ya·n',
    wordOrigin: {
      lang: 'ko-KP',
      word: '평양',
      desc: '',
    },
    wordMeaning: { en: 'Pyongyang', zh: '平壤', zhHant: '平壤' },
    wordDistractors: ['ピヨンヤン', 'ビョンヤン', 'ピョヤン'],
  }),
};
