// src/pages/TestStudySession/lessonLogic.ts

// 🔥 引入数据和类型
import { KANA_DB, type LocalizedText } from './kanaData';

// --- 1. 类型定义 ---
export type TaskType = 'LEARN' | 'TRACE' | 'QUIZ';
export type SubType = 'SHAPE' | 'CONTEXT' | 'ROMAJI' | 'KANA' | 'WORD';

// LocalizedText 已经移到 kanaData.ts，这里直接使用 import 进来的即可

export interface LessonCard {
  id: string;
  type: TaskType;
  subType: SubType;
  
  // 基础数据
  char: string;
  romaji: string;
  word?: string;
  kanji?: string;
  
  // meaning 使用引入的 LocalizedText 类型
  meaning?: LocalizedText;
  
  wordRomaji?: string;
  
  // 视图显示
  displayContent: string;
  
  // Quiz 专用逻辑
  quizGroupId?: string;
  isCorrect?: boolean; 
  
  // Header 显示专用字段
  headerTitle?: string;
  headerSub?: string | LocalizedText;

  // 字体样式标记 (True = 使用日语字体, False = 使用默认字体)
  isHeaderJa?: boolean;
  isContentJa?: boolean;

  // 定制补救卡文案
  customTitle?: string;
}

// (FixedLengthArray, Range3to6, KanaEntry, KANA_DB 均已移至 kanaData.ts)

// --- 3. 辅助工具函数 ---

const getRandomSubarray = (arr: string[], count: number) => {
  const shuffled = arr.slice(0);
  let i = arr.length;
  let temp, index;
  while (i--) {
    index = Math.floor(Math.random() * (i + 1));
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, count);
};

// 🔥🔥🔥 新增：Fisher-Yates 洗牌算法 🔥🔥🔥
// 用于打乱"题目包"的顺序，保证题目乱序但题目内部（选项）不散
const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// 生成学习卡
const createLearn = (char: string, subType: 'SHAPE' | 'CONTEXT'): LessonCard => {
  const data = KANA_DB[char];
  if (!data) return {} as LessonCard;

  return {
    id: `learn-${char}-${subType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: 'LEARN',
    subType: subType,
    char: data.char,
    romaji: data.romaji,
    word: data.word,
    kanji: data.kanji,
    wordRomaji: data.wordRomaji,
    
    // 透传 meaning 对象
    meaning: data.meaning,
    
    displayContent: subType === 'SHAPE' ? data.char : data.kanji, 
    headerTitle: subType === 'SHAPE' ? 'New Kana' : 'New Word',

    // 样式逻辑
    isHeaderJa: false, 
    isContentJa: true,
  };
};

// 生成描红卡
const createTrace = (char: string): LessonCard => {
  const data = KANA_DB[char];
  return {
    id: `trace-${char}-${Date.now()}`,
    type: 'TRACE',
    subType: 'SHAPE',
    char: char,
    romaji: data.romaji,
    displayContent: char,
    headerTitle: 'Stroke Practice',
    
    // 样式逻辑
    isHeaderJa: false,
    isContentJa: true,
  };
};

// 核心：createQuiz 自动标记字体
const createQuiz = (target: string, type: 'ROMAJI' | 'KANA' | 'WORD'): LessonCard[] => {
  const data = KANA_DB[target];
  if (!data) return [];

  const cards: LessonCard[] = []; 
  const groupId = `group-${target}-${type}-${Date.now()}`;

  let questionTitle = '';
  let questionSub: string | LocalizedText = '';
  let correctAnswer = '';
  let distractorPool: string[] = [];
  
  let isHeaderJa = false;
  let isContentJa = false;

  switch (type) {
    case 'ROMAJI': 
      // [题] 假名 -> [选] 罗马音
      questionTitle = data.char;
      correctAnswer = data.romaji;
      distractorPool = data.romajiDistractors;
      isHeaderJa = true;
      isContentJa = false;
      break;

    case 'KANA':
      // [题] 罗马音 -> [选] 假名
      questionTitle = data.romaji;
      correctAnswer = data.char;
      distractorPool = data.charDistractors;
      isHeaderJa = false;
      isContentJa = true;
      break;

    case 'WORD':
      // [题] 汉字 -> [选] 假名单词
      questionTitle = data.kanji;
      questionSub = data.meaning;
      correctAnswer = data.word;
      distractorPool = data.wordDistractors;
      isHeaderJa = true;
      isContentJa = true;
      break;
  }

  // === 生成正确卡 ===
  cards.push({
    id: `${groupId}-correct`,
    type: 'QUIZ',
    subType: type,
    quizGroupId: groupId,
    
    char: data.char,
    romaji: data.romaji,
    word: data.word,
    kanji: data.kanji,
    wordRomaji: data.wordRomaji,
    meaning: data.meaning, // 透传 meaning
    
    headerTitle: questionTitle,
    headerSub: questionSub,
    displayContent: correctAnswer,
    
    isHeaderJa,
    isContentJa,
    
    isCorrect: true
  });

  // === 生成干扰卡 ===
  const countToPick = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
  const selectedDistractors = getRandomSubarray(distractorPool, countToPick);

  selectedDistractors.forEach((dText, idx) => {
    cards.push({
      id: `${groupId}-wrong-${idx}`,
      type: 'QUIZ',
      subType: type,
      quizGroupId: groupId,
      
      char: data.char,
      romaji: data.romaji,
      word: data.word,
      kanji: data.kanji,
      wordRomaji: data.wordRomaji,
      
      headerTitle: questionTitle,
      headerSub: questionSub,
      displayContent: dText,
      
      isHeaderJa,
      isContentJa,
      
      isCorrect: false
    });
  });

  return cards.sort(() => 0.5 - Math.random());
};

// --- 4. 导出逻辑函数 ---

export const getRemedialCards = (char: string, failedType: SubType): LessonCard[] => {
  if (failedType === 'WORD') {
    const learnCard = createLearn(char, 'CONTEXT');
    learnCard.customTitle = "Review Word";
    return [learnCard, ...createQuiz(char, 'WORD')];
  }

  const learnCard = createLearn(char, 'SHAPE');
  learnCard.customTitle = "Review Kana";
  const retryType = failedType === 'KANA' ? 'KANA' : 'ROMAJI';

  return [learnCard, ...createQuiz(char, retryType)];
};

// 🔥🔥🔥 核心重构：符合记忆曲线的三波次生成器 🔥🔥🔥
// 接收 targetChars 数组（例如 ['あ', 'い', 'う']）
export const generateWaveSequence = (
  targetChars: string[] = Object.keys(KANA_DB)
): LessonCard[] => {
  
  // 1. 数据清洗：确保数据库里有这些字
  const validChars = targetChars.filter(char => KANA_DB[char]);

  if (validChars.length === 0) return [];

  // === 第一波：批量认知 (Intro) ===
  // 连续看所有字的字形，混个脸熟
  const phase1: LessonCard[] = validChars.map(char => 
    createLearn(char, 'SHAPE')
  );

  // === 第二波：深化与书写 (Deepening) ===
  // 此时距离第一波已经过了一会儿(间隔效应)。
  // 每个字进行：单词语境 -> 描红。
  const phase2: LessonCard[] = validChars.flatMap(char => [
    createLearn(char, 'CONTEXT'),
    createTrace(char)
  ]);

  // === 第三波：交织大乱斗 (Interleaved Quiz) ===
  // 这是一个最关键的阶段。
  // 我们收集所有字的所有题型，然后打乱"题目"的顺序。
  
  // 1. 收集所有题目包 (每个包是一道题的卡片数组 LessonCard[])
  let allQuizPacks: LessonCard[][] = [];

  validChars.forEach(char => {
    // 每个字生成 3 道题，每道题是一个数组
    const quiz1 = createQuiz(char, 'ROMAJI');
    const quiz2 = createQuiz(char, 'KANA');
    const quiz3 = createQuiz(char, 'WORD');

    if (quiz1.length) allQuizPacks.push(quiz1);
    if (quiz2.length) allQuizPacks.push(quiz2);
    if (quiz3.length) allQuizPacks.push(quiz3);
  });

  // 2. 打乱题目顺序 (Interleaving)
  // 比如：[Q_あ_Word, Q_え_Romaji, Q_い_Kana ...]
  const shuffledPacks = shuffleArray(allQuizPacks);

  // 3. 展平为单一的卡片流
  const phase3: LessonCard[] = shuffledPacks.flat();

  // === 合并所有波次 ===
  return [...phase1, ...phase2, ...phase3];
};