import React from 'react';
import { Play, Pause, Repeat } from 'lucide-react';
import styles from './Level1Controller.module.css'; // 🟢 引用自己的样式

interface Level1ControllerProps {
  isPlaying: boolean;
  isLoopMode: boolean;
  currentIndex: number;
  totalCount: number;
  onTogglePlay: () => void;
  onToggleLoop: () => void;
}

export const Level1Controller: React.FC<Level1ControllerProps> = ({
  isPlaying,
  isLoopMode,
  currentIndex,
  totalCount,
  onTogglePlay,
  onToggleLoop,
}) => {
  return (
    <div className={styles.controller}>
      <div className={styles.controllerInner}>
        <button
          className={`${styles.ctrlBtn} ${isLoopMode ? styles.ctrlActive : ''}`}
          onClick={onToggleLoop}
        >
          <Repeat size={20} />
        </button>

        <div className={styles.progressText}>
          {currentIndex + 1} / {totalCount}
        </div>

        <button className={styles.playBtn} onClick={onTogglePlay}>
          {isPlaying ? (
            <Pause size={24} fill="#000" />
          ) : (
            <Play size={24} fill="currentColor" style={{ marginLeft: 2 }} />
          )}
        </button>
      </div>
    </div>
  );
};
