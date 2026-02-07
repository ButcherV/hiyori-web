// src/pages/Dates/Levels/Level1/components/Level1Controller.tsx

import React from 'react';
import { Play, Pause, Repeat, Repeat1 } from 'lucide-react';
import styles from './Level1Controller.module.css';
import { type LoopMode } from '../Level1';

interface Level1ControllerProps {
  isPlaying: boolean;
  loopMode: LoopMode;
  progress: {
    current: number;
    total: number;
    percent: number;
  };
  onTogglePlay: () => void;
  onToggleLoop: () => void;
}

export const Level1Controller: React.FC<Level1ControllerProps> = ({
  isPlaying,
  loopMode,
  progress,
  onTogglePlay,
  onToggleLoop,
}) => {
  return (
    <div className={styles.controller}>
      <div className={styles.controllerInner}>
        {/* 🟢 左侧：循环模式切换 */}
        <button
          className={`${styles.loopBtn} ${loopMode !== 'off' ? styles.loopActive : ''}`}
          onClick={onToggleLoop}
          aria-label="Toggle Loop Mode"
        >
          {loopMode === 'one' ? (
            <Repeat1 size={18} strokeWidth={2.5} />
          ) : (
            <Repeat size={18} strokeWidth={2.5} />
          )}
          {/* 小红点指示器 (可选，增强模式感知) */}
          {loopMode !== 'off' && <div className={styles.loopIndicator} />}
        </button>

        {/* 🟢 中间：数据展示 (如 01 / 06) */}
        <div className={styles.progressInfo}>
          <div className={styles.progressValue}>
            {String(progress.current).padStart(2, '0')}
            <span className={styles.totalValue}>
              /{String(progress.total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 🟢 右侧：播放按钮 */}
        <button className={styles.playBtn} onClick={onTogglePlay}>
          {isPlaying ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />
          )}
        </button>

        {/* 底部：极简进度条 */}
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
