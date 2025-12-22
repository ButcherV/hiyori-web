// src/engine.ts
import _ from 'lodash';
import type { Vocabulary, QuizMode, QuizQuestion, QuizOption } from './types';
import { RAW_DATA } from './data';

const ALL_HIRAGANA =
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん'.split(
    ''
  );

export function generateQuestion(
  word: Vocabulary,
  mode: QuizMode
): QuizQuestion | null {
  if (!isModeValidForWord(word, mode)) {
    return null;
  }

  switch (mode) {
    case 'KANA_FILL_BLANK':
      return generateKanaFill(word);

    case 'WORD_TO_MEANING':
      return generateWordToMeaning(word);

    case 'WORD_TO_EMOJI':
    case 'WORD_TO_COLOR':
    case 'BRAND_TO_NAME':
      return generateVisualQuiz(word, mode);

    default:
      return null;
  }
}

// 辅助：获取随机干扰项数量 (3 到 5 个)，也就是总共 4 到 6 张卡
function getRandomDistractorCount() {
  return _.random(3, 5);
}

function generateKanaFill(word: Vocabulary): QuizQuestion {
  const kanaChars = word.kana.split('');
  const targetIndex = Math.floor(Math.random() * kanaChars.length);
  const correctChar = kanaChars[targetIndex];

  const displayChars = [...kanaChars];
  displayChars[targetIndex] = '＿';
  const promptText = displayChars.join('');

  const correctOption: QuizOption = {
    id: `${word.id}_correct`,
    isCorrect: true,
    content: correctChar,
    type: 'TEXT',
  };

  // 动态数量干扰项
  const distractors = _.sampleSize(
    ALL_HIRAGANA.filter((c) => c !== correctChar),
    getRandomDistractorCount()
  ).map((char, idx) => ({
    id: `${word.id}_wrong_${idx}`,
    isCorrect: false,
    content: char,
    type: 'TEXT' as const,
  }));

  return {
    id: _.uniqueId('quiz_'),
    mode: 'KANA_FILL_BLANK',
    prompt: {
      display: promptText,
      type: 'TEXT',
      highlightIndex: targetIndex,
    },
    options: _.shuffle([correctOption, ...distractors]),
  };
}

function generateWordToMeaning(word: Vocabulary): QuizQuestion {
  const correctOption: QuizOption = {
    id: `${word.id}_correct`,
    isCorrect: true,
    content: word.meaning.zh,
    type: 'TEXT',
  };

  const otherWords = RAW_DATA.filter((w) => w.id !== word.id);

  // 动态数量干扰项
  const distractors = _.sampleSize(otherWords, getRandomDistractorCount()).map(
    (w, idx) => ({
      id: `${word.id}_wrong_${idx}`,
      isCorrect: false,
      content: w.meaning.zh,
      type: 'TEXT' as const,
    })
  );

  return {
    id: _.uniqueId('quiz_'),
    mode: 'WORD_TO_MEANING',
    prompt: {
      display: word.kanji,
      type: 'TEXT',
    },
    options: _.shuffle([correctOption, ...distractors]),
  };
}

function generateVisualQuiz(word: Vocabulary, mode: QuizMode): QuizQuestion {
  if (!word.visual) throw new Error('Visual logic called on non-visual word');

  const isBrand = mode === 'BRAND_TO_NAME';
  const promptDisplay = isBrand ? word.visual.value : word.kanji;
  const promptType = isBrand ? 'COLOR' : 'TEXT';

  const getOptionContent = (w: Vocabulary) => {
    if (isBrand) return w.kanji;
    return w.visual?.value || '❓';
  };

  const correctOption: QuizOption = {
    id: `${word.id}_correct`,
    isCorrect: true,
    content: getOptionContent(word),
    type: isBrand ? 'TEXT' : word.visual.type === 'EMOJI' ? 'EMOJI' : 'COLOR',
  };

  const similarWords = RAW_DATA.filter(
    (w) => w.id !== word.id && w.visual?.type === word.visual?.type
  );

  // 动态数量干扰项
  const distractors = _.sampleSize(
    similarWords,
    getRandomDistractorCount()
  ).map((w, idx) => ({
    id: `${word.id}_wrong_${idx}`,
    isCorrect: false,
    content: getOptionContent(w),
    type: isBrand
      ? 'TEXT'
      : ((word.visual!.type === 'EMOJI' ? 'EMOJI' : 'COLOR') as any),
  }));

  return {
    id: _.uniqueId('quiz_'),
    mode: mode,
    prompt: {
      display: promptDisplay,
      type: promptType as any,
    },
    options: _.shuffle([correctOption, ...distractors]),
  };
}

function isModeValidForWord(word: Vocabulary, mode: QuizMode): boolean {
  if (
    [
      'KANA_FILL_BLANK',
      'WORD_TO_MEANING',
      'MEANING_TO_WORD',
      'KANJI_TO_KANA',
    ].includes(mode)
  ) {
    return true;
  }
  if (['WORD_TO_EMOJI', 'EMOJI_TO_WORD', 'WORD_TO_COLOR'].includes(mode)) {
    return !!word.visual;
  }
  if (mode === 'BRAND_TO_NAME') {
    return word.visual?.type === 'BRAND_COLOR';
  }
  return false;
}
