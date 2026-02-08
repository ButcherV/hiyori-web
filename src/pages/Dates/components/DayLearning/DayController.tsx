// src/pages/Dates/components/DayLearning/DayController.tsx

import React from 'react';
import { Play, Pause, Repeat, Repeat1 } from 'lucide-react';
// 🔴 引用独立的 CSS
import styles from './DayController.module.css';

export type LoopMode = 'off' | 'all' | 'one';

interface DayControllerProps {
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

export const DayController: React.FC<DayControllerProps> = ({
  isPlaying,
  loopMode,
  progress,
  onTogglePlay,
  onToggleLoop,
}) => {
  return (
    <div className={styles.controller}>
      <div className={styles.controllerInner}>
        {/* Loop Btn */}
        <button
          className={`${styles.loopBtn} ${loopMode !== 'off' ? styles.loopActive : ''}`}
          onClick={onToggleLoop}
        >
          {loopMode === 'one' ? (
            <Repeat1 size={18} strokeWidth={2.5} />
          ) : (
            <Repeat size={18} strokeWidth={2.5} />
          )}
          {loopMode !== 'off' && <div className={styles.loopIndicator} />}
        </button>

        {/* Info */}
        <div className={styles.progressInfo}>
          <div className={styles.progressValue}>
            {String(progress.current).padStart(2, '0')}
            <span className={styles.totalValue}>
              /{String(progress.total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Play Btn */}
        <button className={styles.playBtn} onClick={onTogglePlay}>
          {isPlaying ? (
            <Pause size={22} fill="currentColor" />
          ) : (
            <Play size={22} fill="currentColor" style={{ marginLeft: 3 }} />
          )}
        </button>

        {/* Progress Bar */}
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
