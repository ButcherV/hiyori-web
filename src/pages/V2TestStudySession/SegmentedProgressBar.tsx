import React from 'react';
import styles from './SegmentedProgressBar.module.css';

interface Props {
  learnCurrent: number;
  learnTotal: number;
  quizCurrent: number;
  quizTotal: number;
  phase: 'LEARNING' | 'QUIZ';
}

export const SegmentedProgressBar: React.FC<Props> = ({
  learnCurrent,
  learnTotal,
  quizCurrent,
  quizTotal,
  phase,
}) => {
  // 1. 安全计算百分比的辅助函数
  const getPercent = (current: number, total: number) => {
    if (total <= 0) return 0; // 防止除以 0
    const percent = (current / total) * 100;
    return Math.min(100, Math.max(0, percent)); // 限制在 0-100 之间
  };

  // 计算具体进度
  // 如果在 Quiz 阶段，强制左边（学习条）满格，作为一个视觉兜底
  const learnPercent =
    phase === 'QUIZ' ? 100 : getPercent(learnCurrent, learnTotal);

  const quizPercent =
    phase === 'LEARNING' ? 0 : getPercent(quizCurrent, quizTotal);

  // 2. 修正 Flex 权重逻辑
  // 如果 Total 是 0，Flex 也是 0（让它消失），否则按比例分配
  // 这样如果某节课只有测试或只有学习，进度条会自动占满全屏
  const learnFlex = learnTotal > 0 ? learnTotal : 0;
  const quizFlex = quizTotal > 0 ? quizTotal : 0;

  return (
    <div className={styles.container}>
      {/* 左段：学习 */}
      {/* 只有当 flex > 0 时才渲染，或者利用 flex: 0 自动收缩 */}
      <div
        className={`${styles.segment}`}
        style={{ flex: learnFlex, display: learnFlex === 0 ? 'none' : 'block' }}
      >
        <div
          className={`${styles.fill} ${styles.learnColor}`}
          style={{ width: `${learnPercent}%` }}
        />
      </div>

      {/* 缝隙：只有当两边都有内容时才显示缝隙 */}
      {learnTotal > 0 && quizTotal > 0 && <div className={styles.gap} />}

      {/* 右段：测试 */}
      <div
        className={`${styles.segment}`}
        style={{ flex: quizFlex, display: quizFlex === 0 ? 'none' : 'block' }}
      >
        <div
          className={`${styles.fill} ${styles.quizColor}`}
          style={{ width: `${quizPercent}%` }}
        />
      </div>
    </div>
  );
};
