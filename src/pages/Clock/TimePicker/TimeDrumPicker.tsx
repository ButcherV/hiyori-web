import { useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import { Drum } from './Drum';
import { TimeDisplay } from './TimeDisplay';
import { QuickActions } from './QuickActions';
import styles from './TimeDrumPicker.module.css';

// 特殊发音小时：よじ(4)、しちじ(7)、くじ(9)，24h 模式补 14、17、19
const SPECIAL_HOURS = [4, 7, 9, 14, 17, 19];
// 特殊发音分钟：结尾 1(いっぷん)、3(さんぷん)、6(ろっぷん)、8(はっぷん)
const SPECIAL_MINUTES = Array.from({ length: 60 }, (_, i) => i).filter(
  (v) => [1, 3, 6, 8].includes(v % 10)
);

/** 找增大方向上最近的特殊发音值（始终排除 current 本身，到头则循环） */
function findNearestSpecial(current: number, specials: number[], range: number): number {
  // 用正向距离：从 current 往大走需要走多少步
  const fwdDist = (v: number) => (v - current + range) % range;
  return specials
    .filter((v) => v !== current)
    .reduce((best, v) => (fwdDist(v) < fwdDist(best) ? v : best));
}

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

  // 双击：跳到最近的特殊发音值
  const handleHourDoubleTap = useCallback(() => {
    setHour((h) => findNearestSpecial(h, SPECIAL_HOURS, 24));
  }, []);
  const handleMinuteDoubleTap = useCallback(() => {
    setMinute((m) => findNearestSpecial(m, SPECIAL_MINUTES, 60));
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
            onDoubleTap={handleHourDoubleTap}
          />

          <span className={styles.colon}></span>

          <Drum
            valueRange={60}
            selected={minute}
            formatLabel={fmtPad2}
            onSelect={setMinute}
            side="right"
            accentColor="#4A6FA5"
            onDoubleTap={handleMinuteDoubleTap}
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
