import { useState, useCallback } from 'react';
import { Reel } from './Reel';
import { TimeDisplay } from './TimeDisplay';
import { QuickActions } from './QuickActions';
import styles from './TimeDrumPicker.module.css';

type Axis = 'hour' | 'minute' | 'second';

// 时长特殊发音数字
// 小时：4時間(よじかん)、9時間(くじかん)、14時間、17時間、19時間
const SPECIAL_HOURS = [4, 9, 14, 17, 19];
// 分钟：结尾 1、3、6、8、0 促音化为ぷん
const SPECIAL_MINUTES = Array.from({ length: 60 }, (_, i) => i).filter(
  (v) => [1, 3, 6, 8, 0].includes(v % 10) && v !== 0 // 排除 0 分
);
// 秒：没有特殊发音规则
const SPECIAL_SECONDS: number[] = [];

/** 找增大方向上最近的特殊发音值（始终排除 current 本身，到头则循环） */
function findNearestSpecial(current: number, specials: number[], range: number): number {
  if (specials.length === 0) return current;
  const fwdDist = (v: number) => (v - current + range) % range;
  return specials
    .filter((v) => v !== current)
    .reduce((best, v) => (fwdDist(v) < fwdDist(best) ? v : best));
}

export function TimeDrumPicker() {
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [second, setSecond] = useState(0);
  const [activeAxes, setActiveAxes] = useState<Set<Axis>>(
    new Set<Axis>(['hour', 'minute', 'second'])
  );

  const handleToggleAxis = useCallback((axis: Axis) => {
    setActiveAxes((prev) => {
      if (prev.has(axis) && prev.size === 1) return prev;
      const next = new Set(prev);
      if (next.has(axis)) next.delete(axis);
      else next.add(axis);
      return next;
    });
  }, []);

  const fmtPad2 = useCallback((v: number) => String(v).padStart(2, '0'), []);

  // 双击：跳到最近的特殊发音值
  const handleHourDoubleTap = useCallback(() => {
    setHour((h) => findNearestSpecial(h, SPECIAL_HOURS, 24));
  }, []);
  const handleMinuteDoubleTap = useCallback(() => {
    setMinute((m) => findNearestSpecial(m, SPECIAL_MINUTES, 60));
  }, []);
  const handleSecondDoubleTap = useCallback(() => {
    setSecond((s) => findNearestSpecial(s, SPECIAL_SECONDS, 60));
  }, []);

  return (
    <>
      <QuickActions activeAxes={activeAxes} onToggleAxis={handleToggleAxis} />

      <div className={styles.pickerArea}>
        <div className={styles.reels}>
          {/* 横跨时、分、秒的整体选中高亮条（test3.html highlight-band） */}
          <div className={styles.highlightBand} />

          <div
            className={`${styles.reelWrapper} ${!activeAxes.has('hour') ? styles.reelDisabled : ''}`}
          >
            <Reel
              valueRange={24}
              selected={hour}
              formatLabel={fmtPad2}
              onSelect={setHour}
              side="left"
              accentColor="#C4553A"
              accentBg="rgba(255, 248, 245, 0.85)"
              onDoubleTap={handleHourDoubleTap}
            />
          </div>

          <div
            className={`${styles.reelWrapper} ${!activeAxes.has('minute') ? styles.reelDisabled : ''}`}
          >
            <Reel
              valueRange={60}
              selected={minute}
              formatLabel={fmtPad2}
              onSelect={setMinute}
              side="center"
              accentColor="#4A6FA5"
              accentBg="rgba(245, 248, 255, 0.85)"
              onDoubleTap={handleMinuteDoubleTap}
            />
          </div>

          <div
            className={`${styles.reelWrapper} ${!activeAxes.has('second') ? styles.reelDisabled : ''}`}
          >
            <Reel
              valueRange={60}
              selected={second}
              formatLabel={fmtPad2}
              onSelect={setSecond}
              side="right"
              accentColor="#3D9970"
              accentBg="rgba(240, 255, 248, 0.85)"
              onDoubleTap={handleSecondDoubleTap}
            />
          </div>
        </div>
      </div>

      <TimeDisplay hour={hour} minute={minute} second={second} activeAxes={activeAxes} />
    </>
  );
}
