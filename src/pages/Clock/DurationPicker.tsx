import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';
import styles from './DurationPicker.module.css';

// 时间段快捷选项
const DURATION_SHORTCUTS = [
  { hours: 1, label: '1時間' },
  { hours: 3, label: '3時間' },
  { hours: 4, label: '4時間' },
  { hours: 6, label: '6時間' },
  { hours: 8, label: '8時間' },
  { hours: 10, label: '10時間' },
  { hours: 30, label: '30分', isMinutes: true },
];

// --- 优化点 3：将不依赖 state 的静态数据生成函数移到组件外部 ---
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
    '12am', '', '2', '', '4', '', '6', '', '8', '', '10', '',
    '12pm', '', '2', '', '4', '', '6', '', '8', '', '10', '',
  ];
  return labelTexts.map((text, i) => {
    if (!text) return null;
    const angle = i * 15 - 90;
    const rad = (angle * Math.PI) / 180;
    const r = 95;
    return {
      x: 200 + r * Math.cos(rad),
      y: 200 + r * Math.sin(rad),
      text,
    };
  }).filter(Boolean);
};

export function DurationPicker() {
  const { t } = useTranslation();
  const { speak } = useTTS();
  
  const [startAngle, setStartAngle] = useState(270);
  const [endAngle, setEndAngle] = useState(360);
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  
  const lastDragAngleRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const getMouseAngle = (evt: MouseEvent | TouchEvent) => {
    if (!svgRef.current) return 0;
    let clientX = 0;
    let clientY = 0;
    if ('touches' in evt && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else if ('clientX' in evt) {
      clientX = (evt as MouseEvent).clientX;
      clientY = (evt as MouseEvent).clientY;
    }
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = 400 / rect.width;
    const scaleY = 400 / rect.height;
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    return (Math.atan2(y - 200, x - 200) * 180) / Math.PI;
  };

  // --- 优化点 1：修复事件监听器的依赖问题 ---
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (evt: MouseEvent | TouchEvent) => {
      evt.preventDefault();
      const currentAngle = getMouseAngle(evt);
      let delta = currentAngle - lastDragAngleRef.current;

      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      // 使用函数式状态更新，避免依赖 startAngle 和 endAngle，不再导致频繁解绑/绑定
      if (isDragging === 'start') {
        setStartAngle(prev => {
          let newAngle = (prev + delta) % 360;
          return newAngle < 0 ? newAngle + 360 : newAngle;
        });
      } else {
        setEndAngle(prev => {
          let newAngle = (prev + delta) % 360;
          return newAngle < 0 ? newAngle + 360 : newAngle;
        });
      }
      lastDragAngleRef.current = currentAngle;
    };

    const handleEnd = () => setIsDragging(null);

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]); // 仅在 isDragging 状态变化时触发重新绑定

  const handleDragStart = (evt: React.MouseEvent | React.TouchEvent, handleType: 'start' | 'end') => {
    evt.preventDefault();
    setIsDragging(handleType);
    const mouseEvt = 'touches' in evt ? evt.touches[0] as any : evt as any;
    lastDragAngleRef.current = getMouseAngle(mouseEvt);
  };

  const getTimeInfo = () => {
    const s = Math.round(startAngle / 2.5) * 2.5;
    const e = Math.round(endAngle / 2.5) * 2.5;
    let diff = e - s;
    if (diff < 0) diff += 360;

    const diffHours = diff / 15;
    const h = Math.floor(diffHours);
    const m = Math.round((diffHours - h) * 60);
    
    if (m === 60) {
      return { hours: h + 1, minutes: 0, text: `${h + 1} h` };
    }
    const text = m > 0 ? `${h} h ${m} m` : `${h} h`;
    return { hours: h, minutes: m, text, diff, snappedStart: s, snappedEnd: e };
  };

  const getArcPath = () => {
    const info = getTimeInfo();
    const diff = info.diff || 0;
    const snappedStart = info.snappedStart || 0;
    
    let endDraw = snappedStart + diff;
    if (diff === 0) endDraw = snappedStart + 0.1;

    const r = 150;
    const startRad = (snappedStart * Math.PI) / 180;
    const endRad = (endDraw * Math.PI) / 180;

    const x1 = 200 + r * Math.cos(startRad);
    const y1 = 200 + r * Math.sin(startRad);
    const x2 = 200 + r * Math.cos(endRad);
    const y2 = 200 + r * Math.sin(endRad);

    const largeArcFlag = diff > 180 ? 1 : 0;

    return {
      path: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      startPos: { x: x1, y: y1 },
      endPos: { x: x2, y: y2 },
    };
  };

  const setDurationShortcut = (hours: number, isMinutes = false) => {
    if (isMinutes) {
      setStartAngle(90);
      setEndAngle(90 + 7.5);
    } else {
      setStartAngle(270);
      setEndAngle((270 + hours * 15) % 360);
    }
  };

  const playDuration = () => {
    const { hours, minutes } = getTimeInfo();
    const text = minutes > 0 ? `${hours}時間${minutes}分` : `${hours}時間`;
    speak(text);
  };

  const timeInfo = getTimeInfo();
  const arcData = getArcPath();

  // --- 优化点 2：使用 useMemo 缓存 144 根刻度线和 24 个标签，阻断无意义的 React Diff 重渲染 ---
  const staticBackground = useMemo(() => {
    const ticks = generateTicks();
    const labels = generateLabels();
    return (
      <g>
        <circle cx="200" cy="200" r="150" fill="none" stroke="#f0f0f0" strokeWidth="50" />
        <g>
          {ticks.map((tick, i) => (
            <line key={`tick-${i}`} x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} 
                  stroke="rgba(0, 0, 0, 0.15)" strokeWidth={tick.isMajor ? '2' : '1.5'} strokeLinecap="round" />
          ))}
        </g>
        <g>
          {labels.map((label: any, i) => (
            <text key={`label-${i}`} x={label.x} y={label.y} textAnchor="middle" 
                  dominantBaseline="central" fill="#888888" fontSize="16" fontWeight="500">
              {label.text}
            </text>
          ))}
        </g>
      </g>
    );
  }, []); // 依赖为空，只在组件初次挂载时渲染一次

  return (
    <div className={styles.container}>
      <div className={styles.shortcuts}>
        {DURATION_SHORTCUTS.map((shortcut) => (
          <button
            key={shortcut.label}
            className={styles.shortcutBtn}
            onClick={() => setDurationShortcut(shortcut.hours, shortcut.isMinutes)}
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      <div className={styles.clockContainer}>
        <svg ref={svgRef} className={styles.clockSvg} viewBox="0 0 400 400">
          <defs>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.2" />
            </filter>
          </defs>

          {/* 渲染缓存的静态底盘和刻度 */}
          {staticBackground}

          {/* 绿色选中弧线 (动态部分) */}
          <path d={arcData.path} fill="none" stroke="#a9e55b" strokeWidth="50" strokeLinecap="butt" />

          {/* 中心时长文本 (动态部分) */}
          <text x="200" y="215" textAnchor="middle" fontSize="44" fontWeight="500" fill="#222222">
            {timeInfo.text}
          </text>

          {/* 起始时间控制点 */}
          <g
            transform={`translate(${arcData.startPos.x}, ${arcData.startPos.y})`}
            className={styles.handle}
            onMouseDown={(e) => handleDragStart(e, 'start')}
            onTouchStart={(e) => handleDragStart(e, 'start')}
            filter="url(#shadow)"
          >
            <circle cx="0" cy="0" r="23" fill="#000000" />
            <g transform="translate(-12, -12) scale(1)">
              <path d="M13 3L4 14h7l-2 8 9-11h-7l2-8z" fill="#a9e55b" />
            </g>
          </g>

          {/* 结束时间控制点 */}
          <g
            transform={`translate(${arcData.endPos.x}, ${arcData.endPos.y})`}
            className={styles.handle}
            onMouseDown={(e) => handleDragStart(e, 'end')}
            onTouchStart={(e) => handleDragStart(e, 'end')}
            filter="url(#shadow)"
          >
            <circle cx="0" cy="0" r="23" fill="#000000" />
            <g transform="translate(-12, -12) scale(1)">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="#ffffff" />
              <line x1="3" y1="3" x2="21" y2="21" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </div>

      <div className={styles.timeDisplay}>
        <div className={styles.timeBlock}>
          <div className={styles.timeLabel}>じかんたい</div>
          <div className={styles.timeValue}>{timeInfo.text}</div>
        </div>
        <button className={styles.speakBtn} onClick={playDuration}>
          <Volume2 size={20} />
        </button>
      </div>

      <div className="notePill">
        <span className="noteIcon">💡</span>
        <span className="noteText">
          {t('clock_study.duration_hint') || '拖动圆圈上的控制点来选择时间段'}
        </span>
      </div>
    </div>
  );
}