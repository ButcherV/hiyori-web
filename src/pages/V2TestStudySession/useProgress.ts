import { useMemo } from 'react';
import type { LessonCard, SessionStats } from './lessonLogic';

export const useProgress = (
  lessonQueue: LessonCard[],
  currentIndex: number,
  stats: SessionStats
) => {
  return useMemo(() => {
    // 1. 防御：如果队列还没准备好，返回默认值
    if (!lessonQueue || lessonQueue.length === 0) {
      return {
        learnPassed: 0,
        learnTotal: 1,
        quizPassed: 0,
        quizTotal: 1,
        phase: 'LEARNING' as const,
      };
    }

    const { learnTotal, quizTotal, reviewCardId } = stats;

    // 2. 找到 Review 卡的位置 (进度条变色的分界线)
    // 增加 c && 判断，防止队列里有空值
    const currentReviewIndex = lessonQueue.findIndex(
      (c) => c && c.uniqueId === reviewCardId
    );

    const hasPassedReview =
      currentReviewIndex !== -1 && currentIndex > currentReviewIndex;

    // 当前是否正停在 Review 卡上
    const isAtReview =
      lessonQueue[currentIndex] &&
      lessonQueue[currentIndex].uniqueId === reviewCardId;

    // 决定当前阶段：划过了 Review 卡，且不是正停在它上面，就是 Quiz 阶段
    const phase = hasPassedReview && !isAtReview ? 'QUIZ' : 'LEARNING';

    // 3. 计算学习进度 (绿条/蓝条)
    let learnPassed = 0;
    if (phase === 'QUIZ') {
      learnPassed = learnTotal; // 进测试了，学习进度拉满
    } else {
      learnPassed = lessonQueue
        .slice(0, currentIndex)
        // 🔥 关键修正：直接读 c.isOriginal，不要读 c.logic
        // 同时判断 c.type !== 'QUIZ'
        .filter((c) => c && c.isOriginal && c.type !== 'QUIZ').length;
    }

    // 4. 计算测试进度 (橙条)
    // 算法：总数 - 剩余库存
    const remainingOriginalQuizzes = lessonQueue
      .slice(currentIndex)
      // 🔥🔥🔥 核心修复在这里 🔥🔥🔥
      // 必须加上 && c.isCorrect，只统计"剩余的题目数"，而不是"剩余的卡片数"
      .filter(
        (c) => c && c.isOriginal && c.type === 'QUIZ' && c.isCorrect
      ).length;

    const quizPassed = Math.max(0, quizTotal - remainingOriginalQuizzes);

    return {
      learnPassed,
      learnTotal,
      quizPassed,
      quizTotal,
      phase: phase as 'LEARNING' | 'QUIZ',
    };
  }, [lessonQueue, currentIndex, stats]);
};
