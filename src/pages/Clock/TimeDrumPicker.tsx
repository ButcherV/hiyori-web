import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Reel } from './Reel';
import { TimeDisplay } from './TimeDisplay';
import { QuickActions } from './QuickActions';
import styles from './TimeDrumPicker.module.css';

export interface TimeDrumPickerRef {
  resetToNow: () => void;
}

export const TimeDrumPicker = forwardRef<TimeDrumPickerRef, object>(function TimeDrumPicker(_props, ref) {
  const now = new Date();
  const [hour, setHour] = useState(now.getHours());
  const [minute, setMinute] = useState(now.getMinutes());
  const [is24h, setIs24h] = useState(true);

  const hourIdx12 = hour % 12;

  const setHourFrom12 = useCallback(
    (idx: number) => {
      const h12 = idx === 0 ? 12 : idx;
      const wasAM = hour < 12;
      setHour(wasAM ? (h12 === 12 ? 0 : h12) : h12 === 12 ? 12 : h12 + 12);
    },
    [hour]
  );

  const handleJumpTo = useCallback((targetHour: number, targetMinute: number) => {
    setHour(targetHour);
    setMinute(targetMinute);
  }, []);

  const handleResetToNow = useCallback(() => {
    const n = new Date();
    setHour(n.getHours());
    setMinute(n.getMinutes());
  }, []);

  const handleToggleFormat = useCallback(() => {
    setIs24h((prev) => !prev);
  }, []);

  useImperativeHandle(ref, () => ({
    resetToNow: handleResetToNow,
  }));

  const fmtPad2 = useCallback((v: number) => String(v).padStart(2, '0'), []);
  const fmt12h = useCallback(
    (v: number) => (v === 0 ? '12' : String(v).padStart(2, '0')),
    []
  );

  return (
    <>
      <QuickActions
        is24h={is24h}
        onToggleFormat={handleToggleFormat}
        onJumpToNow={handleResetToNow}
        onJumpTo={handleJumpTo}
      />

      <div className={styles.pickerArea}>
        <div className={styles.drums}>
          {is24h ? (
            <Reel
              key="h24"
              valueRange={24}
              selected={hour}
              formatLabel={fmtPad2}
              onSelect={setHour}
              side="left"
              accentColor="#C4553A"
              accentBg="rgba(255, 248, 245, 0.85)"
            />
          ) : (
            <Reel
              key="h12"
              valueRange={12}
              selected={hourIdx12}
              formatLabel={fmt12h}
              onSelect={setHourFrom12}
              side="left"
              accentColor="#C4553A"
              accentBg="rgba(255, 248, 245, 0.85)"
            />
          )}

          <span className={styles.colon}>:</span>

          <Reel
            valueRange={60}
            selected={minute}
            formatLabel={fmtPad2}
            onSelect={setMinute}
            side="right"
            accentColor="#4A6FA5"
            accentBg="rgba(245, 248, 255, 0.85)"
          />
        </div>
      </div>

      <TimeDisplay hour={hour} minute={minute} is24h={is24h} />
    </>
  );
});
