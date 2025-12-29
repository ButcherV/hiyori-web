import { KANA_DB, type LocalizedText } from './studyKanaData';

export type TaskType = 'LEARN' | 'TRACE' | 'QUIZ';
export type SubType =
  | 'SHAPE'
  | 'CONTEXT'
  | 'ROMAJI'
  | 'KANA'
  | 'WORD'
  | 'REVIEW';

// Review Card
export interface ReviewItem {
  char: string;
  romaji: string;
  word: string;
  kanji: string;
  wordRomaji: string;
  meaning: LocalizedText;
}

export interface LessonCard {
  id: string;
  type: TaskType;
  subType: SubType;

  // 基础数据
  char: string;
  romaji: string;
  word?: string;
  kanji?: string;
  kanjiOrigin?: string;
  meaning?: LocalizedText;
  wordRomaji?: string;
  displayContent: string;

  // Quiz 专用
  quizGroupId?: string;
  isCorrect?: boolean;

  // Header
  headerTitle?: string;
  headerSub?: string | LocalizedText;
  isHeaderJa?: boolean;
  isContentJa?: boolean;
  customTitle?: string;

  // Review 专用
  reviewItems?: ReviewItem[];

  // true = 原始题目 (算进总进度)
  // false = 补救/惩罚题目 (不算进总进度)
  isOriginal: boolean;
}

const shuffleArray = <T>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

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

// --- 3. 生成器函数 ---

const createLearn = (
  char: string,
  subType: 'SHAPE' | 'CONTEXT'
): LessonCard => {
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
    kanjiOrigin: data.kanjiOrigin,
    wordRomaji: data.wordRomaji,
    meaning: data.meaning,
    displayContent: subType === 'SHAPE' ? data.char : data.kanji,
    headerTitle: subType === 'SHAPE' ? 'New Kana' : 'New Word',
    isHeaderJa: false,
    isContentJa: true,
    isOriginal: true, // 默认生成的都是原始卡
  };
};

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
    isHeaderJa: false,
    isContentJa: true,
    isOriginal: true,
  };
};

const createQuiz = (
  target: string,
  type: 'ROMAJI' | 'KANA' | 'WORD'
): LessonCard[] => {
  const data = KANA_DB[target];
  if (!data) return [];

  const cards: LessonCard[] = [];
  const groupId = `group-${target}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;

  let questionTitle = '';
  let questionSub: string | LocalizedText = '';
  let correctAnswer = '';
  let distractorPool: string[] = [];
  let isHeaderJa = false;
  let isContentJa = false;

  switch (type) {
    case 'ROMAJI':
      questionTitle = data.char;
      correctAnswer = data.romaji;
      distractorPool = [...data.romajiDistractors];
      isHeaderJa = true;
      isContentJa = false;
      break;

    case 'KANA':
      questionTitle = data.romaji;
      correctAnswer = data.char;
      distractorPool = [...data.charDistractors];
      isHeaderJa = false;
      isContentJa = true;
      break;

    case 'WORD':
      questionTitle = data.kanji;
      questionSub = data.meaning;
      correctAnswer = data.word;
      distractorPool = [...data.wordDistractors];
      isHeaderJa = true;
      isContentJa = true;
      break;
  }

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
    meaning: data.meaning,
    headerTitle: questionTitle,
    headerSub: questionSub,
    displayContent: correctAnswer,
    isHeaderJa,
    isContentJa,
    isCorrect: true,
    isOriginal: true, // 标记为原始卡
  });

  // 干扰选项卡 (虽然也是 isOriginal=true，但在 useProgress 里我们会只统计 isCorrect 的)
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
      isCorrect: false,
      isOriginal: true, // 干扰卡也是原始生成的
    });
  });

  return cards.sort(() => 0.5 - Math.random());
};

// --- 4. 补救卡逻辑 (关键点) ---
export const getRemedialCards = (
  char: string,
  failedType: SubType
): LessonCard[] => {
  let newCards: LessonCard[] = [];

  if (failedType === 'WORD') {
    const learnCard = createLearn(char, 'CONTEXT');
    learnCard.customTitle = 'Review Word';
    newCards = [learnCard, ...createQuiz(char, 'WORD')];
  } else {
    const learnCard = createLearn(char, 'SHAPE');
    learnCard.customTitle = 'Review Kana';
    const retryType = failedType === 'KANA' ? 'KANA' : 'ROMAJI';
    newCards = [learnCard, ...createQuiz(char, retryType)];
  }

  // 🔥🔥🔥 关键：强制把所有补救卡标记为 isOriginal = false 🔥🔥🔥
  // 这样它们就不会被计入进度条的分母或分子
  return newCards.map((c) => ({
    ...c,
    isOriginal: false,
  }));
};

// --- 5. 主序列生成器 (三波次 + 复习卡) ---

export const generateWaveSequence = (
  targetChars: string[] = Object.keys(KANA_DB)
): LessonCard[] => {
  // 数据清洗
  const validChars = targetChars.filter((char) => KANA_DB[char]);
  if (validChars.length === 0) return [];

  // === Phase 1: 批量认脸 ===
  const phase1: LessonCard[] = validChars.map((char) =>
    createLearn(char, 'SHAPE')
  );

  // === Phase 2: 批量深化 ===
  const phase2: LessonCard[] = validChars.flatMap((char) => [
    createLearn(char, 'CONTEXT'),
    createTrace(char),
  ]);

  // === Phase 3: 复习卡 + 大乱斗 ===

  // A. 准备测试题池
  let allQuizPacks: LessonCard[][] = [];
  validChars.forEach((char) => {
    if (KANA_DB[char]) {
      // 每个字生成 3 道题
      const quiz1 = createQuiz(char, 'ROMAJI');
      const quiz2 = createQuiz(char, 'KANA');
      const quiz3 = createQuiz(char, 'WORD');
      if (quiz1.length) allQuizPacks.push(quiz1);
      if (quiz2.length) allQuizPacks.push(quiz2);
      if (quiz3.length) allQuizPacks.push(quiz3);
    }
  });

  // B. 生成 Review Card (小抄)
  const reviewItems: ReviewItem[] = validChars.map((char) => ({
    char: KANA_DB[char].char,
    romaji: KANA_DB[char].romaji,
    word: KANA_DB[char].word,
    kanji: KANA_DB[char].kanji,
    wordRomaji: KANA_DB[char].wordRomaji,
    meaning: KANA_DB[char].meaning,
  }));

  const reviewCard: LessonCard = {
    id: `review-card-${Date.now()}`,
    type: 'LEARN',
    subType: 'REVIEW',
    char: '',
    romaji: '',
    displayContent: '',
    headerTitle: 'Final Review',
    reviewItems: reviewItems,
    isHeaderJa: false,
    isContentJa: false,
    isOriginal: true, // Review 卡本身算作一个进度节点
  };

  // C. 打乱题目顺序
  const shuffledPacks = shuffleArray(allQuizPacks);
  const phase3Quizzes = shuffledPacks.flat();

  // === 合并 ===
  // 顺序: 认脸 -> 深化 -> 小抄 -> 考试
  return [...phase1, ...phase2, reviewCard, ...phase3Quizzes];
  // return [reviewCard, ...phase1, ...phase2, ...phase3Quizzes];
};

// 🔥🔥🔥 只负责计算总数的函数 (静态统计) 🔥🔥🔥
export interface SessionStats {
  learnTotal: number;
  quizTotal: number;
  reviewCardId?: string;
}

export const calculateSessionStats = (queue: LessonCard[]): SessionStats => {
  const reviewIndex = queue.findIndex((c) => c.subType === 'REVIEW');
  const splitIndex = reviewIndex === -1 ? queue.length : reviewIndex;

  // 1. 学习阶段总数：Review卡及之前的所有 Original 卡
  const learnTotal = queue
    .slice(0, splitIndex + 1)
    .filter((c) => c.isOriginal).length;

  // 2. 测试阶段总数：Review卡之后的所有 Original 且 Correct 的卡 (即题目数)
  // 这就是我们要锁死的"分母"
  const quizTotal = queue
    .slice(splitIndex + 1)
    .filter((c) => c.isOriginal && c.isCorrect).length;

  return {
    learnTotal,
    quizTotal,
    reviewCardId: queue[reviewIndex]?.id,
  };
};
