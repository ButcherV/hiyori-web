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
    wordMeaning: { en: 'student', zh: '学生', zhHant: '學生' },
    wordEmoji: '🎓',
    wordDistractors: ['かくせい', 'がくぜい', 'かせくい'],
  }),

  ぎ: defineHDakuon({
    id: 'h-gi',
    kana: 'ぎ',
    romaji: 'gi',
    kanaKanjiOrigin: '幾',
    kanaDistractors: ['き', 'さ', 'ざ'],
    romajiDistractors: ['ki', 'sa', 'ji', 'giu'],
    word: '銀行',
    wordKana: 'ぎんこう',
    wordRomaji: 'gi·n·ko·u',
    wordMeaning: { en: 'bank', zh: '银行', zhHant: '銀行' },
    wordEmoji: '🏦',
    wordDistractors: ['ぎこんう', 'きんこう', 'ぎんごう', 'きんごう'],
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
    wordMeaning: { en: 'furniture', zh: '家具', zhHant: '家具' },
    wordEmoji: '🛋️',
    wordDistractors: ['かく', 'がぐ', 'ぐか'],
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
      en: 'healthy; fine',
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
    romajiDistractors: ['ko', 'no', 'dou'],
    word: 'ご飯',
    wordKana: 'ごはん',
    wordRomaji: 'go·ha·n',
    wordMeaning: { en: 'rice; meal', zh: '米饭', zhHant: '米飯' },
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
    wordMeaning: { en: 'magazine', zh: '杂志', zhHant: '雜誌' },
    wordEmoji: '📕',
    wordDistractors: ['さっし', 'ざし', 'さし'],
    wordNoteKey: 'studyKana.wordNotes.hSokuon',
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
    wordMeaning: { en: 'time', zh: '时间', zhHant: '時間' },
    wordEmoji: '⏰',
    wordDistractors: ['しかん', 'ちかん', 'じがん'],
    noteKey: 'studyKana.notes.hji',
  }),

  ず: defineHDakuon({
    id: 'h-zu',
    kana: 'ず',
    romaji: 'zu',
    kanaKanjiOrigin: '寸',
    kanaDistractors: ['す', 'づ', 'む'],
    romajiDistractors: ['su', 'du', 'zi'],
    word: '地図',
    wordKana: 'ちず',
    wordRomaji: 'chi·zu',
    wordMeaning: { en: 'map', zh: '地图', zhHant: '地圖' },
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
    wordMeaning: { en: 'all; everything', zh: '全部', zhHant: '全部' },
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
    wordMeaning: { en: 'elephant', zh: '大象', zhHant: '大象' },
    wordEmoji: '🐘',
    wordDistractors: ['そう', 'ざう', 'ぜう'],
    wordNoteKey: 'studyKana.wordNotes.hLongVowel',
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
    wordMeaning: { en: 'university', zh: '大学', zhHant: '大學' },
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
    wordMeaning: { en: 'nosebleed', zh: '鼻血', zhHant: '鼻血' },
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
    wordMeaning: { en: 'telephone', zh: '电话', zhHant: '電話' },
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
    word: '道',
    wordKana: 'どう',
    wordRomaji: 'do·u',
    wordMeaning: { en: 'road; way', zh: '道路', zhHant: '道路' },
    wordEmoji: '🛣️',
    wordDistractors: ['とう', 'こう', 'ごう'],
    wordNoteKey: 'studyKana.wordNotes.hLongVowel',
  }),

  // ==========================================
  // B 行 (Ba, Bi, Bu, Be, Bo)
  // ==========================================
  ば: defineHDakuon({
    id: 'h-ba',
    kana: 'ば',
    romaji: 'ba',
    kanaKanjiOrigin: '波',
    kanaDistractors: ['は', 'ぱ', 'ほ'],
    romajiDistractors: ['ha', 'pa', 'ho'],
    word: '鞄',
    wordKana: 'かばん',
    wordRomaji: 'ka·ba·n',
    wordMeaning: { en: 'bag', zh: '包', zhHant: '包' },
    wordEmoji: '👜',
    wordDistractors: ['かはん', 'かぱん', 'がばん'],
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
    wordMeaning: { en: 'bottle', zh: '瓶子', zhHant: '瓶子' },
    wordEmoji: '🍶',
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
    wordMeaning: { en: 'pig', zh: '猪', zhHant: '豬' },
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
    word: '鍋',
    wordKana: 'なべ',
    wordRomaji: 'na·be',
    wordMeaning: { en: 'pot; pan', zh: '锅', zhHant: '鍋' },
    wordEmoji: '🫕',
    wordDistractors: ['なへ', 'なぺ', 'はべ'],
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
    wordMeaning: { en: 'hat', zh: '帽子', zhHant: '帽子' },
    wordEmoji: '👒',
    wordDistractors: ['ほうし', 'ぽうし', 'ぼし'],
    wordNoteKey: 'studyKana.wordNotes.hLongVowel',
  }),

  // 半浊音
  ぱ: defineHDakuon({
    id: 'h-pa',
    kana: 'ぱ',
    romaji: 'pa',
    kanaKanjiOrigin: '波',
    kanaDistractors: ['ば', 'は', 'ぬ'],
    romajiDistractors: ['ba', 'ha', 'nu'],
    word: '散歩',
    wordKana: 'さんぽ',
    wordRomaji: 'sa·n·po',
    wordMeaning: { en: 'walk; stroll', zh: '散步', zhHant: '散步' },
    wordEmoji: '🚶',
    wordDistractors: ['さんぼ', 'さんほ', 'たんぽ'],
  }),

  ぴ: defineHDakuon({
    id: 'h-pi',
    kana: 'ぴ',
    romaji: 'pi',
    kanaKanjiOrigin: '比',
    kanaDistractors: ['び', 'ひ', 'ら'],
    romajiDistractors: ['bi', 'hi', 'ra'],
    word: '鉛筆',
    wordKana: 'えんぴつ',
    wordRomaji: 'e·n·pi·tsu',
    wordMeaning: { en: 'pencil', zh: '铅笔', zhHant: '鉛筆' },
    wordEmoji: '✏️',
    wordDistractors: ['えんびつ', 'えんひつ', 'えんぷつ'],
  }),

  ぷ: defineHDakuon({
    id: 'h-pu',
    kana: 'ぷ',
    romaji: 'pu',
    kanaKanjiOrigin: '不',
    kanaDistractors: ['ぶ', 'ふ', 'よ'],
    romajiDistractors: ['bu', 'fu', 'yo'],
    word: '天ぷら',
    wordKana: 'てんぷら',
    wordRomaji: 'te·n·pu·ra',
    wordMeaning: { en: 'tempura', zh: '天妇罗', zhHant: '天婦羅' },
    wordEmoji: '🍤',
    wordDistractors: ['てんぶら', 'てんふら', 'てんくら'],
  }),

  ぺ: defineHDakuon({
    id: 'h-pe',
    kana: 'ぺ',
    romaji: 'pe',
    kanaKanjiOrigin: '部',
    kanaDistractors: ['べ', 'へ', 'く'],
    romajiDistractors: ['be', 'he', 'ku'],
  }),

  ぽ: defineHDakuon({
    id: 'h-po',
    kana: 'ぽ',
    romaji: 'po',
    kanaKanjiOrigin: '保',
    kanaDistractors: ['ぼ', 'ほ', 'ま'],
    romajiDistractors: ['bo', 'ho', 'ma'],
    word: '一歩',
    wordKana: 'いっぽ',
    wordRomaji: 'i·ppo',
    wordMeaning: { en: 'one step', zh: '一步', zhHant: '一步' },
    wordEmoji: '👣',
    wordDistractors: ['いっぼ', 'いっほ', 'いぽ'],
    wordNoteKey: 'studyKana.wordNotes.hSokuon',
  }),
};
