import { useState, useCallback } from 'react';
import { Reel } from './Reel';
import { TimeDisplay } from './TimeDisplay';
import { QuickActions } from './QuickActions';
import styles from './TimeDrumPicker.module.css';

type Axis = 'hour' | 'minute' | 'second';

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

  const handleJumpTo = useCallback((axis: Axis, value: number) => {
    setActiveAxes((prev) => {
      if (prev.has(axis)) return prev;
      return new Set([...prev, axis]);
    });
    if (axis === 'hour') setHour(value);
    else if (axis === 'minute') setMinute(value);
    else setSecond(value);
  }, []);

  const fmtPad2 = useCallback((v: number) => String(v).padStart(2, '0'), []);

  return (
    <>
      <QuickActions activeAxes={activeAxes} onToggleAxis={handleToggleAxis} onJumpTo={handleJumpTo} />

      <div className={styles.pickerArea}>
        <div className={styles.reels}>
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
            />
          </div>
        </div>
      </div>

      <TimeDisplay hour={hour} minute={minute} second={second} activeAxes={activeAxes} />
    </>
  );
}
