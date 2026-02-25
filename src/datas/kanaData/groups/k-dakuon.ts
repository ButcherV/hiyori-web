// 片假名浊音 (Katakana Dakuon)
// 浊音单词相对较少，优先选择常见外来语

import { defineKDakuon, type KatakanaDakuon } from '../core';

export const KATAKANA_DAKUON: Record<string, KatakanaDakuon> = {
  // ==========================================
  // ガ 行 (Ga, Gi, Gu, Ge, Go)
  // ==========================================
  ガ: defineKDakuon({
    id: 'k-ga',
    kana: 'ガ',
    romaji: 'ga',
    kanaKanjiOrigin: '加',
    kanaDistractors: ['カ', 'ザ', 'ダ'],
    romajiDistractors: ['ka', 'za', 'da'],

    word: 'ガム',
    wordRomaji: 'ga·mu',
    wordOrigin: {
      lang: 'en-US',
      word: 'gum',
      desc: '',
    },
    wordMeaning: { en: 'chewing gum', zh: '口香糖', zhHant: '口香糖' },
    wordDistractors: ['タム', 'ガヌ', 'ガモ', 'ムガ'],
  }),

  ギ: defineKDakuon({
    id: 'k-gi',
    kana: 'ギ',
    romaji: 'gi',
    kanaKanjiOrigin: '幾',
    kanaDistractors: ['キ', 'サ', 'ザ'],
    romajiDistractors: ['ki', 'ji', 'zi'],

    word: 'ギター',
    wordRomaji: 'gi·ta·a',
    wordOrigin: {
      lang: 'en-US',
      word: 'guitar',
      desc: '',
    },
    wordMeaning: { en: 'guitar', zh: '吉他', zhHant: '吉他' },
    wordEmoji: '🎸',
    wordDistractors: ['ミター', 'ギタア', 'ギクー', 'ターギ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  グ: defineKDakuon({
    id: 'k-gu',
    kana: 'グ',
    romaji: 'gu',
    kanaKanjiOrigin: '久',
    kanaDistractors: ['ク', 'ワ', 'ケ'],
    romajiDistractors: ['ku', 'go', 'ge'],

    word: 'グーグル',
    wordRomaji: 'gu·u·gu·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'Google',
      desc: '',
    },
    wordMeaning: { en: 'Google', zh: '谷歌', zhHant: '谷歌' },
    wordDistractors: ['ワーグル', 'グーグヌ', 'グーケル', 'グルーグ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ゲ: defineKDakuon({
    id: 'k-ge',
    kana: 'ゲ',
    romaji: 'ge',
    kanaKanjiOrigin: '介',
    kanaDistractors: ['ケ', 'ユ', 'コ'],
    romajiDistractors: ['ke', 'gi', 'go'],

    word: 'ゲーム',
    wordRomaji: 'ge·e·mu',
    wordOrigin: {
      lang: 'en-US',
      word: 'game',
      desc: '',
    },
    wordMeaning: { en: 'game', zh: '游戏', zhHant: '遊戲' },
    wordEmoji: '🎮',
    wordDistractors: ['ユーム', 'ゲーヌ', 'ゲム', 'ムゲー'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ゴ: defineKDakuon({
    id: 'k-go',
    kana: 'ゴ',
    romaji: 'go',
    kanaKanjiOrigin: '己',
    kanaDistractors: ['コ', 'ユ', 'エ'],
    romajiDistractors: ['ko', 'gu', 'ge'],

    word: 'ゴール',
    wordRomaji: 'go·o·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'goal',
      desc: '',
    },
    wordMeaning: { en: 'goal', zh: '终点', zhHant: '終點' },
    wordEmoji: '🏁',
    wordDistractors: ['ヨール', 'ゴーヌ', 'ゴル', 'ルゴー'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // ==========================================
  // ザ 行 (Za, Ji, Zu, Ze, Zo)
  // ==========================================
  ザ: defineKDakuon({
    id: 'k-za',
    kana: 'ザ',
    romaji: 'za',
    kanaKanjiOrigin: '散',
    kanaDistractors: ['サ', 'セ', 'ヨ'],
    romajiDistractors: ['sa', 'ja', 'ze'],

    word: 'ピザ',
    wordRomaji: 'pi·za',
    wordOrigin: {
      lang: 'en-US',
      word: 'pizza',
      desc: '',
    },
    wordMeaning: { en: 'pizza', zh: '披萨', zhHant: '披薩' },
    wordEmoji: '🍕',
    wordDistractors: ['ピセ', 'ピザー', 'ピヌ', 'ザピ'],
  }),

  ジ: defineKDakuon({
    id: 'k-ji',
    kana: 'ジ',
    romaji: 'ji',
    kanaKanjiOrigin: '之',
    kanaDistractors: ['シ', 'ツ', 'ミ'],
    romajiDistractors: ['shi', 'chi', 'zi'],

    word: 'オレンジ',
    wordRomaji: 'o·re·n·ji',
    wordOrigin: {
      lang: 'en-US',
      word: 'orange',
      desc: '',
    },
    wordMeaning: { en: 'orange', zh: '橙子', zhHant: '橙子' },
    wordEmoji: '🍊',
    wordDistractors: ['オレンツ', 'オレンヂ', 'オレジン', 'オンレジ'],
  }),

  ズ: defineKDakuon({
    id: 'k-zu',
    kana: 'ズ',
    romaji: 'zu',
    kanaKanjiOrigin: '須',
    kanaDistractors: ['ス', 'ヌ', 'ラ'],
    romajiDistractors: ['su', 'du', 'ru'],

    word: 'ズボン',
    wordRomaji: 'zu·bo·n',
    wordOrigin: {
      lang: 'fr',
      word: 'jupon',
      desc: '',
    },
    wordMeaning: { en: 'pants', zh: '裤子', zhHant: '褲子' },
    wordEmoji: '👖',
    wordDistractors: ['ヌボン', 'ズホン', 'ズボヌ', 'ボズン'],
  }),

  ゼ: defineKDakuon({
    id: 'k-ze',
    kana: 'ゼ',
    romaji: 'ze',
    kanaKanjiOrigin: '世',
    kanaDistractors: ['セ', 'モ', 'ヒ'],
    romajiDistractors: ['se', 'za', 'zo'],

    word: 'ゼロ',
    wordRomaji: 'ze·ro',
    wordOrigin: {
      lang: 'en-US',
      word: 'zero',
      desc: '',
    },
    wordMeaning: { en: 'zero', zh: '零', zhHant: '零' },
    wordEmoji: '0️⃣',
    wordDistractors: ['モロ', 'ゼヌ', 'ゼロー', 'ロゼ'],
  }),

  ゾ: defineKDakuon({
    id: 'k-zo',
    kana: 'ゾ',
    romaji: 'zo',
    kanaKanjiOrigin: '曽',
    kanaDistractors: ['ソ', 'ン', 'リ'],
    romajiDistractors: ['so', 'zu', 'ze'],

    word: 'アマゾン',
    wordRomaji: 'a·ma·zo·n',
    wordOrigin: {
      lang: 'en-US',
      word: 'Amazon',
      desc: '',
    },
    wordMeaning: { en: 'Amazon', zh: '亚马逊', zhHant: '亞馬遜' },
    wordDistractors: ['アマツン', 'アマゾヌ', 'アマンゾ', 'アゾマン'],
  }),

  // ==========================================
  // ダ 行 (Da, Ji/Di, Zu/Du, De, Do)
  // ==========================================
  ダ: defineKDakuon({
    id: 'k-da',
    kana: 'ダ',
    romaji: 'da',
    kanaKanjiOrigin: '多',
    kanaDistractors: ['タ', 'ク', 'ヌ'],
    romajiDistractors: ['ta', 'na', 'ga'],

    word: 'ソーダ',
    wordRomaji: 'so·o·da',
    wordOrigin: {
      lang: 'en-US',
      word: 'soda',
      desc: '',
    },
    wordMeaning: { en: 'soda', zh: '苏打水', zhHant: '蘇打水' },
    wordEmoji: '🥤',
    wordDistractors: ['ソーナ', 'ソーダー', 'ソダー', 'ダーソ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ヂ: defineKDakuon({
    id: 'k-di',
    kana: 'ヂ',
    romaji: 'ji',
    kanaKanjiOrigin: '千',
    kanaDistractors: ['チ', 'ジ', 'テ'],
    romajiDistractors: ['chi', 'di', 'ti'],

    word: '',
    wordRomaji: '',
    wordOrigin: {
      lang: 'ja',
      word: '',
      desc: '罕用假名',
    },
    wordMeaning: { en: '', zh: '', zhHant: '' },
    wordDistractors: ['ヂヂ', 'ヂヂヂ', 'ヂヂヂヂ'],
    noteKey: 'studyKana.notes.kdi',
  }),

  ヅ: defineKDakuon({
    id: 'k-du',
    kana: 'ヅ',
    romaji: 'zu',
    kanaKanjiOrigin: '川',
    kanaDistractors: ['ツ', 'ズ', 'シ'],
    romajiDistractors: ['tsu', 'du', 'su'],

    word: '',
    wordRomaji: '',
    wordOrigin: {
      lang: 'ja',
      word: '',
      desc: '罕用假名',
    },
    wordMeaning: { en: '', zh: '', zhHant: '' },
    wordDistractors: ['ヅヅ', 'ヅヅヅ', 'ヅヅヅヅ'],
    noteKey: 'studyKana.notes.kdu',
  }),

  デ: defineKDakuon({
    id: 'k-de',
    kana: 'デ',
    romaji: 'de',
    kanaKanjiOrigin: '天',
    kanaDistractors: ['テ', 'ナ', 'ラ'],
    romajiDistractors: ['te', 'do', 'ge'],

    word: 'ビデオ',
    wordRomaji: 'bi·de·o',
    wordOrigin: {
      lang: 'en-US',
      word: 'video',
      desc: '',
    },
    wordMeaning: { en: 'video', zh: '视频', zhHant: '視頻' },
    wordEmoji: '📹',
    wordDistractors: ['ビナオ', 'ビデヨ', 'ビオデ', 'デビオ'],
  }),

  ド: defineKDakuon({
    id: 'k-do',
    kana: 'ド',
    romaji: 'do',
    kanaKanjiOrigin: '止',
    kanaDistractors: ['ト', 'イ', 'ヒ'],
    romajiDistractors: ['to', 'go', 'bo'],

    word: 'マクドナルド',
    wordRomaji: 'ma·ku·do·na·ru·do',
    wordOrigin: {
      lang: 'en-US',
      word: "McDonald's",
      desc: '',
    },
    wordMeaning: { en: "McDonald's", zh: '麦当劳', zhHant: '麥當勞' },
    wordEmoji: '🍟',
    wordDistractors: ['マクドナロド', 'マクナドルド', 'マドクナルド'],
  }),

  // ==========================================
  // バ 行 (Ba, Bi, Bu, Be, Bo)
  // ==========================================
  バ: defineKDakuon({
    id: 'k-ba',
    kana: 'バ',
    romaji: 'ba',
    kanaKanjiOrigin: '八',
    kanaDistractors: ['ハ', 'パ', 'マ'],
    romajiDistractors: ['ha', 'pa', 'ma'],

    word: 'バス',
    wordRomaji: 'ba·su',
    wordOrigin: {
      lang: 'en-US',
      word: 'bus',
      desc: '',
    },
    wordMeaning: { en: 'bus', zh: '公交车', zhHant: '公車' },
    wordEmoji: '🚌',
    wordDistractors: ['マス', 'バヌ', 'バソ', 'スバ'],
  }),

  ビ: defineKDakuon({
    id: 'k-bi',
    kana: 'ビ',
    romaji: 'bi',
    kanaKanjiOrigin: '比',
    kanaDistractors: ['ヒ', 'ピ', 'シ'],
    romajiDistractors: ['hi', 'pi', 'si'],

    word: 'コンビニ',
    wordRomaji: 'ko·n·bi·ni',
    wordOrigin: {
      lang: 'en-US',
      word: 'convenience store',
      desc: '和制英语缩略',
    },
    wordMeaning: { en: 'convenience store', zh: '便利店', zhHant: '便利店' },
    wordEmoji: '🏪',
    wordDistractors: ['コンミニ', 'コビニ', 'コンビヌ', 'ニンビコ'],
  }),

  ブ: defineKDakuon({
    id: 'k-bu',
    kana: 'ブ',
    romaji: 'bu',
    kanaKanjiOrigin: '不',
    kanaDistractors: ['フ', 'プ', 'ワ'],
    romajiDistractors: ['fu', 'pu', 'mu'],

    word: 'ブランド',
    wordRomaji: 'bu·ra·n·do',
    wordOrigin: {
      lang: 'en-US',
      word: 'brand',
      desc: '',
    },
    wordMeaning: { en: 'brand', zh: '品牌', zhHant: '品牌' },
    wordDistractors: ['ブランヌ', 'ブラドン', 'ランブド', 'ブンラド'],
  }),

  ベ: defineKDakuon({
    id: 'k-be',
    kana: 'ベ',
    romaji: 'be',
    kanaKanjiOrigin: '部',
    kanaDistractors: ['ヘ', 'ペ', 'ト'],
    romajiDistractors: ['he', 'pe', 'te'],

    word: 'ベルリン',
    wordRomaji: 'be·ru·ri·n',
    wordOrigin: {
      lang: 'de',
      word: 'Berlin',
      desc: '',
    },
    wordMeaning: { en: 'Berlin', zh: '柏林', zhHant: '柏林' },
    wordDistractors: ['メルリン', 'ベルイン', 'ベリン', 'リンベル'],
  }),

  ボ: defineKDakuon({
    id: 'k-bo',
    kana: 'ボ',
    romaji: 'bo',
    kanaKanjiOrigin: '保',
    kanaDistractors: ['ホ', 'ポ', 'オ'],
    romajiDistractors: ['ho', 'po', 'mo'],

    word: 'バレーボール',
    wordRomaji: 'ba·re·e·bo·o·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'volleyball',
      desc: '',
    },
    wordMeaning: { en: 'volleyball', zh: '排球', zhHant: '排球' },
    wordEmoji: '🏐',
    wordDistractors: ['バレーモール', 'バレボール', 'ボレーバール', 'バーレボール'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  // ==========================================
  // パ 行 (Pa, Pi, Pu, Pe, Po) - 半浊音
  // ==========================================
  パ: defineKDakuon({
    id: 'k-pa',
    kana: 'パ',
    romaji: 'pa',
    kanaKanjiOrigin: '八',
    kanaDistractors: ['バ', 'ハ', 'マ'],
    romajiDistractors: ['ba', 'ha', 'ma'],

    word: 'パン',
    wordRomaji: 'pa·n',
    wordOrigin: {
      lang: 'pt',
      word: 'pão',
      desc: '',
    },
    wordMeaning: { en: 'bread', zh: '面包', zhHant: '麵包' },
    wordEmoji: '🍞',
    wordDistractors: ['バン', 'ハン', 'パヌ'],
  }),

  ピ: defineKDakuon({
    id: 'k-pi',
    kana: 'ピ',
    romaji: 'pi',
    kanaKanjiOrigin: '比',
    kanaDistractors: ['ビ', 'ヒ', 'シ'],
    romajiDistractors: ['bi', 'hi', 'shi'],

    word: 'ピアノ',
    wordRomaji: 'pi·a·no',
    wordOrigin: {
      lang: 'it',
      word: 'piano',
      desc: '',
    },
    wordMeaning: { en: 'piano', zh: '钢琴', zhHant: '鋼琴' },
    wordEmoji: '🎹',
    wordDistractors: ['ビアノ', 'ピヤノ', 'ピアヌ'],
  }),

  プ: defineKDakuon({
    id: 'k-pu',
    kana: 'プ',
    romaji: 'pu',
    kanaKanjiOrigin: '不',
    kanaDistractors: ['ブ', 'フ', 'ワ'],
    romajiDistractors: ['bu', 'fu', 'mu'],

    word: 'プール',
    wordRomaji: 'pu·u·ru',
    wordOrigin: {
      lang: 'en-US',
      word: 'pool',
      desc: '',
    },
    wordMeaning: { en: 'swimming pool', zh: '游泳池', zhHant: '游泳池' },
    wordEmoji: '🏊',
    wordDistractors: ['ブール', 'フール', 'プーヌ'],
    wordNoteKey: 'studyKana.wordNotes.kLongVowel',
  }),

  ペ: defineKDakuon({
    id: 'k-pe',
    kana: 'ペ',
    romaji: 'pe',
    kanaKanjiOrigin: '部',
    kanaDistractors: ['ベ', 'ヘ', 'ト'],
    romajiDistractors: ['be', 'he', 'te'],

    word: 'ペン',
    wordRomaji: 'pe·n',
    wordOrigin: {
      lang: 'en-US',
      word: 'pen',
      desc: '',
    },
    wordMeaning: { en: 'pen', zh: '笔', zhHant: '筆' },
    wordEmoji: '🖊️',
    wordDistractors: ['ベン', 'ヘン', 'ペヌ'],
  }),

  ポ: defineKDakuon({
    id: 'k-po',
    kana: 'ポ',
    romaji: 'po',
    kanaKanjiOrigin: '保',
    kanaDistractors: ['ボ', 'ホ', 'オ'],
    romajiDistractors: ['bo', 'ho', 'mo'],

    word: 'ポスト',
    wordRomaji: 'po·su·to',
    wordOrigin: {
      lang: 'en-GB',
      word: 'post',
      desc: '',
    },
    wordMeaning: { en: 'mailbox', zh: '邮筒', zhHant: '郵筒' },
    wordEmoji: '📮',
    wordDistractors: ['ボスト', 'ホスト', 'ポスド'],
  }),
};
