// src/pages/Dates/Levels/Level1/components/Level1Controller.tsx

import React from 'react';
import { Play, Pause } from 'lucide-react';
import styles from './Level1Controller.module.css';

interface Level1ControllerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  // 🟢 接收计算好的进度信息
  progress: {
    current: number;
    total: number;
    percent: number;
  };
}

export const Level1Controller: React.FC<Level1ControllerProps> = ({
  isPlaying,
  onTogglePlay,
  progress,
}) => {
  return (
    <div className={styles.controller}>
      <div className={styles.controllerInner}>
        {/* 左侧：数据展示区 */}
        <div className={styles.progressInfo}>
          <span className={styles.progressLabel}>INDEX</span>
          <div className={styles.progressValue}>
            {/* 补零显示，更像仪器数据: 01 / 31 */}
            {String(progress.current).padStart(2, '0')}
            <span className={styles.totalValue}>
              /{String(progress.total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 右侧：播放按钮 */}
        <button className={styles.playBtn} onClick={onTogglePlay}>
          {isPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />
          )}
        </button>

        {/* 底部：进度条 */}
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
