// src/pages/KanaDictAndQuiz/PageMistakeNotebook/QuizConfirmSheet.tsx

import React from 'react';
import { Sword } from 'lucide-react';
import BottomSheet from '../../../components/BottomSheet'; // 请确保路径正确
import styles from './QuizConfirmSheet.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  count: number;
}

export const QuizConfirmSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  count,
}) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="错题突击">
      <div className={styles.container}>
        {/* 氛围图标 */}
        <div className={styles.iconWrapper}>
          <Sword size={32} color="#007AFF" />
        </div>

        {/* 标题 */}
        <h3 className={styles.title}>准备好消灭 {count} 个错题了吗？</h3>

        {/* 描述文本 */}
        <p className={styles.description}>
          这是集中复习的高效方式。
          <br />
          答对的假名将获得进度标记，
          <br />
          <span className={styles.highlight}>连续答对两次</span>{' '}
          即可彻底移出列表。
        </p>

        {/* 按钮组 */}
        <div className={styles.buttonGroup}>
          <button
            onClick={onClose}
            className={`${styles.baseBtn} ${styles.cancelBtn}`}
          >
            再看看
          </button>

          <button
            onClick={onConfirm}
            className={`${styles.baseBtn} ${styles.startBtn}`}
          >
            开始挑战
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
