import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Drum } from './Drum';
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
  
  // 12h 格式化：将 0-23 转换为 12h 显示
  const fmt12h = useCallback((v: number) => {
    const h12 = v % 12;
    return (h12 === 0 ? 12 : h12).toString().padStart(2, '0');
  }, []);

  return (
    <>
      <QuickActions
        is24h={is24h}
        onToggleFormat={handleToggleFormat}
        onJumpToNow={handleResetToNow}
      />

      <div className={styles.pickerArea}>
        <div className={styles.drums}>
          {/* 12h 模式也使用 valueRange={24}，只在显示时格式化 */}
          <Drum
            key={is24h ? 'h24' : 'h12'}
            valueRange={24}
            selected={hour}
            formatLabel={is24h ? fmtPad2 : fmt12h}
            onSelect={setHour}
            side="left"
            accentColor="#C4553A"
          />

          <span className={styles.colon}>:</span>

          <Drum
            valueRange={60}
            selected={minute}
            formatLabel={fmtPad2}
            onSelect={setMinute}
            side="right"
            accentColor="#4A6FA5"
          />

          {/* AM/PM 指示器 - 只在 12h 模式下显示，绝对定位 */}
          {!is24h && (
            <div className={styles.ampmIndicator} key={hour < 12 ? 'AM' : 'PM'}>
              {hour < 12 ? 'AM' : 'PM'}
            </div>
          )}
        </div>
      </div>

      <TimeDisplay hour={hour} minute={minute} is24h={is24h} />
    </>
  );
});
