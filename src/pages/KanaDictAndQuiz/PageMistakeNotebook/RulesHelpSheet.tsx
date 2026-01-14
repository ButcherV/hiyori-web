// src/pages/KanaDictAndQuiz/PageMistakeNotebook/RulesHelpSheet.tsx

import React from 'react';
import { HelpCircle, PartyPopper, Zap, Volume2 } from 'lucide-react';
import BottomSheet from '../../../components/BottomSheet';
import styles from './RulesHelpSheet.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesHelpSheet: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="使用说明">
      <div className={styles.container}>
        {/* 板块 1: 核心机制 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <PartyPopper size={18} color="#FF9500" />
            <span>如何移出错题？</span>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.text}>
              所有错题需要 <strong>连续答对 2 轮次</strong> 才能移出列表。
              <br />
              这是为了防止靠猜测过关，确保真正掌握。
            </p>
          </div>
        </div>

        {/* 板块 2: 图例字典 (解释红点绿环) */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <HelpCircle size={18} color="#007AFF" />
            <span>状态图解</span>
          </div>

          <div className={styles.sectionContent}>
            {/* 图例 A: 复习中 */}
            <div className={styles.legendRow}>
              <div className={styles.mockBadge}>3</div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>复习中</span>
                <span className={styles.legendDesc}>
                  红圈内的数字代表累计错误次数。
                </span>
              </div>
            </div>

            {/* 图例 B: 即将移出 */}
            <div className={styles.legendRow}>
              <div className={styles.mockRingWrapper}>
                <div className={styles.mockRingBadge}>5</div>
                <div className={styles.mockRingBorder} />
              </div>
              <div className={styles.legendText}>
                <span
                  className={styles.legendTitle}
                  style={{ color: '#34C759' }}
                >
                  即将移出
                </span>
                <span className={styles.legendDesc}>
                  出现绿色半环，表示已连对 1 次。
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 板块 3: 功能字典 (解释闪电喇叭) */}
        <div className={styles.section} style={{ marginBottom: 0 }}>
          <div className={styles.sectionTitle}>
            <Zap size={18} fill="#FFCC00" color="#FF9500" />
            <span>功能按钮</span>
          </div>
          <div className={styles.sectionContent}>
            {/* 闪电 */}
            <div className={styles.legendRow}>
              <div className={styles.iconBg}>
                <Zap size={18} color="#007AFF" fill="#007AFF" />
              </div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>错题突击</span>
                <span className={styles.legendDesc}>
                  对当前列表的所有错题进行集中测试。
                </span>
              </div>
            </div>
            {/* 喇叭 */}
            <div className={styles.legendRow}>
              <div className={styles.iconBg}>
                <Volume2 size={18} color="#8e8e93" />
              </div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>听发音</span>
                <span className={styles.legendDesc}>
                  点击列表中的任意一行即可播放。
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
