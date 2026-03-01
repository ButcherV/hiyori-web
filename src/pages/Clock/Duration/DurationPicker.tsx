import { useState, useRef } from 'react';
import { useTTS } from '../../../hooks/useTTS';
import { TIME_PERIODS, type TimePeriod } from './types';
import { PeriodChips } from './PeriodChips';
import { CircularPicker } from './CircularPicker';
import { ClockBottomDisplay } from '../ClockBottomDisplay';
import styles from './DurationPicker.module.css';

// 根据当前小时找最匹配的时段（取范围最小/最精确的）
function getPeriodForHour(h: number): TimePeriod | null {
  const matches = TIME_PERIODS.filter((p) => {
    if (p.start === p.end) {
      // 点时段（正午/真夜中）：15 分钟内视为匹配
      return Math.abs(h - p.start) < 0.25 || (p.start === 0 && h >= 23.75);
    }
    const end = p.end === 0 || p.end === 24 ? 24 : p.end;
    return h >= p.start && h < end;
  });
  if (matches.length === 0) return null;
  // 范围最小的词最精确（夕方 3h 优先于 午後 6h）
  return matches.reduce((best, p) => {
    const range = (x: TimePeriod) => {
      if (x.start === x.end) return 1;
      const e = x.end === 0 || x.end === 24 ? 24 : x.end;
      return e - x.start;
    };
    return range(p) < range(best) ? p : best;
  });
}

function periodToAngles(period: TimePeriod): { startAngle: number; endAngle: number } {
  const startAngle = (270 + period.start * 15) % 360;
  const endAngle = period.end === 0 || period.end === 24 ? 270 : (270 + period.end * 15) % 360;
  return { startAngle, endAngle };
}

function animateAngleTo(
  from: number,
  to: number,
  setter: React.Dispatch<React.SetStateAction<number>>,
  animRef: React.MutableRefObject<number | null>,
  duration = 380
) {
  if (animRef.current !== null) {
    cancelAnimationFrame(animRef.current);
    animRef.current = null;
  }
  let delta = to - from;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  if (Math.abs(delta) < 0.5) { setter(((to % 360) + 360) % 360); return; }
  const startTime = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    const eased = 1 - (1 - t) ** 3;
    setter(((from + delta * eased) % 360 + 360) % 360);
    if (t < 1) {
      animRef.current = requestAnimationFrame(tick);
    } else {
      animRef.current = null;
      setter(((to % 360) + 360) % 360);
    }
  };
  animRef.current = requestAnimationFrame(tick);
}

export function DurationPicker() {
  const { speak } = useTTS();

  // 计算初始状态（当前时刻对应的时段）
  const initialRef = useRef<{ period: TimePeriod | null; startAngle: number; endAngle: number } | null>(null);
  if (!initialRef.current) {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const period = getPeriodForHour(h);
    const angles = period ? periodToAngles(period) : { startAngle: 270, endAngle: 285 };
    initialRef.current = { period, startAngle: angles.startAngle, endAngle: angles.endAngle };
  }

  const [activePeriod, setActivePeriod] = useState<TimePeriod | null>(initialRef.current.period);
  const [startAngle, setStartAngle] = useState(initialRef.current.startAngle);
  const [endAngle, setEndAngle] = useState(initialRef.current.endAngle);

  const startAngleRef = useRef(startAngle);
  const endAngleRef = useRef(endAngle);
  startAngleRef.current = startAngle;
  endAngleRef.current = endAngle;

  const startAnimRef = useRef<number | null>(null);
  const endAnimRef = useRef<number | null>(null);

  const setTimePeriod = (period: TimePeriod) => {
    setActivePeriod(period);
    const { startAngle: targetStart, endAngle: targetEnd } = periodToAngles(period);
    animateAngleTo(startAngleRef.current, targetStart, setStartAngle, startAnimRef);
    animateAngleTo(endAngleRef.current, targetEnd, setEndAngle, endAnimRef);
  };

  const goToCurrent = () => {
    const now = new Date();
    const h = now.getHours() + now.getMinutes() / 60;
    const period = getPeriodForHour(h);
    if (period) setTimePeriod(period);
  };

  // 双击跳转到下一个时段
  const goToNextPeriod = () => {
    if (!activePeriod) {
      setTimePeriod(TIME_PERIODS[0]);
      return;
    }
    const currentIndex = TIME_PERIODS.findIndex(p => p.name === activePeriod.name);
    const nextIndex = (currentIndex + 1) % TIME_PERIODS.length;
    setTimePeriod(TIME_PERIODS[nextIndex]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <PeriodChips
          periods={TIME_PERIODS}
          selectedPeriod={activePeriod}
          onSelectPeriod={setTimePeriod}
        />
        <CircularPicker
          startAngle={startAngle}
          endAngle={endAngle}
          selectedPeriod={activePeriod}
          onGoToCurrent={goToCurrent}
          onDoubleTap={goToNextPeriod}
        />
      </div>
      <ClockBottomDisplay
        mode="duration-period"
        period={activePeriod}
        onPlayPeriod={() => { if (activePeriod) speak(activePeriod.name); }}
      />
    </div>
  );
}
