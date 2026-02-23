import { defineKSeion, type KatakanaSeion } from '../core';

export const KATAKANA_SEION: Record<string, KatakanaSeion> = {
  // --- A 行 (片假名) ---
  ア: defineKSeion({
    id: 'k-a',
    kana: 'ア', // 片假名
    romaji: 'a',

    kanaKanjiOrigin: '阿', // 片假名汉字来源

    kanaDistractors: ['マ', 'ヤ', 'ナ'], // 该假名的形近，请做到尽可能的迷惑性。至少三个
    romajiDistractors: ['e', 'o', 'u'], // 该假名的音近，请做到尽可能的迷惑性。少三个

    word: 'アメリカ', // 包含该片假名的单词。要求是知名词汇，比如品牌名、人名、地名、国名、等等。必须是名词，尽可能知名，在保证知名的前提下，总发音尽量少、发音中未学假名的数量尽量少。总体需符合日语入门人群的水平。请优先从上方《常见片假名单词示例》中挑选。
    wordRomaji: 'a·me·ri·ka',
    wordOrigin: {
      lang: 'en-US', // 如果是舶来词，就注明是什么国家。如果是日语自己造的词，就注明日语。注意要区分英国英语和美国英语。
      word: 'America', // 如果是舶来词，就写原词写法 (例如 "Arbeit", "Pão")。
      desc: '', // 备注 (可选，例如 "和制英语", "拟声词")
    },
    wordMeaning: { en: 'America', zh: '美国', zhHant: '美國' },
    wordDistractors: ['アリメカ', 'アリカメ', 'アメリマ'], // word 的形似，请做到尽可能的迷惑性。至少三个。
    wordEmoji: '🇺🇸', // 该单词尽可能是简单名词，对应的 emoji 或 image。没有合适的就置空。
  }),

  イ: defineKSeion({
    id: 'k-i',
    kana: 'イ',
    romaji: 'i',

    kanaKanjiOrigin: '伊',

    kanaDistractors: ['リ', 'ソ', 'ン'],
    romajiDistractors: ['e', 'a', 'u'],

    word: 'イケア', // IKEA (宜家)。
    wordRomaji: 'i·ke·a',
    wordOrigin: {
      lang: 'sv',
      word: 'IKEA',
      desc: 'Brand (瑞典品牌)',
    },
    wordMeaning: { en: 'IKEA', zh: '宜家家居', zhHant: '宜家家居' },
    wordDistractors: ['イキア', 'アケア', 'エケア'],
  }),

  ウ: defineKSeion({
    id: 'k-u',
    kana: 'ウ',
    romaji: 'u',

    kanaKanjiOrigin: '宇', // 来自“宇”的宝盖头

    kanaDistractors: ['ワ', 'ク', 'フ'], // ワ(wa)极度形似
    romajiDistractors: ['o', 'a', 'i'],

    word: 'ウール', // Wool (羊毛)。常见的衣服材质标签。
    wordRomaji: 'u·u·ru', // 长音
    wordOrigin: {
      lang: 'en-GB',
      word: 'Wool',
      desc: '',
    },
    wordMeaning: { en: 'Wool', zh: '羊毛', zhHant: '羊毛' },
    wordDistractors: ['ワール', 'クール', 'ウーヌ'], // 用形近字ワ、ク混淆，或把ル改成ソ(so)
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  エ: defineKSeion({
    id: 'k-e',
    kana: 'エ',
    romaji: 'e',

    kanaKanjiOrigin: '江',

    kanaDistractors: ['ユ', 'ロ', 'コ'],
    romajiDistractors: ['i', 'a', 'o'],

    word: 'エアコン',
    wordRomaji: 'e·a·ko·n',
    wordOrigin: {
      lang: 'en-US',
      word: 'Air Conditioner',
      desc: '',
    },
    wordMeaning: { en: 'Air Conditioner', zh: '空调', zhHant: '空調' },
    wordDistractors: ['エアゴン', 'エアコヌ', 'アエコン', 'エコアン'],
  }),

  オ: defineKSeion({
    id: 'k-o',
    kana: 'オ',
    romaji: 'o',

    kanaKanjiOrigin: '於',

    kanaDistractors: ['ホ', 'ネ', 'ヌ'],
    romajiDistractors: ['u', 'a', 'e'],

    word: 'オランダ',
    wordRomaji: 'o·ra·n·da',
    wordOrigin: {
      lang: 'pt',
      word: 'Holanda',
      desc: '',
    },
    wordMeaning: { en: 'Netherlands', zh: '荷兰', zhHant: '荷蘭' },
    wordDistractors: ['ホランダ', 'オラダン', 'オンラダ'],
    wordEmoji: '🇳🇱',
  }),

  // --- カ 行 (片假名) ---
  カ: defineKSeion({
    id: 'k-ka',
    kana: 'カ',
    romaji: 'ka',

    kanaKanjiOrigin: '加',

    kanaDistractors: ['タ', 'ク', 'ヤ'],
    romajiDistractors: ['ga', 'ki', 'ku'],

    word: 'カルテ',
    wordRomaji: 'ka·ru·te',
    wordOrigin: {
      lang: 'de',
      word: 'Karte',
      desc: '',
    },
    wordMeaning: { en: 'Medical Chart', zh: '病历卡', zhHant: '病歷卡' },
    wordDistractors: ['ガルテ', 'カルデ', 'カヌテ'],
  }),

  キ: defineKSeion({
    id: 'k-ki',
    kana: 'キ',
    romaji: 'ki',

    kanaKanjiOrigin: '幾',

    kanaDistractors: ['サ', 'セ', 'ミ'],
    romajiDistractors: ['gi', 'ku', 'ke'],

    word: 'キット',
    wordRomaji: 'ki·t·to',
    wordOrigin: {
      lang: 'en-US',
      word: 'Kit',
      desc: '',
    },
    wordMeaning: { en: 'Kit', zh: '套装', zhHant: '套裝' },
    wordDistractors: ['ギット', 'キトト', 'キッド'],
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  ク: defineKSeion({
    id: 'k-ku',
    kana: 'ク',
    romaji: 'ku',

    kanaKanjiOrigin: '久',

    kanaDistractors: ['ワ', 'ケ', 'タ'],
    romajiDistractors: ['gu', 'ki', 'ke'],

    word: 'クッキー',
    wordRomaji: 'ku·k·ki·i',
    wordOrigin: {
      lang: 'en-US',
      word: 'Cookie',
      desc: '',
    },
    wordMeaning: { en: 'Cookie', zh: '饼干', zhHant: '餅乾' },
    wordDistractors: ['グッキー', 'クキー', 'クッケー'],
    wordEmoji: '🍪',
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  ケ: defineKSeion({
    id: 'k-ke',
    kana: 'ケ',
    romaji: 'ke',

    kanaKanjiOrigin: '介',

    kanaDistractors: ['ユ', 'コ', 'ク'],
    romajiDistractors: ['ge', 'ki', 'ko'],

    word: 'ケーキ',
    wordRomaji: 'ke·e·ki',
    wordOrigin: {
      lang: 'en-US',
      word: 'Cake',
      desc: '',
    },
    wordMeaning: { en: 'Cake', zh: '蛋糕', zhHant: '蛋糕' },
    wordDistractors: ['ゲーキ', 'ケキー', 'ケーギ'],
    wordEmoji: '🍰',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  コ: defineKSeion({
    id: 'k-ko',
    kana: 'コ',
    romaji: 'ko',

    kanaKanjiOrigin: '己',

    kanaDistractors: ['ユ', 'エ', 'ロ'],
    romajiDistractors: ['go', 'ku', 'ki'],

    word: 'コップ',
    wordRomaji: 'ko·p·pu',
    wordOrigin: {
      lang: 'nl',
      word: 'Kop',
      desc: '',
    },
    wordMeaning: { en: 'Cup/Glass', zh: '杯子', zhHant: '杯子' },
    wordDistractors: ['ゴップ', 'コププ', 'コッブ'],
    wordEmoji: '🥤',
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  // --- サ 行 (片假名) ---
  サ: defineKSeion({
    id: 'k-sa',
    kana: 'サ',
    romaji: 'sa',

    kanaKanjiOrigin: '散',

    kanaDistractors: ['セ', 'ヨ', 'キ'],
    romajiDistractors: ['za', 'shi', 'se'],

    word: 'サラダ',
    wordRomaji: 'sa·ra·da',
    wordOrigin: {
      lang: 'en-US',
      word: 'Salad',
      desc: '',
    },
    wordMeaning: { en: 'Salad', zh: '沙拉', zhHant: '沙拉' },
    wordDistractors: ['ザラダ', 'サダラ', 'サラタ'],
    wordEmoji: '🥗',
  }),

  シ: defineKSeion({
    id: 'k-shi',
    kana: 'シ',
    romaji: 'shi',

    kanaKanjiOrigin: '之',

    kanaDistractors: ['ツ', 'ミ', 'ン'],
    romajiDistractors: ['tsu', 'su', 'chi'],

    word: 'タクシー',
    wordRomaji: 'ta·ku·shi·i',
    wordOrigin: {
      lang: 'en-US',
      word: 'Taxi',
      desc: '',
    },
    wordMeaning: { en: 'Taxi', zh: '出租车', zhHant: '計程車' },
    wordEmoji: '🚕',
    wordDistractors: ['タクツー', 'タクシ', 'タグシー'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ス: defineKSeion({
    id: 'k-su',
    kana: 'ス',
    romaji: 'su',

    kanaKanjiOrigin: '須',

    kanaDistractors: ['ヌ', 'ラ', 'ン'],
    romajiDistractors: ['zu', 'shi', 'se'],

    word: 'スイカ',
    wordRomaji: 'su·i·ka',
    wordOrigin: {
      lang: 'ja',
      word: '西瓜',
      desc: '',
    },
    wordMeaning: { en: 'Watermelon', zh: '西瓜', zhHant: '西瓜' },
    wordEmoji: '🍉',
    wordDistractors: ['スエカ', 'スイガ', 'スカイ'],
  }),

  セ: defineKSeion({
    id: 'k-se',
    kana: 'セ',
    romaji: 'se',

    kanaKanjiOrigin: '世',

    kanaDistractors: ['モ', 'ヒ', 'サ'],
    romajiDistractors: ['ze', 'sa', 'shi'],

    word: 'ランドセル',
    wordRomaji: 'ra·n·do·se·ru',
    wordOrigin: {
      lang: 'nl',
      word: 'Ransel',
      desc: '',
    },
    wordMeaning: { en: 'School Bag', zh: '小学生书包', zhHant: '小學生書包' },
    wordDistractors: ['ランドゼル', 'ランドセヌ', 'ランセドル'],
    wordEmoji: '🎒',
  }),

  ソ: defineKSeion({
    id: 'k-so',
    kana: 'ソ',
    romaji: 'so',

    kanaKanjiOrigin: '曽',

    kanaDistractors: ['ン', 'リ', 'ノ'],
    romajiDistractors: ['zo', 'su', 'shi'],

    word: 'ソーセージ',
    wordRomaji: 'so·o·se·e·ji',
    wordOrigin: {
      lang: 'en-GB',
      word: 'Sausage',
      desc: '',
    },
    wordMeaning: { en: 'Sausage', zh: '香肠', zhHant: '香腸' },
    wordDistractors: ['ゾーセージ', 'ソセージー', 'ソーセジ'],
    wordEmoji: '🌭',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // --- タ 行 (片假名) ---
  タ: defineKSeion({
    id: 'k-ta',
    kana: 'タ',
    romaji: 'ta',

    kanaKanjiOrigin: '多',

    kanaDistractors: ['ク', 'ヌ', 'カ'],
    romajiDistractors: ['da', 'te', 'to'],

    word: 'タバコ',
    wordRomaji: 'ta·ba·ko',
    wordOrigin: {
      lang: 'pt',
      word: 'Tabaco',
      desc: '',
    },
    wordMeaning: { en: 'Tobacco/Cigarette', zh: '香烟', zhHant: '香菸' },
    wordDistractors: ['ダバコ', 'タパコ', 'タバゴ'],
    wordEmoji: '🚬',
  }),

  チ: defineKSeion({
    id: 'k-chi',
    kana: 'チ',
    romaji: 'chi',

    kanaKanjiOrigin: '千',

    kanaDistractors: ['テ', 'ナ', 'キ'],
    romajiDistractors: ['ji', 'tsu', 'shi'],

    word: 'チーズ',
    wordRomaji: 'chi·i·zu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Cheese',
      desc: '',
    },
    wordMeaning: { en: 'Cheese', zh: '奶酪', zhHant: '起司' },
    wordDistractors: ['ヂーズ', 'チズー', 'チース'],
    wordEmoji: '🧀',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ツ: defineKSeion({
    id: 'k-tsu',
    kana: 'ツ',
    romaji: 'tsu',

    kanaKanjiOrigin: '川',

    kanaDistractors: ['シ', 'ン', 'ソ'],
    romajiDistractors: ['zu', 'shi', 'chi'],

    word: 'ナッツ',
    wordRomaji: 'na·t·tsu',
    wordOrigin: {
      lang: 'en-US',
      word: 'Nuts',
      desc: '',
    },
    wordMeaning: { en: 'Nuts', zh: '坚果', zhHant: '堅果' },
    wordDistractors: ['ナッヅ', 'ナシツ', 'ナツツ'],
    wordEmoji: '🥜',
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  テ: defineKSeion({
    id: 'k-te',
    kana: 'テ',
    romaji: 'te',

    kanaKanjiOrigin: '天',

    kanaDistractors: ['ナ', 'ラ', 'チ'],
    romajiDistractors: ['de', 'ta', 'to'],

    word: 'テスト',
    wordRomaji: 'te·su·to',
    wordOrigin: {
      lang: 'en-US',
      word: 'Test',
      desc: '',
    },
    wordMeaning: { en: 'Test', zh: '测试', zhHant: '測試' },
    wordEmoji: '📝',
    wordDistractors: ['テスド', 'テヌト', 'テトス'],
  }),

  ト: defineKSeion({
    id: 'k-to',
    kana: 'ト',
    romaji: 'to',

    kanaKanjiOrigin: '止',

    kanaDistractors: ['イ', 'ヒ', 'リ'],
    romajiDistractors: ['do', 'ta', 'te'],

    word: 'トマト',
    wordRomaji: 'to·ma·to',
    wordOrigin: {
      lang: 'en-US',
      word: 'Tomato',
      desc: '',
    },
    wordMeaning: { en: 'Tomato', zh: '番茄', zhHant: '番茄' },
    wordEmoji: '🍅',
    wordDistractors: ['トマド', 'トアト', 'トマタ'],
  }),

  // --- ナ 行 (片假名) ---
  ナ: defineKSeion({
    id: 'k-na',
    kana: 'ナ',
    romaji: 'na',

    kanaKanjiOrigin: '奈',

    kanaDistractors: ['メ', 'ヌ', 'チ'],
    romajiDistractors: ['ma', 'nu', 'ni'],

    word: 'バナナ',
    wordRomaji: 'ba·na·na',
    wordOrigin: {
      lang: 'en-US',
      word: 'Banana',
      desc: '',
    },
    wordMeaning: { en: 'Banana', zh: '香蕉', zhHant: '香蕉' },
    wordDistractors: ['パナナ', 'バメナ', 'バナメ'],
    wordEmoji: '🍌',
  }),

  ニ: defineKSeion({
    id: 'k-ni',
    kana: 'ニ',
    romaji: 'ni',

    kanaKanjiOrigin: '二',

    kanaDistractors: ['ミ', 'サ', 'キ'],
    romajiDistractors: ['mi', 'na', 'nu'],

    word: 'ピーマン',
    wordRomaji: 'pi·i·ma·n',
    wordOrigin: {
      lang: 'fr',
      word: 'Piment',
      desc: '',
    },
    wordMeaning: { en: 'Green Pepper', zh: '青椒', zhHant: '青椒' },
    wordDistractors: ['ピーマヌ', 'ビーマン', 'ピマーン'],
    wordEmoji: '🫑',
  }),

  ヌ: defineKSeion({
    id: 'k-nu',
    kana: 'ヌ',
    romaji: 'nu',

    kanaKanjiOrigin: '奴',

    kanaDistractors: ['ス', 'ラ', 'フ'],
    romajiDistractors: ['mu', 'na', 'ni'],

    word: 'カヌー',
    wordRomaji: 'ka·nu·u',
    wordOrigin: {
      lang: 'en-US',
      word: 'Canoe',
      desc: '',
    },
    wordMeaning: { en: 'Canoe', zh: '独木舟', zhHant: '獨木舟' },
    wordDistractors: ['カスー', 'カヌヌ', 'ガヌー'],
    wordEmoji: '🛶',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ネ: defineKSeion({
    id: 'k-ne',
    kana: 'ネ',
    romaji: 'ne',

    kanaKanjiOrigin: '祢',

    kanaDistractors: ['ホ', 'ヌ', 'メ'],
    romajiDistractors: ['me', 'ni', 'no'],

    word: 'ネクタイ',
    wordRomaji: 'ne·ku·ta·i',
    wordOrigin: {
      lang: 'en-US',
      word: 'Necktie',
      desc: '',
    },
    wordMeaning: { en: 'Necktie', zh: '领带', zhHant: '領帶' },
    wordEmoji: '👔',
    wordDistractors: ['ネグタイ', 'ネクダイ', 'メクタイ'],
  }),

  ノ: defineKSeion({
    id: 'k-no',
    kana: 'ノ',
    romaji: 'no',

    kanaKanjiOrigin: '乃',

    kanaDistractors: ['ソ', 'ン', 'リ'],
    romajiDistractors: ['mo', 'nu', 'ne'],

    word: 'ノルマ',
    wordRomaji: 'no·ru·ma',
    wordOrigin: {
      lang: 'ru',
      word: 'Norma',
      desc: '',
    },
    wordMeaning: { en: 'Quota', zh: '定额', zhHant: '定額' },
    wordDistractors: ['ソルマ', 'ノヌマ', 'ノルア'],
  }),

  // --- ハ 行 (片假名) ---
  ハ: defineKSeion({
    id: 'k-ha',
    kana: 'ハ',
    romaji: 'ha',

    kanaKanjiOrigin: '八',

    kanaDistractors: ['ホ', 'ヘ', 'ヒ'],
    romajiDistractors: ['ba', 'pa', 'ho'],

    word: 'ハンバーガー',
    wordRomaji: 'ha·n·ba·a·ga·a',
    wordOrigin: {
      lang: 'en-US',
      word: 'Hamburger',
      desc: '',
    },
    wordMeaning: { en: 'Hamburger', zh: '汉堡包', zhHant: '漢堡包' },
    wordDistractors: ['バンバーガー', 'パンバーガー', 'ハンパーガー'],
    wordEmoji: '🍔',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ヒ: defineKSeion({
    id: 'k-hi',
    kana: 'ヒ',
    romaji: 'hi',

    kanaKanjiOrigin: '比',

    kanaDistractors: ['セ', 'ト', 'ニ'],
    romajiDistractors: ['bi', 'ha', 'ho'],

    word: 'コーヒー',
    wordRomaji: 'ko·o·hi·i',
    wordOrigin: {
      lang: 'nl',
      word: 'Koffie',
      desc: '☕',
    },
    wordMeaning: { en: 'Coffee', zh: '咖啡', zhHant: '咖啡' },
    wordEmoji: '☕',
    wordDistractors: ['コーセー', 'コヒー', 'ゴーヒー'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  フ: defineKSeion({
    id: 'k-fu',
    kana: 'フ',
    romaji: 'fu',

    kanaKanjiOrigin: '不',

    kanaDistractors: ['ワ', 'ウ', 'ク'],
    romajiDistractors: ['bu', 'pu', 'hu'],

    word: 'ナイフ',
    wordRomaji: 'na·i·fu',
    wordOrigin: {
      lang: 'en-GB',
      word: 'Knife',
      desc: '',
    },
    wordMeaning: { en: 'Knife', zh: '刀', zhHant: '刀' },
    wordDistractors: ['ナイブ', 'ナイプ', 'ナエフ'],
    wordEmoji: '🔪',
  }),

  ヘ: defineKSeion({
    id: 'k-he',
    kana: 'ヘ',
    romaji: 'he',

    kanaKanjiOrigin: '部',

    kanaDistractors: ['ト', 'レ', 'ノ'],
    romajiDistractors: ['be', 'pe', 'hi'],

    word: 'ゲレンデ',
    wordRomaji: 'ge·re·n·de',
    wordOrigin: {
      lang: 'de',
      word: 'Gelände',
      desc: '',
    },
    wordMeaning: { en: 'Ski Slope', zh: '滑雪场', zhHant: '滑雪場' },
    wordDistractors: ['ゲレンベ', 'ゲレンペ', 'ゲレデン'],
    wordEmoji: '⛷️',
  }),

  ホ: defineKSeion({
    id: 'k-ho',
    kana: 'ホ',
    romaji: 'ho',

    kanaKanjiOrigin: '保',

    kanaDistractors: ['オ', 'ネ', 'ヒ'],
    romajiDistractors: ['bo', 'ha', 'hi'],

    word: 'ホテル',
    wordRomaji: 'ho·te·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'Hotel',
      desc: '',
    },
    wordMeaning: { en: 'Hotel', zh: '酒店', zhHant: '酒店' },
    wordEmoji: '🏨',
    wordDistractors: ['ホテヌ', 'オテル', 'ホデル'],
  }),

  // --- マ 行 (片假名) ---
  マ: defineKSeion({
    id: 'k-ma',
    kana: 'マ',
    romaji: 'ma',

    kanaKanjiOrigin: '末',

    kanaDistractors: ['ア', 'ヤ', 'ム'],
    romajiDistractors: ['na', 'mi', 'mu'],

    word: 'マロン',
    wordRomaji: 'ma·ro·n',
    wordOrigin: {
      lang: 'fr',
      word: 'Marron',
      desc: '',
    },
    wordMeaning: { en: 'Chestnut', zh: '栗子', zhHant: '栗子' },
    wordDistractors: ['アロン', 'マヨン', 'マロヌ'],
    wordEmoji: '🌰',
  }),

  ミ: defineKSeion({
    id: 'k-mi',
    kana: 'ミ',
    romaji: 'mi',

    kanaKanjiOrigin: '三',

    kanaDistractors: ['シ', 'ニ', 'ツ'],
    romajiDistractors: ['ni', 'ma', 'mu'],

    word: 'ミルク',
    wordRomaji: 'mi·ru·ku',
    wordOrigin: {
      lang: 'en-US',
      word: 'Milk',
      desc: '',
    },
    wordMeaning: { en: 'Milk', zh: '牛奶', zhHant: '牛奶' },
    wordDistractors: ['ミヌク', 'シルク', 'ミルグ'],
    wordEmoji: '🥛',
  }),

  ム: defineKSeion({
    id: 'k-mu',
    kana: 'ム',
    romaji: 'mu',

    kanaKanjiOrigin: '牟',

    kanaDistractors: ['ヌ', 'ラ', 'ク'],
    romajiDistractors: ['nu', 'ma', 'mo'],

    word: 'アルバム',
    wordRomaji: 'a·ru·ba·mu',
    wordOrigin: {
      lang: 'en-GB',
      word: 'Album',
      desc: '',
    },
    wordMeaning: { en: 'Album', zh: '相册', zhHant: '相簿' },
    wordDistractors: ['アルバヌ', 'アルパム', 'アヌバム'],
    wordEmoji: '📔',
  }),

  メ: defineKSeion({
    id: 'k-me',
    kana: 'メ',
    romaji: 'me',

    kanaKanjiOrigin: '女',

    kanaDistractors: ['ヌ', 'ナ', 'ス'],
    romajiDistractors: ['ne', 'ma', 'mo'],

    word: 'ラーメン',
    wordRomaji: 'ra·a·me·n',
    wordOrigin: {
      lang: 'zh',
      word: '拉面',
      desc: '',
    },
    wordMeaning: { en: 'Ramen', zh: '拉面', zhHant: '拉麵' },
    wordDistractors: ['ラーヌン', 'ラーメヌ', 'ラメーン'],
    wordEmoji: '🍜',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  モ: defineKSeion({
    id: 'k-mo',
    kana: 'モ',
    romaji: 'mo',

    kanaKanjiOrigin: '毛',

    kanaDistractors: ['ヨ', 'セ', 'ユ'],
    romajiDistractors: ['no', 'mu', 'ma'],

    word: 'ローマ',
    wordRomaji: 'ro·o·ma',
    wordOrigin: {
      lang: 'it',
      word: 'Roma',
      desc: '',
    },
    wordMeaning: { en: 'Rome', zh: '罗马', zhHant: '羅馬' },
    wordDistractors: ['ローヨ', 'ロマー', 'ローア'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // --- ヤ 行 (片假名) ---
  ヤ: defineKSeion({
    id: 'k-ya',
    kana: 'ヤ',
    romaji: 'ya',

    kanaKanjiOrigin: '也',

    kanaDistractors: ['ア', 'マ', 'セ'],
    romajiDistractors: ['wa', 'yo', 'yu'],

    word: 'ダイヤ',
    wordRomaji: 'da·i·ya',
    wordOrigin: {
      lang: 'en-GB',
      word: 'Diamond',
      desc: '',
    },
    wordMeaning: { en: 'Diamond', zh: '钻石', zhHant: '鑽石' },
    wordDistractors: ['ダイア', 'ダイマ', 'タイヤ'],
    wordEmoji: '💎',
  }),

  ユ: defineKSeion({
    id: 'k-yu',
    kana: 'ユ',
    romaji: 'yu',

    kanaKanjiOrigin: '由',

    kanaDistractors: ['コ', 'ヨ', 'エ'],
    romajiDistractors: ['yo', 'ya', 'wa'],

    word: 'ミュンヘン',
    wordRomaji: 'myu·n·he·n',
    wordOrigin: {
      lang: 'de',
      word: 'München',
      desc: '',
    },
    wordMeaning: { en: 'Munich', zh: '慕尼黑', zhHant: '慕尼黑' },
    wordDistractors: ['ミコンヘン', 'ミュヘンン', 'ミョンヘン'],
  }),

  ヨ: defineKSeion({
    id: 'k-yo',
    kana: 'ヨ',
    romaji: 'yo',

    kanaKanjiOrigin: '与',

    kanaDistractors: ['コ', 'ユ', 'モ'],
    romajiDistractors: ['yu', 'ya', 'wa'],

    word: 'ヨット',
    wordRomaji: 'yo·t·to',
    wordOrigin: {
      lang: 'en-GB',
      word: 'Yacht',
      desc: '',
    },
    wordMeaning: { en: 'Yacht', zh: '游艇', zhHant: '遊艇' },
    wordDistractors: ['コット', 'ヨトト', 'ヨッド'],
    wordEmoji: '⛵',
    wordNoteKey: 'studyKana.wordNotes.kSokuon',
  }),

  // --- ラ 行 (片假名) ---
  ラ: defineKSeion({
    id: 'k-ra',
    kana: 'ラ',
    romaji: 'ra',

    kanaKanjiOrigin: '良',

    kanaDistractors: ['ヲ', 'ス', 'ク'],
    romajiDistractors: ['wa', 'ru', 'ri'],

    word: 'カメラ',
    wordRomaji: 'ka·me·ra',
    wordOrigin: {
      lang: 'en-US',
      word: 'Camera',
      desc: '',
    },
    wordMeaning: { en: 'Camera', zh: '相机', zhHant: '相機' },
    wordEmoji: '📷',
    wordDistractors: ['カメヲ', 'カエラ', 'カメア'],
  }),

  リ: defineKSeion({
    id: 'k-ri',
    kana: 'リ',
    romaji: 'ri',

    kanaKanjiOrigin: '利',

    kanaDistractors: ['イ', 'ソ', 'ン'],
    romajiDistractors: ['ni', 'ra', 'ru'],

    word: 'パリ',
    wordRomaji: 'pa·ri',
    wordOrigin: {
      lang: 'fr',
      word: 'Paris',
      desc: '',
    },
    wordMeaning: { en: 'Paris', zh: '巴黎', zhHant: '巴黎' },
    wordDistractors: ['パイ', 'バリ', 'パソ'],
  }),

  ル: defineKSeion({
    id: 'k-ru',
    kana: 'ル',
    romaji: 'ru',

    kanaKanjiOrigin: '流',

    kanaDistractors: ['レ', 'ヌ', 'ワ'],
    romajiDistractors: ['re', 'mu', 'ra'],

    word: 'ルール',
    wordRomaji: 'ru·u·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'Rule',
      desc: '',
    },
    wordMeaning: { en: 'Rule', zh: '规则', zhHant: '規則' },
    wordEmoji: '📏',
    wordDistractors: ['レール', 'ルーヌ', 'ルル'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  レ: defineKSeion({
    id: 'k-re',
    kana: 'レ',
    romaji: 're',

    kanaKanjiOrigin: '礼',

    kanaDistractors: ['ヒ', 'ル', 'ヘ'],
    romajiDistractors: ['ne', 'ru', 'ra'],

    word: 'アンケート',
    wordRomaji: 'a·n·ke·e·to',
    wordOrigin: {
      lang: 'fr',
      word: 'Enquête',
      desc: '',
    },
    wordMeaning: { en: 'Survey/Questionnaire', zh: '问卷调查', zhHant: '問卷調查' },
    wordDistractors: ['アンゲート', 'アンケード', 'アヌケート'],
  }),

  ロ: defineKSeion({
    id: 'k-ro',
    kana: 'ロ',
    romaji: 'ro',

    kanaKanjiOrigin: '呂',

    kanaDistractors: ['コ', 'エ', 'ユ'],
    romajiDistractors: ['no', 'ra', 're'],

    word: 'アルコール',
    wordRomaji: 'a·ru·ko·o·ru',
    wordOrigin: {
      lang: 'nl',
      word: 'Alcohol',
      desc: '',
    },
    wordMeaning: { en: 'Alcohol', zh: '酒精', zhHant: '酒精' },
    wordDistractors: ['アルゴール', 'アヌコール', 'アルコル'],
    wordEmoji: '🍶',
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // --- ワ 行 (片假名) ---
  ワ: defineKSeion({
    id: 'k-wa',
    kana: 'ワ',
    romaji: 'wa',

    kanaKanjiOrigin: '和',

    kanaDistractors: ['ウ', 'ク', 'フ'],
    romajiDistractors: ['ra', 'ya', 'o'],

    word: 'ワイン',
    wordRomaji: 'wa·i·n',
    wordOrigin: {
      lang: 'fr',
      word: 'Vin',
      desc: '',
    },
    wordMeaning: { en: 'Wine', zh: '葡萄酒', zhHant: '葡萄酒' },
    wordDistractors: ['ウイン', 'ワエン', 'ワイヌ'],
    wordEmoji: '🍷',
  }),

  ヲ: defineKSeion({
    id: 'k-wo',
    kana: 'ヲ',
    romaji: 'wo',

    kanaKanjiOrigin: '乎',

    kanaDistractors: ['ラ', 'ア', 'ワ'],
    romajiDistractors: ['o', 'ra', 'wa'],

    word: 'ヲタク',
    wordRomaji: 'wo·ta·ku',
    wordOrigin: {
      lang: 'ja',
      word: 'オタク',
      desc: '和制词汇',
    },
    wordMeaning: { en: 'Otaku', zh: '御宅族', zhHant: '御宅族' },
    wordDistractors: ['ラタク', 'オタク', 'ヲダク'],
  }),

  ン: defineKSeion({
    id: 'k-n',
    kana: 'ン',
    romaji: 'n',

    kanaKanjiOrigin: '尓',

    kanaDistractors: ['ソ', 'ノ', 'シ'],
    romajiDistractors: ['m', 'nu', 'mu'],

    word: 'パン',
    wordRomaji: 'pa·n',
    wordOrigin: {
      lang: 'pt',
      word: 'Pão',
      desc: '',
    },
    wordMeaning: { en: 'Bread', zh: '面包', zhHant: '麵包' },
    wordDistractors: ['パソ', 'パノ', 'バン'],
    wordEmoji: '🍞',
  }),
};
