// src/pages/TestStudySession/lessonLogic.ts

export type TaskType = 'LEARN' | 'TRACE' | 'QUIZ';
export type SubType = 'SHAPE' | 'CONTEXT' | 'ROMAJI' | 'WORD';

export interface LessonCard {
  id: string;
  type: TaskType;
  subType: SubType;
  
  // 🔥 核心数据
  char: string;     
  romaji: string;   // 单个假名的罗马音 (如 'a')
  wordRomaji?: string; // 🔥 [新增] 单词的罗马音 (如 'ari')
  
  word?: string;    // 单词假名 (如 'あり')
  kanji?: string;   // 单词汉字 (如 '蟻')
  meaning?: string; 
  
  displayContent: string; // 卡片中间显示的内容
  
  // 🔥 Quiz 专用逻辑
  quizGroupId?: string; 
  targetChar?: string; 
  
  // 🔥 [新增] 专门为了 Quiz 2 的 Header 显示用的
  // 必须把题目的汉字和罗马音带在每一张卡片上，否则 Header 没法显示 "Find 蟻 (ari)"
  targetKanji?: string;      
  targetWordRomaji?: string;

  isCorrect?: boolean; 
}

// 🔥 1. 升级数据库，增加 wordRomaji 字段
const KANA_DB: Record<string, { char: string, romaji: string, word: string, wordRomaji: string, kanji: string, meaning: string }> = {
  'あ': { char: 'あ', romaji: 'a', word: 'あり', wordRomaji: 'ari', kanji: '蟻', meaning: 'Ant' },
  'い': { char: 'い', romaji: 'i', word: 'いぬ', wordRomaji: 'inu', kanji: '犬', meaning: 'Dog' },
  'う': { char: 'う', romaji: 'u', word: 'うみ', wordRomaji: 'umi', kanji: '海', meaning: 'Sea' },
  'え': { char: 'え', romaji: 'e', word: 'えき', wordRomaji: 'eki', kanji: '駅', meaning: 'Station' },
  'お': { char: 'お', romaji: 'o', word: 'おに', wordRomaji: 'oni', kanji: '鬼', meaning: 'Demon' },
};

// --- Helper Functions ---

const createLearn = (char: string, subType: 'SHAPE' | 'CONTEXT'): LessonCard => {
  const data = KANA_DB[char];
  return {
    id: `learn-${char}-${subType}-${Date.now()}`,
    type: 'LEARN',
    subType: subType,
    char: data.char,
    romaji: data.romaji,
    
    // 🔥 注入单词罗马音
    wordRomaji: data.wordRomaji,
    
    word: data.word,
    kanji: data.kanji,
    meaning: data.meaning,
    displayContent: subType === 'SHAPE' ? data.char : data.kanji, 
  };
};

const createTrace = (char: string): LessonCard => {
  return {
    id: `trace-${char}-${Date.now()}`,
    type: 'TRACE',
    subType: 'SHAPE',
    char: char,
    romaji: KANA_DB[char].romaji,
    displayContent: char
  };
};

const createQuiz = (target: string, distractors: string[], type: 'ROMAJI' | 'WORD'): LessonCard[] => {
  const targetData = KANA_DB[target];
  const cards: LessonCard[] = [];
  const groupId = `group-${target}-${type}-${Date.now()}`;

  const getContent = (d: typeof targetData) => type === 'ROMAJI' ? d.romaji : d.word;

  // 1. 添加正确项
  cards.push({
    id: `${groupId}-correct`,
    type: 'QUIZ',
    subType: type,
    quizGroupId: groupId,
    char: targetData.char,
    romaji: targetData.romaji,
    word: targetData.word,
    kanji: targetData.kanji,
    
    displayContent: getContent(targetData),
    targetChar: targetData.char,
    
    // 🔥 [新增] 把题目的汉字和单词罗马音带上 (Quiz 2 Header 要用)
    targetKanji: targetData.kanji,
    targetWordRomaji: targetData.wordRomaji,
    
    isCorrect: true
  });

  // 2. 添加干扰项
  distractors.forEach(dChar => {
    const dData = KANA_DB[dChar];
    if (dData) {
      cards.push({
        id: `${groupId}-wrong-${dChar}`,
        type: 'QUIZ',
        subType: type,
        quizGroupId: groupId,
        char: dData.char, // 这里的 char 是干扰项自己的 char
        romaji: dData.romaji,
        word: dData.word,
        kanji: dData.kanji,
        
        displayContent: getContent(dData),
        targetChar: targetData.char, // 🔥 题目依然是找 Target
        
        // 🔥 [新增] 干扰项也要带上题目的信息！否则滑到干扰项时 Header 会变！
        targetKanji: targetData.kanji,
        targetWordRomaji: targetData.wordRomaji,
        
        isCorrect: false
      });
    }
  });

  return cards.sort(() => 0.5 - Math.random());
};

export const getRemedialCards = (char: string): LessonCard[] => {
  const distractor = char === 'あ' ? 'い' : 'あ'; 
  return [
    createLearn(char, 'SHAPE'),
    ...createQuiz(char, [distractor], 'ROMAJI')
  ];
};

export const generateWaveSequence = (): LessonCard[] => {
  const sequence: LessonCard[] = [];

  // Demo: 学 あ
  sequence.push(createLearn('あ', 'SHAPE'));
  sequence.push(createLearn('あ', 'CONTEXT'));
  sequence.push(createTrace('あ'));
  
  // 测1: 读音
  sequence.push(...createQuiz('あ', ['い', 'う'], 'ROMAJI'));

  // 测2: 单词 (这里 Header 应该显示 蟻 / ari)
  sequence.push(...createQuiz('あ', ['い', 'う'], 'WORD'));

  return sequence;
};