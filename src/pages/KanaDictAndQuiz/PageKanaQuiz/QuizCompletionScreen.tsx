// src/components/QuizCompletionScreen/index.tsx

import React, { useEffect, useMemo } from 'react';
import { Home, Clock, XCircle, CheckCircle, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import styles from './QuizCompletionScreen.module.css';

interface QuizStats {
  totalQuestions: number;
  wordCount: number;
  totalKana: number;
  mistakeCount: number;
  durationSeconds: number;
}

interface Props {
  stats: QuizStats;
  onGoHome: () => void;
}

export const QuizCompletionScreen: React.FC<Props> = ({ stats, onGoHome }) => {
  const { t } = useTranslation();
  const {
    totalKana,
    wordCount,
    totalQuestions,
    mistakeCount,
    durationSeconds,
  } = stats;

  // 1. 计算核心数据
  const correctCount = Math.max(0, totalQuestions - mistakeCount);
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 计算平均每题耗时 (用于评估熟练度)
  const avgTime = totalQuestions > 0 ? durationSeconds / totalQuestions : 0;

  // 2. 格式化时间
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // -------------------------------------------------------------
  // 熟练度评价 (Time Evaluation)
  // 逻辑：如果准确率太低 (<60%)，速度再快也是“无效答题”或“太急躁”
  // -------------------------------------------------------------
  const timeEval = useMemo(() => {
    // 门槛：如果正确率不及格，强制不评价速度，或者给一个特殊评价
    if (accuracy < 60) return 'rushed'; // 比如定义一个 "太急了/无效"

    if (avgTime < 4.0) return 'fast'; // < 4秒/题
    if (avgTime < 6.0) return 'normal'; // 3-6秒/题
    return 'slow'; // > 6秒/题
  }, [avgTime, accuracy]);

  // -------------------------------------------------------------
  // 复合评价等级 (Result Tier)
  // 逻辑：准确率是第一优先级 (Gatekeeper)，速度是加分项 (Bonus)
  // -------------------------------------------------------------
  const resultTier = useMemo(() => {
    // 1. 先看准确率：不及格直接 Fail，不管多快
    if (accuracy < 60) return 'fail';

    // 2. 及格了 (60-79)：也就是 Pass，不管多快都只是 Pass
    if (accuracy < 80) return 'pass';

    // 3. 优秀 (>80)：这时候速度才有意义
    // 只有 全对(100%) 且 速度快(fast) 才是 Perfect
    if (accuracy === 100 && avgTime < 4.0) {
      return 'perfect';
    }

    // 其他情况（比如100%但慢，或者85%）都是 Good
    return 'good';
  }, [accuracy, avgTime]);

  // 5. 根据等级决定视觉元素
  const renderHeaderIcon = () => {
    switch (resultTier) {
      case 'perfect':
        return <div>🏆</div>; // 金杯
      case 'good':
        return <div>🥈</div>; // 银牌
      case 'pass':
        return <div>🥉</div>;
      default:
        return <div>🤦‍♂️</div>;
    }
  };

  // 6. 礼花特效
  useEffect(() => {
    if (resultTier !== 'perfect' && resultTier !== 'good') return;

    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 3000,
    };
    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [resultTier]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.trophyIcon}>{renderHeaderIcon()}</div>
        <h1 className={styles.title}>{t(`quiz_result.title.${resultTier}`)}</h1>
        <p className={styles.subTitle}>{t(`quiz_result.sub.${resultTier}`)}</p>
      </div>

      <div className={styles.statsGrid}>
        {/* 正确率 */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
            <CheckCircle size={28} />
          </div>
          <div className={styles.statLabel}>
            {t('quiz_result.stats.accuracy')}
          </div>
          <div className={`${styles.statValue} ${styles.accuracyValue}`}>
            {accuracy}%
          </div>
          <div className={styles.statDetail}>
            {t('quiz_result.stats.score_detail', {
              correct: correctCount,
              total: totalQuestions,
            })}
          </div>
        </div>

        {/* 总假名、总单词数 */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconNeutral}`}>
            <BookOpen size={28} />
          </div>
          {/* <div className={styles.statLabel}>
            {t('quiz_result.stats.volume')}
          </div> */}
          {/* 假名数 */}
          <div className={styles.statValueContainer}>
            <span className={styles.statValue}>{totalKana}</span>
            <span className={styles.statSubValue}>
              {t('quiz_result.unit.kana')}
            </span>
          </div>
          {/* 单词数 */}
          <div className={styles.statValueContainer}>
            <span className={styles.statValue}>{wordCount}</span>
            <span className={styles.statSubValue}>
              {t('quiz_result.unit.word')}
            </span>
          </div>
        </div>

        {/* 错误数 */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconError}`}>
            <XCircle size={28} />
          </div>
          <div className={styles.statLabel}>
            {t('quiz_result.stats.mistakes')}
          </div>
          <div className={`${styles.statValue} ${styles.mistakeValue}`}>
            {mistakeCount}
          </div>
        </div>

        {/* 耗时 & 熟练度评价 */}
        <div className={styles.statCard}>
          <div className={`${styles.iconWrapper} ${styles.iconInfo}`}>
            <Clock size={28} />
          </div>
          <div className={styles.statLabel}>{t('quiz_result.stats.time')}</div>
          <div className={styles.statValue}>{formatTime(durationSeconds)}</div>
          <div className={styles.statDetail}>
            {timeEval === 'rushed'
              ? ''
              : t(`quiz_result.time_eval.${timeEval}`)}
          </div>
        </div>
      </div>

      <div className={styles.actionArea}>
        <button className={styles.homeBtn} onClick={onGoHome}>
          <Home size={20} />
          <span>{t('quiz_result.btn_back')}</span>
        </button>
      </div>
    </div>
  );
};
