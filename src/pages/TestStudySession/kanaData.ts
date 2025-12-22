// src/pages/TestStudySession/kanaData.ts

// --- 1. 数据类型定义 ---

// 多语言文本接口
export interface LocalizedText {
  en: string;
  zh: string;
}

// 辅助类型：限制数组长度
type FixedLengthArray<
  T,
  L extends number,
  R extends T[] = [],
> = R['length'] extends L ? R : FixedLengthArray<T, L, [...R, T]>;

type Range3to6<T> =
  | FixedLengthArray<T, 3>
  | FixedLengthArray<T, 4>
  | FixedLengthArray<T, 5>
  | FixedLengthArray<T, 6>;

export interface KanaEntry {
  char: string;
  romaji: string;
  word: string;
  wordRomaji: string;
  kanji: string;

  meaning: LocalizedText;

  romajiDistractors: Range3to6<string>;
  charDistractors: Range3to6<string>;
  wordDistractors: Range3to6<string>;
}

// --- 2. 静态数据库 ---
export const KANA_DB: Record<string, KanaEntry> = {
  あ: {
    char: 'あ',
    romaji: 'a',
    word: 'あい',
    wordRomaji: 'ai',
    kanji: '愛',
    meaning: {
      en: 'love; amor; affection',
      zh: '爱',
    },
    romajiDistractors: ['o', 'ou', 'au'],
    charDistractors: ['お', 'め', 'ぬ'],
    wordDistractors: ['あり', 'ぬい', 'めい'],
  },
  い: {
    char: 'い',
    romaji: 'i',
    word: 'いえ',
    wordRomaji: 'ie',
    kanji: '家',
    meaning: { en: 'family; house', zh: '房子；家' },
    romajiDistractors: ['e', 'ei', 'ie'],
    charDistractors: ['り', 'こ', 'に'],
    wordDistractors: ['りえ', 'いう', 'いら', 'こえ'],
  },
  う: {
    char: 'う',
    romaji: 'u',
    word: 'うえ',
    wordRomaji: 'ue',
    kanji: '上',
    meaning: { en: 'up; superior', zh: '上面' },
    romajiDistractors: ['wu', 'eu', 'ui'],
    charDistractors: ['え', 'ラ', 'ら'],
    wordDistractors: ['うら', 'えう', 'ラら', 'ラえ'],
  },
  え: {
    char: 'え',
    charDistractors: ['う', 'ラ', 'ら'],
    romaji: 'e',
    romajiDistractors: ['wu', 'eu', 'ui'],
    word: 'えき',
    wordRomaji: 'eki',
    kanji: '駅',
    meaning: { en: '(train) station', zh: '车站' },
    wordDistractors: ['あき', 'うき', 'ラき', 'ラえ', 'えさ', 'ラさ'],
  },
  お: {
    char: 'お',
    charDistractors: ['あ', 'む', 'す'],
    romaji: 'o',
    romajiDistractors: ['ou', 'o', 'wo'],
    kanji: '青い',
    word: 'あおい',
    wordRomaji: 'aoi',
    meaning: { en: 'blue; green', zh: '蓝色；年轻的' },
    wordDistractors: ['あさい', 'おさい', 'おあい'],
  },
  か: {
    char: 'か',
    charDistractors: ['が', 'や', 'わ'],
    romaji: 'ka',
    romajiDistractors: ['ga', 'ko', 'kya'],
    kanji: '赤い',
    word: 'あかい',
    wordRomaji: 'akai',
    meaning: { en: 'red', zh: '红色的' },
    wordDistractors: ['あがい', 'おかい', 'あやい'],
  },
  き: {
    char: 'き',
    charDistractors: ['ぎ', 'さ', 'ち'],
    romaji: 'ki',
    romajiDistractors: ['gi', 'ky', 'ke'],
    kanji: '秋',
    word: 'あき',
    wordRomaji: 'aki',
    meaning: { en: 'autumn', zh: '秋天' },
    wordDistractors: ['あさ', 'あぎ', 'おき'],
  },
  く: {
    char: 'く',
    charDistractors: ['ぐ', 'へ', 'し'],
    romaji: 'ku',
    romajiDistractors: ['gu', 'qu', 'ko'],
    kanji: '靴',
    word: 'くつ',
    wordRomaji: 'kutsu',
    meaning: { en: 'shoes', zh: '鞋子' },
    wordDistractors: ['ぐつ', 'へつ', 'しつ'],
  },
  け: {
    char: 'け',
    charDistractors: ['げ', 'は', 'に'],
    romaji: 'ke',
    romajiDistractors: ['ge', 'ki', 'ka'],
    kanji: '池',
    word: 'いけ',
    wordRomaji: 'ike',
    meaning: { en: 'pond', zh: '池塘' },
    wordDistractors: ['いげ', 'いは', 'りけ'],
  },
  こ: {
    char: 'こ',
    charDistractors: ['ご', 'に', 'て'],
    romaji: 'ko',
    romajiDistractors: ['go', 'kou', 'ka'],
    kanji: '猫',
    word: 'ねこ',
    wordRomaji: 'neko',
    meaning: { en: 'cat', zh: '猫' },
    wordDistractors: ['ねご', 'ぬこ', 'ねに'],
  },
};
