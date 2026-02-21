import {
  KANA_DB,
  type AnyKanaData,
  type LocalizedText,
} from '../../datas/kanaData';
import { uuid, shuffle } from '../../utils/generalTools';

// ==========================================
// 1. 卡片类型定义
// ==========================================

export type CardType =
  | 'KANA_LEARN'
  | 'WORD_LEARN'
  | 'TRACE'
  | 'REVIEW'
  | 'QUIZ';

export type QuizType = 'ROMAJI' | 'KANA' | 'WORD';

// 通用卡片结构
export interface LessonCard {
  uniqueId: string;
  type: CardType;
  data: AnyKanaData;
  headerTitle?: string;
  headerSub?: string | LocalizedText;
  quizGroupId?: string;
  quizType?: QuizType;
  isCorrect?: boolean;
  displayContent?: string;
  reviewItems?: ReviewItem[];
  isOriginal: boolean;
}

export interface ReviewItem {
  char: string;
  romaji: string;
  word?: string;
  wordRomaji?: string;
  wordKana?: string;
  meaning?: LocalizedText;
  kind: AnyKanaData['kind'];
}

export interface SessionStats {
  learnTotal: number;
  quizTotal: number;
  reviewCardId?: string;
}

// ==========================================
// 2. 基础生成器
// ==========================================

// 生成一组 Quiz 卡 (1对 + 3错)
// 返回的是 LessonCard[]，即一组卡片
const createQuizGroup = (
  data: AnyKanaData,
  quizType: QuizType,
  isOriginal: boolean
): LessonCard[] => {
  const groupId = `quiz-${data.id}-${quizType}-${uuid()}`;
  const cards: LessonCard[] = [];

  // 1. 准备内容
  let title = '';
  let sub: string | LocalizedText | undefined = '';
  let answer = '';
  let distractors: readonly string[] = [];

  if (quizType === 'ROMAJI') {
    title = data.kana;
    answer = data.romaji;
    distractors = data.romajiDistractors;
  } else if (quizType === 'KANA') {
    title = data.romaji;
    answer = data.kana;
    distractors = data.kanaDistractors;
  } else if (quizType === 'WORD') {
    if (!data.word) return [];
    if (
      data.kind === 'h-seion' ||
      data.kind === 'h-dakuon' ||
      data.kind === 'h-yoon'
    ) {
      if (!data.wordKana || !data.wordDistractors) return [];
      // 题目逻辑：用户看着汉字，选读音
      title = data.word;
      sub = data.wordMeaning;
      answer = data.wordKana;
      distractors = data.wordDistractors; // 这里是 ['あえ', 'うえ'...]
    } else if (data.kind === 'k-seion' ||
      data.kind === 'k-dakuon' ||
      data.kind === 'k-yoon') {
      if (!data.wordDistractors) return [];
      // 🔵 片假名模式：答案是“写法” (显示 アイス)
      // 题目逻辑：用户看着意思，选写法
      title = '';
      sub = data.wordMeaning;
      answer = data.word;
      distractors = data.wordDistractors; // 这里现在是 ['ウエ', 'アエ'...]
    } else {
      console.warn('遇到未知的假名类型，跳过出题');
      return [];
    }
  }

  // 2. 正确卡
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
    isOriginal,
  });

  // 3. 错误卡
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
      isOriginal,
    });
  });

  // 组内洗牌：保证选项顺序随机，但它们还是一家人
  return shuffle(cards);
};

// ==========================================
// 3. 排课策略
// ==========================================

/**
 * 策略 A: 平假名清音、平假名浊音 - 排课逻辑
 * 逻辑：认脸 -> 单词 -> 描红 -> 测验
 */
const generateHiraganaFlow = (
  data: AnyKanaData
): {
  learn: LessonCard[];
  quizGroups: LessonCard[][];
} => {
  const learn: LessonCard[] = [];
  const quizGroups: LessonCard[][] = [];

  // 1. 认脸
  learn.push({
    uniqueId: `learn-kana-${data.id}`,
    type: 'KANA_LEARN',
    data,
    headerTitle: 'studyKana.session.newKana',
    isOriginal: true,
  });

  // 2. 单词
  if (data.word) {
    learn.push({
      uniqueId: `learn-word-${data.id}`,
      type: 'WORD_LEARN',
      data,
      headerTitle: 'studyKana.session.wordContext',
      isOriginal: true,
    });
  }

  // 3. 描红
  learn.push({
    uniqueId: `trace-${data.id}`,
    type: 'TRACE',
    data,
    headerTitle: 'studyKana.session.strokePractice',
    isOriginal: true,
  });

  // 4. 生成 3 组测验（保持分组）
  quizGroups.push(createQuizGroup(data, 'ROMAJI', true));
  quizGroups.push(createQuizGroup(data, 'KANA', true));

  if (data.word) {
    quizGroups.push(createQuizGroup(data, 'WORD', true));
  }

  return { learn, quizGroups };
};

/**
 * 策略 B: 片假名清音、片假名浊音排课逻辑
 * 逻辑：认脸 -> 单词 -> 描红 -> 测验
 */
const generateKatakanaFlow = (
  data: AnyKanaData
): {
  learn: LessonCard[];
  quizGroups: LessonCard[][];
} => {
  const learn: LessonCard[] = [];
  const quizGroups: LessonCard[][] = [];

  // 1. 认脸 (KanaCard)
  // 片假名也是 New Kana
  learn.push({
    uniqueId: `learn-kana-${data.id}`,
    type: 'KANA_LEARN',
    data,
    headerTitle: 'studyKana.session.newKana',
    isOriginal: true,
  });

  // 2. 单词 (WordCard)
  if (data.word) {
    learn.push({
      uniqueId: `learn-word-${data.id}`,
      type: 'WORD_LEARN',
      data,
      headerTitle: 'studyKana.session.wordContext',
      isOriginal: true,
    });
  }

  // 3. 描红
  learn.push({
    uniqueId: `trace-${data.id}`,
    type: 'TRACE',
    data,
    headerTitle: 'studyKana.session.strokePractice',
    isOriginal: true,
  });

  // 4. 生成测验 (逻辑同平假名)
  quizGroups.push(createQuizGroup(data, 'ROMAJI', true));
  quizGroups.push(createQuizGroup(data, 'KANA', true));

  // 没有词的就不添加了。比如 wo
  if (data.word) {
    quizGroups.push(createQuizGroup(data, 'WORD', true));
  }

  return { learn, quizGroups };
};

/**
 * 策略 C: 平假名拗音排课策略 (无描红)
 * 逻辑：认脸 -> 单词 -> 测验
 */
const generateHiraganaYoonFlow = (
  data: AnyKanaData
): {
  learn: LessonCard[];
  quizGroups: LessonCard[][];
} => {
  const learn: LessonCard[] = [];
  const quizGroups: LessonCard[][] = [];

  // 1. 认脸
  learn.push({
    uniqueId: `learn-kana-${data.id}`,
    type: 'KANA_LEARN',
    data,
    headerTitle: 'studyKana.session.newKana',
    isOriginal: true,
  });

  // 2. 单词 (拗音通常都有单词)
  if (data.word) {
    learn.push({
      uniqueId: `learn-word-${data.id}`,
      type: 'WORD_LEARN',
      data,
      headerTitle: 'studyKana.session.wordContext',
      isOriginal: true,
    });
  }

  // ❌ 3. 描红：跳过！
  // 因为 KanjiSVG 没有对应的数据

  // 4. 测验
  quizGroups.push(createQuizGroup(data, 'ROMAJI', true));
  quizGroups.push(createQuizGroup(data, 'KANA', true));

  if (data.word) {
    quizGroups.push(createQuizGroup(data, 'WORD', true));
  }

  return { learn, quizGroups };
};

/**
 * 策略 D: 片假名拗音排课策略 (无描红)
 * 逻辑：认脸 -> 单词 -> 测验
 */
const generateKatakanaYoonFlow = (
  data: AnyKanaData
): {
  learn: LessonCard[];
  quizGroups: LessonCard[][];
} => {
  const learn: LessonCard[] = [];
  const quizGroups: LessonCard[][] = [];

  // 1. 认脸
  learn.push({
    uniqueId: `learn-kana-${data.id}`,
    type: 'KANA_LEARN',
    data,
    headerTitle: 'studyKana.session.newKana',
    isOriginal: true,
  });

  // 2. 单词 (拗音通常都有单词)
  if (data.word) {
    learn.push({
      uniqueId: `learn-word-${data.id}`,
      type: 'WORD_LEARN',
      data,
      headerTitle: 'studyKana.session.wordContext',
      isOriginal: true,
    });
  }

  // ❌ 3. 描红：跳过！
  // 因为 KanjiSVG 没有对应的数据

  // 4. 测验
  quizGroups.push(createQuizGroup(data, 'ROMAJI', true));
  quizGroups.push(createQuizGroup(data, 'KANA', true));

  if (data.word) {
    quizGroups.push(createQuizGroup(data, 'WORD', true));
  }

  return { learn, quizGroups };
};

// ==========================================
// 4. 主流程生成器
// ==========================================

export const generateWaveSequence = (targetChars: string[]): LessonCard[] => {
  const validData = targetChars
    .map((c) => KANA_DB[c])
    .filter((d): d is AnyKanaData => !!d);

  if (validData.length === 0) return [];

  const allLearn: LessonCard[] = [];
  const allQuizGroups: LessonCard[][] = [];
  const reviewItems: ReviewItem[] = [];

  validData.forEach((data) => {
    reviewItems.push({
      char: data.kana,
      romaji: data.romaji,
      word: data.word,
      wordRomaji: data.wordRomaji,
      wordKana: data.wordKana,
      meaning: data.wordMeaning,
      kind: data.kind,
    });

    switch (data.kind) {
      case 'h-seion':
      case 'h-dakuon': {
        const { learn, quizGroups } = generateHiraganaFlow(data);
        allLearn.push(...learn);
        allQuizGroups.push(...quizGroups); // 保持组的完整性，不要拆开
        break;
      }
      case 'h-yoon': {
        const { learn, quizGroups } = generateHiraganaYoonFlow(data);
        allLearn.push(...learn);
        allQuizGroups.push(...quizGroups);
        break;
      }
      case 'k-seion':
      case 'k-dakuon':  {
        const { learn, quizGroups } = generateKatakanaFlow(data);
        allLearn.push(...learn);
        allQuizGroups.push(...quizGroups);
        break;
      }
      case 'k-yoon': {
        const { learn, quizGroups } = generateKatakanaYoonFlow(data);
        allLearn.push(...learn);
        allQuizGroups.push(...quizGroups);
        break;
      }
      default:
        console.warn(`Unknown kana kind: ${(data as any).kind}`);
        break;
    }
  });

  const reviewCard: LessonCard = {
    uniqueId: `review-${uuid()}`,
    type: 'REVIEW',
    data: validData[0], // 占位
    reviewItems,
    headerTitle: 'studyKana.session.finalReview',
    isOriginal: true,
  };

  // 🔥🔥🔥 核心改变 3：以“组”为单位洗牌，然后再拍平 🔥🔥🔥
  // 1. shuffle(allQuizGroups): 把“题目A”、“题目B”的顺序打乱
  // 2. .flat(): 把打乱后的题组拆成单张卡片
  // 结果：同一题的 4 个选项依然紧紧挨在一起，不会被拆散！
  const shuffledQuizzes = shuffle(allQuizGroups).flat();

  return [...allLearn, reviewCard, ...shuffledQuizzes];
};

// ==========================================
// 5. 补救逻辑
// ==========================================

export const getRemedialCards = (failedCard: LessonCard): LessonCard[] => {
  const { data, quizType } = failedCard;
  if (!quizType) return [];

  const cards: LessonCard[] = [];

  if (quizType === 'WORD' && data.word) {
    cards.push({
      uniqueId: `remedial-word-${uuid()}`,
      type: 'WORD_LEARN',
      data,
      headerTitle: 'studyKana.session.reviewWord',
      isOriginal: false,
    });
  } else {
    cards.push({
      uniqueId: `remedial-kana-${uuid()}`,
      type: 'KANA_LEARN',
      data,
      headerTitle: 'studyKana.session.reviewKana',
      isOriginal: false,
    });
  }

  // 生成新的一组 Quiz，不用改，因为它本身就是返回一组挨着的卡
  const newGroup = createQuizGroup(data, quizType, false);
  cards.push(...newGroup);

  return cards.filter((c) => !!c);
};

// 统计逻辑
export const calculateSessionStats = (queue: LessonCard[]): SessionStats => {
  const reviewIndex = queue.findIndex((c) => c.type === 'REVIEW');
  const splitIndex = reviewIndex === -1 ? queue.length : reviewIndex;

  const learnTotal = queue
    .slice(0, splitIndex + 1)
    .filter((c) => c.isOriginal).length;

  const quizTotal = queue
    .slice(splitIndex + 1)
    .filter((c) => c.isOriginal && c.isCorrect).length;

  return { learnTotal, quizTotal, reviewCardId: queue[reviewIndex]?.uniqueId };
};
