import { defineHDakuon, type HiraganaDakuon } from '../core';

export const HIRAGANA_DAKUON: Record<string, HiraganaDakuon> = {
  // ==========================================
  // G 行 (Ga, Gi, Gu, Ge, Go)
  // ==========================================
  が: defineHDakuon({
    id: 'h-ga',
    kana: 'が',
    romaji: 'ga',
    kanaKanjiOrigin: '加',
    kanaDistractors: ['か', 'ざ', 'だ'],
    romajiDistractors: ['ka', 'na', 'da'],
    word: '学生',
    wordKana: 'がくせい',
    wordRomaji: 'ga·ku·se·i',
    wordMeaning: { en: 'Student', zh: '学生', zhHant: '學生' },
    wordEmoji: '🎓',
    wordDistractors: ['かくせい', 'がくぜい', 'かせい'],
  }),

  ぎ: defineHDakuon({
    id: 'h-gi',
    kana: 'ぎ',
    romaji: 'gi',
    kanaKanjiOrigin: '幾',
    kanaDistractors: ['き', 'さ', 'ざ'],
    romajiDistractors: ['ki', 'sa', 'ji'],
    word: '銀行',
    wordKana: 'ぎんこう',
    wordRomaji: 'gi·n·ko·u',
    wordMeaning: { en: 'Bank', zh: '银行', zhHant: '銀行' },
    wordEmoji: '🏦',
    wordDistractors: ['きんこう', 'ぎんごう', 'きんごう'],
  }),

  ぐ: defineHDakuon({
    id: 'h-gu',
    kana: 'ぐ',
    romaji: 'gu',
    kanaKanjiOrigin: '久',
    kanaDistractors: ['く', 'て', 'で'],
    romajiDistractors: ['ku', 'bu', 'pu'],
    word: '家具',
    wordKana: 'かぐ',
    wordRomaji: 'ka·gu',
    wordMeaning: { en: 'Furniture', zh: '家具', zhHant: '家具' },
    wordEmoji: '🪑',
    wordDistractors: ['かく', 'がぐ', 'かぐう'],
  }),

  げ: defineHDakuon({
    id: 'h-ge',
    kana: 'げ',
    romaji: 'ge',
    kanaKanjiOrigin: '計',
    kanaDistractors: ['け', 'は', 'ば'],
    romajiDistractors: ['ke', 'he', 'be'],
    word: '元気',
    wordKana: 'げんき',
    wordRomaji: 'ge·n·ki',
    wordMeaning: {
      en: 'Healthy; Fine',
      zh: '健康；精神',
      zhHant: '健康；精神',
    },
    wordEmoji: '💪',
    wordDistractors: ['けんき', 'げんぎ', 'てんき'],
  }),

  ご: defineHDakuon({
    id: 'h-go',
    kana: 'ご',
    romaji: 'go',
    kanaKanjiOrigin: '己',
    kanaDistractors: ['こ', 'に', 'ど'],
    romajiDistractors: ['ko', 'ni', 'do'],
    word: 'ご飯',
    wordKana: 'ごはん',
    wordRomaji: 'go·ha·n',
    wordMeaning: { en: 'Rice; Meal', zh: '米饭', zhHant: '米飯' },
    wordEmoji: '🍚',
    wordDistractors: ['こはん', 'ごばん', 'こうはん'],
  }),

  // ==========================================
  // Z 行 (Za, Ji, Zu, Ze, Zo)
  // ==========================================
  ざ: defineHDakuon({
    id: 'h-za',
    kana: 'ざ',
    romaji: 'za',
    kanaKanjiOrigin: '左', // 源自“左”
    kanaDistractors: ['さ', 'き', 'ち'],
    romajiDistractors: ['sa', 'ki', 'chi'],
    word: '雑誌',
    wordKana: 'ざっし',
    wordRomaji: 'za·sshi',
    wordMeaning: { en: 'Magazine', zh: '杂志', zhHant: '雜誌' },
    wordEmoji: '📖',
    wordDistractors: ['さっし', 'ざし', 'さし'],
    wordNoteKey: 'studyKana.wordNotes.hza',
  }),

  じ: defineHDakuon({
    id: 'h-ji',
    kana: 'じ',
    romaji: 'ji',
    kanaKanjiOrigin: '之',
    kanaDistractors: ['し', 'ぢ', 'さ'],
    romajiDistractors: ['si', 'zi', 'ci'],
    word: '時間',
    wordKana: 'じかん',
    wordRomaji: 'ji·ka·n',
    wordMeaning: { en: 'Time', zh: '时间', zhHant: '時間' },
    wordEmoji: '⏰',
    wordDistractors: ['しかん', 'ちかん', 'じがん'],
    wordNoteKey: 'studyKana.wordNotes.hza',
  }),

  ず: defineHDakuon({
    id: 'h-zu',
    kana: 'ず',
    romaji: 'zu',
    kanaKanjiOrigin: '寸',
    kanaDistractors: ['す', 'づ', 'む'],
    romajiDistractors: ['su', 'du', 'mu'],
    word: '地図',
    wordKana: 'ちず',
    wordRomaji: 'chi·zu',
    wordMeaning: { en: 'Map', zh: '地图', zhHant: '地圖' },
    wordEmoji: '🗺️',
    wordDistractors: ['ちす', 'ちづ', 'じず'],
  }),

  ぜ: defineHDakuon({
    id: 'h-ze',
    kana: 'ぜ',
    romaji: 'ze',
    kanaKanjiOrigin: '世', // 源自“世”
    kanaDistractors: ['せ', 'そ', 'ぞ'],
    romajiDistractors: ['se', 'so', 'zo'],
    word: '全部',
    wordKana: 'ぜんぶ',
    wordRomaji: 'ze·n·bu',
    wordMeaning: { en: 'All / Everything', zh: '全部', zhHant: '全部' },
    wordEmoji: '👐',
    wordDistractors: ['せんぶ', 'ぜんぷ', 'せんぷ'],
  }),

  ぞ: defineHDakuon({
    id: 'h-zo',
    kana: 'ぞ',
    romaji: 'zo',
    kanaKanjiOrigin: '曾', // 源自“曾”
    kanaDistractors: ['そ', 'ろ', 'ぜ'],
    romajiDistractors: ['so', 'ro', 'ze'],
    word: '象',
    wordKana: 'ぞう',
    wordRomaji: 'zo·u',
    wordMeaning: { en: 'Elephant', zh: '大象', zhHant: '大象' },
    wordEmoji: '🐘',
    wordDistractors: ['そう', 'ざう', 'しょう'],
  }),

  // ==========================================
  // D 行 (Da, Ji/Di, Zu/Du, De, Do)
  // ==========================================
  だ: defineHDakuon({
    id: 'h-da',
    kana: 'だ',
    romaji: 'da',
    kanaKanjiOrigin: '太', // 源自“太”
    kanaDistractors: ['た', 'な', 'が'],
    romajiDistractors: ['ta', 'na', 'ga'],
    word: '大学',
    wordKana: 'だいがく',
    wordRomaji: 'da·i·ga·ku',
    wordMeaning: { en: 'University', zh: '大学', zhHant: '大學' },
    wordEmoji: '🏫',
    wordDistractors: ['たいがく', 'だいがぐ', 'たがく'],
  }),

  // ⚠️ ぢ (di/ji) 发音同 じ (ji)
  ぢ: defineHDakuon({
    id: 'h-di', // ID 使用 di 以示区分，虽然发音是 ji
    kana: 'ぢ',
    romaji: 'ji', // 罗马音通常输入 di 或 ji，显示为 ji
    kanaKanjiOrigin: '知', // 源自“知”
    kanaDistractors: ['ち', 'じ', 'さ'],
    romajiDistractors: ['chi', 'shi', 'sa'],
    word: '鼻血',
    wordKana: 'はなぢ',
    wordRomaji: 'ha·na·ji',
    wordMeaning: { en: 'Nosebleed', zh: '鼻血', zhHant: '鼻血' },
    wordEmoji: '🩸',
    wordDistractors: ['はなち', 'はなじ', 'はなび'],
    noteKey: 'studyKana.notes.hdi',
  }),

  // ⚠️ づ (du/zu) 发音同 ず (zu)
  づ: defineHDakuon({
    id: 'h-du', // ID 使用 du
    kana: 'づ',
    romaji: 'zu', // 罗马音通常输入 du 或 zu，显示为 zu
    kanaKanjiOrigin: '川', // 源自“川”
    kanaDistractors: ['つ', 'ず', 'う'],
    romajiDistractors: ['tsu', 'su', 'u'],
    word: '続く',
    wordKana: 'つづく',
    wordRomaji: 'tsu·zu·ku',
    wordMeaning: { en: 'To continue', zh: '继续', zhHant: '繼續' },
    wordEmoji: '➡️',
    wordDistractors: ['つつく', 'つずく', 'づつく'],
    noteKey: 'studyKana.notes.hdu',
  }),

  で: defineHDakuon({
    id: 'h-de',
    kana: 'で',
    romaji: 'de',
    kanaKanjiOrigin: '天', // 源自“天”
    kanaDistractors: ['て', 'と', 'ど'],
    romajiDistractors: ['te', 'to', 'do'],
    word: '電話',
    wordKana: 'でんわ',
    wordRomaji: 'de·n·wa',
    wordMeaning: { en: 'Telephone', zh: '电话', zhHant: '電話' },
    wordEmoji: '☎️',
    wordDistractors: ['てんわ', 'でんは', 'てんは'],
  }),

  ど: defineHDakuon({
    id: 'h-do',
    kana: 'ど',
    romaji: 'do',
    kanaKanjiOrigin: '止', // 源自“止”
    kanaDistractors: ['と', 'こ', 'ご'],
    romajiDistractors: ['to', 'ko', 'go'],
    word: '土曜日',
    wordKana: 'どようび',
    wordRomaji: 'do·yo·u·bi',
    wordMeaning: { en: 'Saturday', zh: '周六', zhHant: '週六' },
    wordEmoji: '📅',
    wordDistractors: ['とようび', 'どようひ', 'とうようび'],
  }),

  // ==========================================
  // B 行 (Ba, Bi, Bu, Be, Bo)
  // ==========================================
  ば: defineHDakuon({
    id: 'h-ba',
    kana: 'ば',
    romaji: 'ba',
    kanaKanjiOrigin: '波', // 源自“波”
    kanaDistractors: ['は', 'ぱ', 'ほ'],
    romajiDistractors: ['ha', 'pa', 'ho'],
    word: '場所',
    wordKana: 'ばしょ',
    wordRomaji: 'ba·sho',
    wordMeaning: { en: 'Place', zh: '场所', zhHant: '場所' },
    wordEmoji: '📍',
    wordDistractors: ['はしょ', 'ぱしょ', 'ばしょう'],
  }),

  び: defineHDakuon({
    id: 'h-bi',
    kana: 'び',
    romaji: 'bi',
    kanaKanjiOrigin: '比', // 源自“比”
    kanaDistractors: ['ひ', 'ぴ', 'い'],
    romajiDistractors: ['hi', 'pi', 'i'],
    word: '瓶',
    wordKana: 'びん',
    wordRomaji: 'bi·n',
    wordMeaning: { en: 'Bottle', zh: '瓶子', zhHant: '瓶子' },
    wordEmoji: '🍾',
    wordDistractors: ['ひん', 'ぴん', 'べん'],
  }),

  ぶ: defineHDakuon({
    id: 'h-bu',
    kana: 'ぶ',
    romaji: 'bu',
    kanaKanjiOrigin: '不', // 源自“不”
    kanaDistractors: ['ふ', 'ぷ', 'む'],
    romajiDistractors: ['fu', 'pu', 'mu'],
    word: '豚',
    wordKana: 'ぶた',
    wordRomaji: 'bu·ta',
    wordMeaning: { en: 'Pig', zh: '猪', zhHant: '豬' },
    wordEmoji: '🐷',
    wordDistractors: ['ふた', 'ぷた', 'むた'],
  }),

  べ: defineHDakuon({
    id: 'h-be',
    kana: 'べ',
    romaji: 'be',
    kanaKanjiOrigin: '部', // 源自“部”
    kanaDistractors: ['へ', 'ぺ', 'て'],
    romajiDistractors: ['he', 'pe', 'te'],
    word: '勉強',
    wordKana: 'べんきょう',
    wordRomaji: 'be·n·kyo·u',
    wordMeaning: { en: 'Study', zh: '学习', zhHant: '學習' },
    wordEmoji: '📝',
    wordDistractors: ['へんきょう', 'ぺんきょう', 'べんきょ'],
  }),

  ぼ: defineHDakuon({
    id: 'h-bo',
    kana: 'ぼ',
    romaji: 'bo',
    kanaKanjiOrigin: '保',
    kanaDistractors: ['ほ', 'ぽ', 'ま'],
    romajiDistractors: ['ho', 'po', 'ma'],
    word: '帽子',
    wordKana: 'ぼうし',
    wordRomaji: 'bo·u·shi',
    wordMeaning: { en: 'Hat', zh: '帽子', zhHant: '帽子' },
    wordEmoji: '👒',
    wordDistractors: ['ほうし', 'ぽうし', 'ぼし'],
  }),

  // 半浊音 - 没有单词
  ぱ: defineHDakuon({
    id: 'h-pa',
    kana: 'ぱ',
    romaji: 'pa',
    kanaKanjiOrigin: '波',
    kanaDistractors: ['ば', 'は', 'ぬ'],
    romajiDistractors: ['ba', 'ha', 'nu'],
    // word: null,
    // wordKana: null,
    // wordRomaji: null,
    // wordMeaning: null,
    // wordEmoji: null,
    // wordDistractors: [],
  }),

  ぴ: defineHDakuon({
    id: 'h-pi',
    kana: 'ぴ',
    romaji: 'pi',
    kanaKanjiOrigin: '比',
    kanaDistractors: ['び', 'ひ', 'ら'],
    romajiDistractors: ['bi', 'hi', 'ra'],
    // word: null,
    // wordKana: null,
    // wordRomaji: null,
    // wordMeaning: null,
    // wordEmoji: null,
    // wordDistractors: [],
  }),

  ぷ: defineHDakuon({
    id: 'h-pu',
    kana: 'ぷ',
    romaji: 'pu',
    kanaKanjiOrigin: '不',
    kanaDistractors: ['ぶ', 'ふ', 'よ'],
    romajiDistractors: ['bu', 'fu', 'yo'],
    // word: null,
    // wordKana: null,
    // wordRomaji: null,
    // wordMeaning: null,
    // wordEmoji: null,
    // wordDistractors: [],
  }),

  ぺ: defineHDakuon({
    id: 'h-pe',
    kana: 'ぺ',
    romaji: 'pe',
    kanaKanjiOrigin: '部',
    kanaDistractors: ['べ', 'へ', 'く'],
    romajiDistractors: ['be', 'he', 'ku'],
    // word: null,
    // wordKana: null,
    // wordRomaji: null,
    // wordMeaning: null,
    // wordEmoji: null,
    // wordDistractors: [],
  }),

  ぽ: defineHDakuon({
    id: 'h-po',
    kana: 'ぽ',
    romaji: 'po',
    kanaKanjiOrigin: '保',
    kanaDistractors: ['ぼ', 'ほ', 'ま'],
    romajiDistractors: ['bo', 'ho', 'ma'],
    // word: null,
    // wordKana: null,
    // wordRomaji: null,
    // wordMeaning: null,
    // wordEmoji: null,
    // wordDistractors: [],
  }),
};
