import React, { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import styles from './CompletionScreen.module.css';

interface Props {
  onGoHome: () => void;
  autoRedirectSeconds?: number;
}

export const CompletionScreen: React.FC<Props> = ({
  onGoHome,
  autoRedirectSeconds = 3,
}) => {
  const { t } = useTranslation();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);

  // 专门处理礼花效果
  useEffect(() => {
    // 定义一个发射函数，创建一个“真实感”的爆炸效果
    const fireRealisticConfetti = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.6 }, // 从屏幕中下方开始
        zIndex: 2000, // 确保在最上层
        // colors: ['#ff0000', '#00ff00', '#0000ff'], // 可选：自定义颜色
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      // 发射几波不同参数的礼花，组合成一个大爆炸效果
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    };

    // 执行发射
    fireRealisticConfetti();

    // 不需要清理函数，因为 canvas-confetti 会自动清理 canvas
  }, []); // 空依赖数组，确保只在组件挂载时执行一次

  useEffect(() => {
    // 启动倒计时
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onGoHome(); // 倒计时结束，调用父组件传来的回调
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 清理定时器 (防止用户手动点击按钮离开后，定时器还在跑)
    return () => clearInterval(interval);
  }, [onGoHome]);

  return (
    <div className={styles.completeContainer}>
      <div className={styles.celebrationIcon}>
        <CheckCircle size={80} strokeWidth={2.5} />
      </div>
      <h1 className={styles.completeTitle}>{t('completion.title')}</h1>
      <p className={styles.completeSub}>{t('completion.subMessage')}</p>

      <button className={styles.fillingBtn} onClick={onGoHome}>
        <span className={styles.btnText}>
          {t('completion.backHome', { seconds: countdown })}
        </span>
      </button>
    </div>
  );
};
