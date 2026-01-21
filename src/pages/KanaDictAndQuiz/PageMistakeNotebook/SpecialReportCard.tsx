import React, { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PartyPopper, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import styles from './SpecialReportCard.module.css';

interface Props {
  data: {
    fixed: string[];
    failed: string[];
  };
  onDismiss: () => void;
}

// 🟢 外层 Wrapper 动画：只控制高度 (Height)
const wrapperVariants: Variants = {
  hidden: {
    height: 0,
    opacity: 0,
  },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.3 },
    },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { delay: 0.3, duration: 0.3, ease: 'easeInOut' },
      opacity: { delay: 0.3, duration: 0.3 },
    },
  },
};

// 🔵 内层 Card 动画：只控制位移 (X)
const innerCardVariants: Variants = {
  hidden: {
    x: 50,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      x: { delay: 0.3, duration: 0.3, ease: 'easeOut' },
      opacity: { delay: 0.3, duration: 0.3 },
    },
  },
  exit: {
    x: -100,
    opacity: 0,
    transition: {
      x: { duration: 0.3, ease: 'easeIn' },
      opacity: { duration: 0.3 },
    },
  },
};

export const SpecialReportCard: React.FC<Props> = ({ data, onDismiss }) => {
  const { t } = useTranslation();

  // 自动倒计时
  useEffect(() => {
    // x 秒后自动触发关闭
    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);

    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const fixedCount = data.fixed.length;
  const failedCount = data.failed.length;
  const isPerfect = failedCount === 0;

  return (
    // 外层 Wrapper：负责高度占位
    <motion.div
      variants={wrapperVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{ overflow: 'hidden' }}
    >
      {/* 内层 Card：负责展示内容 (去掉了所有 drag 和 mouse 事件) */}
      <motion.div className={styles.card} variants={innerCardVariants}>
        <div className={styles.bgIcon}>
          {isPerfect ? <PartyPopper size={80} /> : <AlertTriangle size={112} />}
        </div>

        <div className={styles.content}>
          <div className={styles.title}>
            {isPerfect ? (
              <>
                <CheckCircle2
                  size={18}
                  fill="var(--color-success)"
                  color="white"
                />
                <span>{t('mistake_notebook.report_perfect')}</span>
              </>
            ) : (
              <>
                <AlertTriangle
                  size={18}
                  fill="var(--color-error)"
                  color="white"
                />
                <span>{t('mistake_notebook.report_title')}</span>
              </>
            )}
          </div>
          <div className={styles.detail}>
            {fixedCount > 0 && (
              <div className={styles.detailRow}>
                <span className={styles.successText}>
                  {t('mistake_notebook.report_fixed', { count: fixedCount })}
                </span>
                <span className={`${styles.kanaList} jaFont`}>
                  : {data.fixed.join(', ')}
                </span>
              </div>
            )}
            {failedCount > 0 && (
              <div className={styles.detailRow}>
                <span className={styles.errorText}>
                  {t('mistake_notebook.report_failed', { count: failedCount })}
                </span>
                <span className={`${styles.kanaList} jaFont`}>
                  : {data.failed.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        <button
          className={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
};
