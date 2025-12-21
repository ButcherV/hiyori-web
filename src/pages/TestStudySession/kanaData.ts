// src/pages/TestStudySession/kanaData.ts

// --- 1. 数据类型定义 ---

// 多语言文本接口
export interface LocalizedText {
  en: string;
  zh: string;
}

// 辅助类型：限制数组长度
type FixedLengthArray<T, L extends number, R extends T[] = []> = 
  R['length'] extends L ? R : FixedLengthArray<T, L, [...R, T]>;

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
  'あ': { 
    char: 'あ', 
    romaji: 'a', 
    word: 'あい', 
    wordRomaji: 'ai', 
    kanji: '愛', 
    meaning: { 
        en: 'love; amor; affection', 
        zh: '爱' 
    }, 
    romajiDistractors: ['o', 'ou', 'au'],     
    charDistractors: ['お', 'め', 'ぬ'],       
    wordDistractors: ['あり', 'ぬい', 'めい'] 
  },
  'い': { 
    char: 'い', 
    romaji: 'i', 
    word: 'いえ', 
    wordRomaji: 'ie', 
    kanji: '家', 
    meaning: { en: 'family; house', zh: '房子；家' },
    romajiDistractors: ['e', 'ei', 'ie'],
    charDistractors: ['り', 'こ', 'に'],
    wordDistractors: ['りえ', 'いう', 'いら', 'こえ'] 
  },
  'う': { 
    char: 'う', 
    romaji: 'u', 
    word: 'うえ', 
    wordRomaji: 'ue', 
    kanji: '上', 
    meaning: { en: 'up; superior', zh: '上面' },
    romajiDistractors: ['wu', 'eu', 'ui'],
    charDistractors: ['え', 'ラ', 'ら'],
    wordDistractors: ['うら', 'えう', 'ラら', 'ラえ'] 
  },
  'え': { 
    char: 'え', 
    charDistractors: ['う', 'ラ', 'ら'],
    romaji: 'e', 
    romajiDistractors: ['wu', 'eu', 'ui'],
    word: 'えき', 
    wordRomaji: 'eki', 
    kanji: '駅', 
    meaning: { en: '(train) station', zh: '车站' },
    wordDistractors: ['あき', 'うき', 'ラき', 'ラえ', 'えさ', 'ラさ'] 
  },
  'お': { 
    char: 'お', 
    charDistractors: ['あ', 'む', 'す'],
    romaji: 'o', 
    romajiDistractors: ['ou', 'o', 'wo'],
    kanji: '青い', 
    word: 'あおい', 
    wordRomaji: 'aoi', 
    meaning: { en: 'blue; green', zh: '蓝色；年轻的' },
    wordDistractors: ['あさい', 'おさい', 'おあい'] 
  },
};