import { useMemo } from 'react';
import type { LessonCard, SessionStats } from './lessonLogic';

export const useProgress = (
  lessonQueue: LessonCard[],
  currentIndex: number,
  stats: SessionStats // 👈 核心改变：接收锁死的统计数据
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

    // 直接解构传入的固定数据
    const { learnTotal, quizTotal, reviewCardId } = stats;

    // --- 1. 判断当前阶段 ---
    // 通过 ID 找 Review 卡 (因为 Index 可能会变，ID 是可靠的)
    const currentReviewIndex = lessonQueue.findIndex(
      (c) => c.id === reviewCardId
    );

    // 如果还没滑到 Review 卡，或者当前就是 Review 卡 -> LEARNING
    const hasPassedReview =
      currentReviewIndex !== -1 && currentIndex > currentReviewIndex;
    const isAtReview = lessonQueue[currentIndex]?.id === reviewCardId;

    const phase = hasPassedReview && !isAtReview ? 'QUIZ' : 'LEARNING';

    // --- 2. 计算 Learn Passed (分子) ---
    let learnPassed = 0;
    if (phase === 'QUIZ') {
      learnPassed = learnTotal; // 只要进测试了，学习条直接拉满
    } else {
      // 学习阶段：统计当前位置之前的 Original 卡
      learnPassed = lessonQueue
        .slice(0, currentIndex)
        .filter((c) => c.isOriginal).length;
    }

    // --- 3. 计算 Quiz Passed (分子) ---
    // 🔥 核心修复：进度 = 锁死的总数 - 剩余库存
    // 我们不统计"过去了多少"，因为删卡会导致"过去"的数据丢失。
    // 我们统计"未来还剩多少原题"，用总数一减，就是完成的进度。

    // 从当前位置(含)往后找，还有多少张"原始正确卡"
    const remainingOriginals = lessonQueue
      .slice(currentIndex)
      .filter((c) => c.isOriginal && c.isCorrect).length;

    // 进度 = 总分母 - 剩余库存
    const quizPassed = Math.max(0, quizTotal - remainingOriginals);

    return {
      learnPassed,
      learnTotal, // 透传固定值
      quizPassed,
      quizTotal, // 透传固定值
      phase: phase as 'LEARNING' | 'QUIZ',
    };
  }, [lessonQueue, currentIndex, stats]);
};
