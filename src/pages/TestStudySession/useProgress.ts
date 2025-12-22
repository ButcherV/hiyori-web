import { useMemo } from 'react';
import type { LessonCard } from './lessonLogic';

export const useProgress = (
  lessonQueue: LessonCard[],
  currentIndex: number
) => {
  return useMemo(() => {
    if (!lessonQueue.length) {
      return {
        learnPassed: 0,
        learnTotal: 1,
        quizPassed: 0,
        quizTotal: 1,
        phase: 'LEARNING' as const,
      };
    }

    // 1. 锁定总分母 (Total)
    // 逻辑：基于 isOriginal 统计。
    // Learn Total: ReviewCard 及其之前的所有 Original 卡。
    // Quiz Total: ReviewCard 之后的所有 "Original & Correct" 卡 (即题目数)。

    const reviewIndex = lessonQueue.findIndex((c) => c.subType === 'REVIEW');
    // 如果找不到 reviewIndex (异常情况)，就全算 Learn
    const splitIndex = reviewIndex === -1 ? lessonQueue.length : reviewIndex;

    // Learn 阶段总数 (原始卡片数)
    // slice(0, splitIndex + 1) 包含了 Review 卡
    const learnTotal = lessonQueue
      .slice(0, splitIndex + 1)
      .filter((c) => c.isOriginal).length;

    // Quiz 阶段总数 (题目数)
    // 只统计 isCorrect=true 且 isOriginal=true 的卡
    const quizTotal = lessonQueue
      .slice(splitIndex + 1)
      .filter((c) => c.isOriginal && c.isCorrect).length;

    // 2. 计算当前分子 (Current)
    const currentCard = lessonQueue[currentIndex];

    // 判断阶段
    // 只要滑过了 Review 卡，且当前卡不是 Review 卡，就算进入 QUIZ 阶段
    const hasPassedReview = currentIndex > reviewIndex;
    const isAtReview = currentCard?.subType === 'REVIEW';
    const phase = hasPassedReview && !isAtReview ? 'QUIZ' : 'LEARNING';

    // 3. 统计已完成 (Passed)
    const passedCards = lessonQueue.slice(0, currentIndex);

    // Learn Passed: 这里的已完成原始卡 + (如果经过了Review卡，Review卡也算一张)
    const learnPassedCount = passedCards
      .slice(0, splitIndex + 1)
      .filter((c) => c.isOriginal).length;

    // Quiz Passed: 这里的已完成且正确的原始卡
    const quizPassedCount = passedCards
      .slice(splitIndex + 1)
      .filter((c) => c.isOriginal && c.isCorrect).length;

    // 修正：如果处于 Quiz 阶段，Learn 条必须是满的
    const finalLearnPassed = phase === 'QUIZ' ? learnTotal : learnPassedCount;

    return {
      learnPassed: finalLearnPassed,
      learnTotal,
      quizPassed: quizPassedCount,
      quizTotal,
      phase: phase as 'LEARNING' | 'QUIZ',
    };
  }, [lessonQueue, currentIndex]);
};
