export interface LocalizedText {
  en: string;
  zh: string;
}

export interface KanaEntry {
  char: string;
  romaji: string;
  word: string;
  wordRomaji: string;
  kanji: string;
  kanjiOrigin?: string;
  meaning: LocalizedText;
  // 保持宽松定义，让 defineKana 处理严格校验
  romajiDistractors: readonly string[];
  charDistractors: readonly string[];
  wordDistractors: readonly string[];
}

// --- 点对点精准验证器 ---
/**
 * 这是一个映射类型 (Mapped Type)。
 * 它会遍历 Distractors 数组里的每一项 [K in keyof Distractors]。
 * * 逻辑：
 * 1. 先检查数组总长度。如果不合法，返回一个整体报错的类型。
 * 2. 如果长度合法，逐个检查元素：
 * - 如果该元素 == Answer，把它的类型强制变成一个只有报错信息的字符串字面量。
 * - 否则，保持它原来的类型。
 */
type PreciseValidator<
  Distractors extends readonly string[],
  Answer extends string,
> =
  // 检查长度
  Distractors['length'] extends 3 | 4 | 5 | 6
    ? {
        // 遍历每一项
        [K in keyof Distractors]: Distractors[K] extends Answer
          ? '❌ 错误：不能包含正确答案' // 👈 只有撞车的这一项会变成这个类型，导致报错
          : Distractors[K]; // 👈 其他项保持原样
      }
    : readonly ['❌ 错误：干扰项数量必须在 3 到 6 个之间']; // 长度错误依然报在整体上

// --- 3. 构造函数 defineKana ---

const defineKana = <
  const C extends string,
  const R extends string,
  const W extends string,
  const RD extends readonly string[],
  const CD extends readonly string[],
  const WD extends readonly string[],
>(data: {
  char: C;
  romaji: R;
  word: W;
  wordRomaji: string;
  kanji: string;
  meaning: LocalizedText;
  kanjiOrigin?: string;

  romajiDistractors: PreciseValidator<RD, R>;
  charDistractors: PreciseValidator<CD, C>;
  wordDistractors: PreciseValidator<WD, W>;
}): KanaEntry => {
  // 强转返回，因为 PreciseValidator 产生的类型在运行时其实就是 string[]
  return data as unknown as KanaEntry;
};

export const KANA_DB: Record<string, KanaEntry> = {
  あ: defineKana({
    char: 'あ',
    kanjiOrigin: '安',
    romaji: 'a',
    word: 'あい',
    wordRomaji: 'a·i',
    kanji: '愛',
    meaning: {
      en: 'love; affection',
      zh: '爱',
    },
    romajiDistractors: ['o', 'ou', 'au'],
    charDistractors: ['お', 'め', 'ぬ'],
    wordDistractors: ['あり', 'ぬい', 'めい'],
  }),
  い: defineKana({
    char: 'い',
    kanjiOrigin: '以',
    romaji: 'i',
    word: 'いえ',
    wordRomaji: 'i·e',
    kanji: '家',
    meaning: { en: 'family; house', zh: '房子；家' },
    romajiDistractors: ['e', 'ei', 'ie'],
    charDistractors: ['り', 'こ', 'に'],
    wordDistractors: ['りえ', 'いう', 'いら', 'こえ'],
  }),
  う: defineKana({
    char: 'う',
    kanjiOrigin: '宇',
    romaji: 'u',
    word: 'うえ',
    wordRomaji: 'u·e',
    kanji: '上',
    meaning: { en: 'up; superior', zh: '上面' },
    romajiDistractors: ['wu', 'eu', 'ui'],
    charDistractors: ['え', 'ラ', 'ら'],
    wordDistractors: ['うら', 'えう', 'ラら', 'ラえ'],
  }),
  え: defineKana({
    char: 'え',
    kanjiOrigin: '衣',
    charDistractors: ['う', 'ラ', 'ら'],
    romaji: 'e',
    romajiDistractors: ['wu', 'eu', 'ui'],
    word: 'えき',
    wordRomaji: 'e·ki',
    kanji: '駅',
    meaning: { en: '(train) station', zh: '车站' },
    wordDistractors: ['あき', 'うき', 'ラき', 'ラえ', 'えさ', 'ラさ'],
  }),
  お: defineKana({
    char: 'お',
    kanjiOrigin: '於',
    charDistractors: ['あ', 'む', 'す'],
    romaji: 'o',
    romajiDistractors: ['ou', 'uo', 'wo'],
    kanji: '青い',
    word: 'あおい',
    wordRomaji: 'a·o·i',
    meaning: { en: 'blue; green', zh: '蓝色；年轻的' },
    wordDistractors: ['あさい', 'おさい', 'おあい'],
  }),
  か: defineKana({
    char: 'か',
    kanjiOrigin: '加',
    charDistractors: ['が', 'や', 'わ'],
    romaji: 'ka',
    romajiDistractors: ['ga', 'ko', 'kya'],
    kanji: '赤い',
    word: 'あかい',
    wordRomaji: 'a·ka·i',
    meaning: { en: 'red; crimson', zh: '红色的；革命的' },
    wordDistractors: ['あがい', 'おかい', 'あやい'],
  }),
  き: defineKana({
    char: 'き',
    kanjiOrigin: '幾',
    charDistractors: ['ぎ', 'さ', 'ち'],
    romaji: 'ki',
    romajiDistractors: ['gi', 'ky', 'ke'],
    kanji: '秋',
    word: 'あき',
    wordRomaji: 'a·ki',
    meaning: { en: 'autumn; fall', zh: '秋季；秋天' },
    wordDistractors: ['あさ', 'あぎ', 'おき'],
  }),
  く: defineKana({
    char: 'く',
    kanjiOrigin: '久',
    charDistractors: ['ぐ', 'へ', 'し'],
    romaji: 'ku',
    romajiDistractors: ['gu', 'qu', 'ko'],
    kanji: '靴',
    word: 'くつ',
    wordRomaji: 'ku·tsu',
    meaning: { en: 'boots; shoes', zh: '鞋；靴子' },
    wordDistractors: ['ぐつ', 'へつ', 'しつ'],
  }),
  け: defineKana({
    char: 'け',
    kanjiOrigin: '計',
    charDistractors: ['げ', 'は', 'に'],
    romaji: 'ke',
    romajiDistractors: ['ge', 'ki', 'ka'],
    kanji: '池',
    word: 'いけ',
    wordRomaji: 'i·ke',
    meaning: { en: 'pond', zh: '池塘；水池' },
    wordDistractors: ['いげ', 'いは', 'りけ'],
  }),
  こ: defineKana({
    char: 'こ',
    kanjiOrigin: '己',
    charDistractors: ['ご', 'に', 'て'],
    romaji: 'ko',
    romajiDistractors: ['go', 'kou', 'ka'],
    kanji: '猫',
    word: 'ねこ',
    wordRomaji: 'ne·ko',
    meaning: { en: 'cat', zh: '猫' },
    wordDistractors: ['ねご', 'ぬこ', 'ねに'],
  }),
  さ: defineKana({
    char: 'さ',
    kanjiOrigin: '左',
    charDistractors: ['き', 'ち', 'ざ'],
    romaji: 'sa',
    romajiDistractors: ['zo', 'so', 'ki', 'so'],
    kanji: '傘',
    word: 'かさ',
    wordRomaji: 'ka·sa',
    meaning: { en: 'umbrella', zh: '伞；伞状物' },
    wordDistractors: ['かざ', 'かき', 'がさ'],
  }),
  し: defineKana({
    char: 'し',
    kanjiOrigin: '之',
    charDistractors: ['つ', 'も', 'じ'],
    romaji: 'shi',
    romajiDistractors: ['si', 'ji', 'chi'],
    kanji: '牛',
    word: 'うし',
    wordRomaji: 'u·shi',
    meaning: { en: 'cattle', zh: '牛' },
    wordDistractors: ['うじ', 'うつ', 'おし'],
  }),
  す: defineKana({
    char: 'す',
    kanjiOrigin: '寸',
    charDistractors: ['む', 'ぬ', 'ず'],
    romaji: 'su',
    romajiDistractors: ['zu', 'si', 'cu', 'ci'],
    kanji: '寿司',
    word: 'すし',
    wordRomaji: 'su·shi',
    meaning: { en: 'sushi', zh: '寿司' },
    wordDistractors: ['ずし', 'すじ', 'さし'],
  }),
  せ: defineKana({
    char: 'せ',
    kanjiOrigin: '世',
    charDistractors: ['サ', 'ぜ', 'や'],
    romaji: 'se',
    romajiDistractors: ['ze', 'sa', 'she', 'ci'],
    kanji: '汗',
    word: 'あせ',
    wordRomaji: 'a·se',
    meaning: { en: 'sweat', zh: '汗水；汗液' },
    wordDistractors: ['あぜ', 'あさ', 'おせ'],
  }),
  そ: defineKana({
    char: 'そ',
    kanjiOrigin: '曾',
    charDistractors: ['ぞ', 'ろ', 'て'],
    romaji: 'so',
    romajiDistractors: ['zo', 'zo', 'no'],
    kanji: '空',
    word: 'そら',
    wordRomaji: 'so·ra',
    meaning: { en: 'sky; air', zh: '天空；上空' },
    wordDistractors: ['ぞら', 'さら', 'そろ'],
  }),
};
