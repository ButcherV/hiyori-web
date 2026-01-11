import {
  KANA_DB,
  type AnyKanaData,
  type LocalizedText,
} from '../../../datas/kanaData';

import { uuid, shuffle } from '../../../utils/generalTools';

// ==========================================
// 类型定义 (保持与 Card 组件兼容)
// ==========================================

export type CardType = 'KANA_LEARN' | 'WORD_LEARN' | 'QUIZ';
export type QuizType = 'ROMAJI' | 'KANA' | 'WORD';

export interface LessonCard {
  uniqueId: string;
  type: CardType;
  data: AnyKanaData;
  // Quiz 专用字段
  quizGroupId?: string; // 同一组题目的 ID
  quizType?: QuizType;
  isCorrect?: boolean;
  displayContent?: string; // 卡片上显示的文字（选项）
  // Header 显示信息
  headerTitle?: string;
  headerSub?: string | LocalizedText;
  // 标记
  isOriginal: boolean; // true=原始题目, false=错题插入的补救卡
}

// ==========================================
// 单组题目生成器
// ==========================================

const createQuizGroup = (
  data: AnyKanaData,
  quizType: QuizType
): LessonCard[] => {
  const groupId = `quiz-${data.id}-${quizType}-${uuid()}`;
  const cards: LessonCard[] = [];

  let title = '';
  let sub: string | LocalizedText | undefined = '';
  let answer = '';
  let distractors: readonly string[] = [];

  // --- A. 罗马音题 (看假名，选罗马音) ---
  if (quizType === 'ROMAJI') {
    title = data.kana;
    answer = data.romaji;
    distractors = data.romajiDistractors;
  }
  // --- B. 假名题 (看罗马音，选假名) ---
  else if (quizType === 'KANA') {
    title = data.romaji;
    answer = data.kana;
    distractors = data.kanaDistractors;
  }
  // --- C. 单词题 (看汉字/意思，选读音/写法) ---
  else if (quizType === 'WORD') {
    if (!data.word) return []; // 防御

    // 平假名/拗音：看汉字选读音
    if (['h-seion', 'h-dakuon', 'h-yoon'].includes(data.kind)) {
      if (!data.wordKana || !data.wordDistractors) return [];
      title = data.word;
      sub = data.wordMeaning;
      answer = data.wordKana;
      distractors = data.wordDistractors;
    }
    // 片假名：看意思选写法
    else if (['k-seion', 'k-dakuon', 'k-yoon'].includes(data.kind)) {
      if (!data.wordDistractors) return [];
      title = ''; // 片假名单词题不显示标题(防透题)
      sub = data.wordMeaning;
      answer = data.word;
      distractors = data.wordDistractors;
    }
  }

  // 1. 正确卡
  cards.push({
    uniqueId: `${groupId}-correct`,
    type: 'QUIZ',
    data,
    quizGroupId: groupId,
    quizType,
    headerTitle: title,
    headerSub: sub,
    isCorrect: true,
    displayContent: answer,
    isOriginal: true,
  });

  // 2. 错误卡 (随机取 3 个干扰项)
  const selectedDistractors = shuffle([...distractors]).slice(0, 3);
  selectedDistractors.forEach((d, i) => {
    cards.push({
      uniqueId: `${groupId}-wrong-${i}`,
      type: 'QUIZ',
      data,
      quizGroupId: groupId,
      quizType,
      headerTitle: title,
      headerSub: sub,
      isCorrect: false,
      displayContent: d,
      isOriginal: true,
    });
  });

  return cards;
};

// ==========================================
// 核心：生成整个测试队列
// ==========================================

export const generateQuizQueue = (targetIds: string[]): LessonCard[] => {
  // 1. 根据 ID 找到对应的 Data 对象
  const selectedData = targetIds
    // @ts-ignore KANA_DB 索引处理
    .map((id) => Object.values(KANA_DB).find((item: any) => item.id === id))
    .filter((d): d is AnyKanaData => !!d);

  if (selectedData.length === 0) return [];

  const allQuizGroups: LessonCard[][] = [];

  selectedData.forEach((data) => {
    // 为每个假名生成 2-3 组题目
    allQuizGroups.push(createQuizGroup(data, 'ROMAJI'));
    allQuizGroups.push(createQuizGroup(data, 'KANA'));

    if (data.word) {
      allQuizGroups.push(createQuizGroup(data, 'WORD'));
    }
  });

  // 2. 组间洗牌 + 组内洗牌 + 拍平
  // 逻辑：题目顺序打乱，但同一题的 4 个选项紧挨着
  const shuffledCards = shuffle(allQuizGroups)
    .map((group) => shuffle(group))
    .flat();

  return shuffledCards;
};

// ==========================================
// 5. 核心：生成错题补救卡 (Answer Card)
// ==========================================

export const getAnswerCard = (failedQuizCard: LessonCard): LessonCard => {
  const { data } = failedQuizCard;

  // 如果是单词题错，展示 WordCard
  if (failedQuizCard.quizType === 'WORD' && data.word) {
    return {
      uniqueId: `answer-word-${uuid()}`,
      type: 'WORD_LEARN',
      data: data,
      headerTitle: 'Correct Answer',
      isOriginal: false, // 标记为补救卡
    };
  }

  // 其他情况展示 KanaCard
  return {
    uniqueId: `answer-kana-${uuid()}`,
    type: 'KANA_LEARN',
    data: data,
    headerTitle: 'Correct Answer',
    isOriginal: false,
  };
};
