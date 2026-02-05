import React from 'react';
import { BookOpen, Swords } from 'lucide-react';
import styles from './ModeToggleFAB.module.css';

// 定义模式类型 (如果你的项目里有全局定义更好，没有的话这里定义也行)
export type LearnMode = 'learn' | 'test';

interface Props {
  mode: LearnMode;
  onToggle: () => void;
  className?: string; // 允许外部微调位置
}

export const ModeToggleFAB: React.FC<Props> = ({
  mode,
  onToggle,
  className,
}) => {
  return (
    <div
      className={`${styles.fabSwitch} ${mode === 'test' ? styles.modeTest : ''} ${className || ''}`}
      onClick={onToggle}
      aria-label={mode === 'learn' ? 'Switch to Challenge' : 'Back to Learn'}
    >
      {/* 动画过渡可以后续再加，先保证功能 */}
      {mode === 'learn' ? (
        <Swords size={22} strokeWidth={2.5} />
      ) : (
        <BookOpen size={22} strokeWidth={2.5} />
      )}
    </div>
  );
};
