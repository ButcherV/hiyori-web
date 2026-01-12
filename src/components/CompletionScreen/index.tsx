import React, { useEffect, useState, useRef, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import styles from './CompletionScreen.module.css';

interface Props {
  onGoHome: () => void;
  autoRedirectSeconds?: number;
}

// 定义中文状态下的随机鼓励语录
const CHINESE_QUOTES = [
  '力学如力耕，勤惰尔自知。',
  '操千曲而后晓声，观千剑而后识器。',
  '博观而约取，厚积而薄发。',
  '流水不腐，户枢不蠹。',
  '行远必自迩，登高必自卑。',
  '砚田无荒岁，笔耒有丰年。',
];

export const CompletionScreen: React.FC<Props> = ({
  onGoHome,
  autoRedirectSeconds = 4,
}) => {
  // 获取 i18n 对象用于判断语言
  const { t, i18n } = useTranslation();
  const [countdown, setCountdown] = useState(autoRedirectSeconds);
  const [isExiting, setIsExiting] = useState(false);
  const hasTriggeredExit = useRef(false);

  // 2. 使用 useMemo 计算随机文案
  // 作用：只在组件挂载或语言改变时计算一次，防止倒计时更新导致文案闪烁
  const randomSubMessage = useMemo(() => {
    // 判断是否为中文环境 (匹配 zh, zh-CN, zh-TW 等)
    if (i18n.language && i18n.language.startsWith('zh')) {
      const randomIndex = Math.floor(Math.random() * CHINESE_QUOTES.length);
      return CHINESE_QUOTES[randomIndex];
    }
    // 非中文环境，使用默认翻译 key
    return t('completion.subMessage');
  }, [i18n.language, t]);

  // 封装退出逻辑
  const handleExit = () => {
    if (hasTriggeredExit.current) return;
    hasTriggeredExit.current = true;
    setIsExiting(true);
    setTimeout(() => {
      onGoHome();
    }, 300);
  };

  // 礼花效果
  useEffect(() => {
    const fireRealisticConfetti = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.6 },
        zIndex: 2000,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    };

    fireRealisticConfetti();
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleExit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`
        ${styles.completeContainer} 
        ${isExiting ? styles.exiting : ''}
      `}
    >
      <div className={styles.celebrationIcon}>
        <CheckCircle size={80} strokeWidth={2.5} />
      </div>
      <h1 className={styles.completeTitle}>{t('completion.title')}</h1>

      {/* 3. 使用计算好的 randomSubMessage */}
      <p className={styles.completeSub}>{randomSubMessage}</p>

      <button
        className={styles.fillingBtn}
        onClick={handleExit}
        style={
          { '--duration': `${autoRedirectSeconds}s` } as React.CSSProperties
        }
      >
        <span className={styles.btnText}>
          {t('completion.backHome', { seconds: countdown })}
        </span>
      </button>
    </div>
  );
};
