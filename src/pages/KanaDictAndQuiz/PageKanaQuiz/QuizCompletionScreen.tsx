import React, { useEffect } from 'react';
import { Home, Clock, XCircle, CheckCircle, Hash, Type } from 'lucide-react';
import confetti from 'canvas-confetti';
import styles from './QuizCompletionScreen.module.css';

interface QuizStats {
  totalKana: number; // 选择了多少个假名 (e.g. 5)
  totalQuestions: number; // 一共多少道题 (e.g. 15)
  mistakeCount: number; // 错了多少次
  durationSeconds: number; // 耗时(秒)
}

interface Props {
  stats: QuizStats;
  onGoHome: () => void;
}

export const QuizCompletionScreen: React.FC<Props> = ({ stats, onGoHome }) => {
  const { totalKana, totalQuestions, mistakeCount, durationSeconds } = stats;

  // 计算正确率
  // 逻辑：每道题只有一次机会（答错就进解析了），所以 正确数 = 总题数 - 错题数
  // 注意防御分母为0
  const correctCount = Math.max(0, totalQuestions - mistakeCount);
  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  // 格式化时间 mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // 礼花特效 (保留你喜欢的)
  useEffect(() => {
    const duration = 15 * 1000;
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

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.trophyIcon}>🏆</div>
        <h1 className={styles.title}>Quiz Completed!</h1>
        <p className={styles.subTitle}>Great job keeping up the practice.</p>
      </div>

      <div className={styles.statsGrid}>
        {/* 1. 正确率 */}
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.accuracyValue}`}>
            {accuracy}%
          </div>
          <div className={styles.statLabel}>Accuracy</div>
        </div>

        {/* 2. 耗时 */}
        <div className={styles.statCard}>
          <div className={styles.statValue}>{formatTime(durationSeconds)}</div>
          <div className={styles.statLabel}>Time</div>
        </div>

        {/* 3. 错误数 */}
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.mistakeValue}`}>
            {mistakeCount}
          </div>
          <div className={styles.statLabel}>Mistakes</div>
        </div>

        {/* 4. 总假名数 */}
        <div className={styles.statCard}>
          <div className={styles.statValue}>{totalKana}</div>
          <div className={styles.statLabel}>Kana Count</div>
        </div>

        {/* 可选：显示总题数/正确数 */}
        {/* <div className={styles.statCard}>
          <div className={styles.statValue}>{correctCount}/{totalQuestions}</div>
          <div className={styles.statLabel}>Score</div>
        </div> */}
      </div>

      <div className={styles.actionArea}>
        <button className={styles.homeBtn} onClick={onGoHome}>
          <Home size={20} />
          <span>Back to Selection</span>
        </button>
      </div>
    </div>
  );
};
