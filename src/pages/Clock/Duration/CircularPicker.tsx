import { useMemo, useRef } from 'react';
import { LocateFixed } from 'lucide-react';
import type { TimePeriod } from './types';
import styles from './CircularPicker.module.css';

interface CircularPickerProps {
  startAngle: number;
  endAngle: number;
  selectedPeriod: TimePeriod | null;
  onGoToCurrent: () => void;
  onDoubleTap?: () => void;
}

const generateTicks = () => {
  const ticks = [];
  for (let i = 0; i < 144; i++) {
    const angle = i * (360 / 144) - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 6 === 0;
    const r1 = 125;
    const r2 = isMajor ? 139 : 132;
    ticks.push({
      x1: 200 + r1 * Math.cos(rad),
      y1: 200 + r1 * Math.sin(rad),
      x2: 200 + r2 * Math.cos(rad),
      y2: 200 + r2 * Math.sin(rad),
      isMajor,
    });
  }
  return ticks;
};

const generateLabels = () => {
  const labelTexts = [
    '12am',
    '',
    '2',
    '',
    '4',
    '',
    '6',
    '',
    '8',
    '',
    '10',
    '',
    '12pm',
    '',
    '2',
    '',
    '4',
    '',
    '6',
    '',
    '8',
    '',
    '10',
    '',
  ];
  return labelTexts
    .map((text, i) => {
      if (!text) return null;
      const angle = i * 15 - 90;
      const rad = (angle * Math.PI) / 180;
      const r = 113;
      return { x: 200 + r * Math.cos(rad), y: 200 + r * Math.sin(rad), text };
    })
    .filter(Boolean);
};

export function CircularPicker({
  startAngle,
  endAngle,
  selectedPeriod,
  onGoToCurrent,
  onDoubleTap,
}: CircularPickerProps) {
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    const now = performance.now();
    const { clientX, clientY } = e;

    if (lastTapRef.current) {
      const dt = now - lastTapRef.current.time;
      const dx = clientX - lastTapRef.current.x;
      const dy = clientY - lastTapRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (dt < 350 && distance < 25) {
        onDoubleTap?.();
        lastTapRef.current = null;
        return;
      }
    }

    lastTapRef.current = { time: now, x: clientX, y: clientY };
  };

  const getArcPath = () => {
    const s = Math.round(startAngle / 2.5) * 2.5;
    const e = Math.round(endAngle / 2.5) * 2.5;
    let diff = e - s;
    if (diff < 0) diff += 360;

    const r = 150;
    let arcStart = s;
    let arcEnd = s + diff;

    // 点时段（正午/真夜中）：以该点为中心画 ±7.5° 的对称小弧
    if (diff === 0) {
      arcStart = s - 7.5;
      arcEnd = s + 7.5;
    }

    const x1 = 200 + r * Math.cos((arcStart * Math.PI) / 180);
    const y1 = 200 + r * Math.sin((arcStart * Math.PI) / 180);
    const x2 = 200 + r * Math.cos((arcEnd * Math.PI) / 180);
    const y2 = 200 + r * Math.sin((arcEnd * Math.PI) / 180);

    return `M ${x1} ${y1} A ${r} ${r} 0 ${arcEnd - arcStart > 180 ? 1 : 0} 1 ${x2} ${y2}`;
  };

  // 时间区间文字：优先用 selectedPeriod 的精确整数，避免角度转换产生 NaN
  const rangeText = (() => {
    if (selectedPeriod) {
      if (selectedPeriod.start === selectedPeriod.end)
        return `${selectedPeriod.start}:00`;
      const endH = selectedPeriod.end === 0 ? 24 : selectedPeriod.end;
      return `${selectedPeriod.start}:00 ~ ${endH}:00`;
    }
    const sh = Math.round(((startAngle - 270 + 360) % 360) / 15) % 24;
    const eh = Math.round(((endAngle - 270 + 360) % 360) / 15) % 24;
    return sh === eh ? `${sh}:00` : `${sh}:00 ~ ${eh === 0 ? 24 : eh}:00`;
  })();

  const staticOverlay = useMemo(() => {
    const ticks = generateTicks();
    const labels = generateLabels();
    return (
      <g>
        <g>
          {ticks.map((tick, i) => (
            <line
              key={i}
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke="rgba(0,0,0,0.15)"
              strokeWidth={tick.isMajor ? '2' : '1.5'}
              strokeLinecap="round"
            />
          ))}
        </g>
        <g>
          {labels.map((label: any, i) => (
            <text
              key={i}
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#888888"
              fontSize="14"
              fontWeight="500"
            >
              {label.text}
            </text>
          ))}
        </g>
      </g>
    );
  }, []);

  return (
    <div className={styles.clockContainer} onPointerDown={handlePointerDown}>
      <svg className={styles.clockSvg} viewBox="0 0 400 400">
        <defs>
          <filter id="arcShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3"
              floodColor="#000"
              floodOpacity="0.08"
            />
          </filter>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="#f0f0f0"
          strokeWidth="50"
        />
        <path
          d={getArcPath()}
          fill="none"
          stroke="#a9e55b"
          strokeWidth="50"
          strokeLinecap="butt"
        />
        {staticOverlay}
      </svg>

      {/* HTML 中心叠加层 */}
      <div className={styles.centerOverlay}>
        {/* 汉字 + 注音 */}
        <div className={styles.kanjiBlock}>
          {selectedPeriod && (
            <span className={`${styles.kana} jaFont`}>
              {selectedPeriod.kana}
            </span>
          )}
          <span className={`${styles.kanji} jaFont`}>
            {selectedPeriod ? selectedPeriod.name : '—'}
          </span>
        </div>

        {/* 时间段 */}
        <span className={styles.timeRange}>{rangeText}</span>

        <button className={styles.locateBtn} onClick={onGoToCurrent}>
          <LocateFixed size={14} />
        </button>
      </div>
    </div>
  );
}
