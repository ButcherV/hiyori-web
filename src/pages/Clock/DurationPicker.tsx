import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../hooks/useTTS';
import styles from './DurationPicker.module.css';

// 时间段词汇（按一天时序排列）
const TIME_PERIODS = [
  { name: '深夜', kana: 'しんや', start: 0, end: 4, description: '书面语，天气预报、新闻常用' },
  { name: '未明', kana: 'みめい', start: 2, end: 5, description: '比深夜更书面，黎明前最暗的时段' },
  { name: '夜明け', kana: 'よあけ', start: 4, end: 6, description: '「夜が明ける」的名词形，天开始亮' },
  { name: '早朝', kana: 'そうちょう', start: 5, end: 7, description: '比「朝」更早，正式语感' },
  { name: '朝', kana: 'あさ', start: 6, end: 10, description: '最日常的早晨表达' },
  { name: '午前', kana: 'ごぜん', start: 0, end: 12, description: '注意：范围含深夜，不只是早上' },
  { name: '昼', kana: 'ひる', start: 10, end: 14, description: '也指「午饭时间」' },
  { name: '正午', kana: 'しょうご', start: 12, end: 12, description: '精确的正午，不是泛指中午' },
  { name: '午後', kana: 'ごご', start: 12, end: 18, description: '' },
  { name: '夕方', kana: 'ゆうがた', start: 16, end: 19, description: '专指黄昏傍晚，≠ 下午' },
  { name: '夜', kana: 'よる', start: 19, end: 24, description: '' },
  { name: '真夜中', kana: 'まよなか', start: 0, end: 0, description: '口语"半夜"，比深夜更有情感色彩' },
];

// --- 静态数据生成函数移到组件外部，避免每次渲染重复定义 ---
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
  const [selectedPeriod, setSelectedPeriod] = useState<typeof TIME_PERIODS[0] | null>(null);
  
  const lastDragAngleRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  // 获取鼠标/触摸位置相对于圆心的角度
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

  // 处理拖拽逻辑
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (evt: MouseEvent | TouchEvent) => {
      evt.preventDefault();
      const currentAngle = getMouseAngle(evt);
      let delta = currentAngle - lastDragAngleRef.current;

      // 处理从 180 度到 -180 度的跃迁
      if (delta > 180) delta -= 360;
      if (delta < -180) delta += 360;

      // 使用函数式状态更新，避免频繁解绑/绑定事件
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
  }, [isDragging]);

  const handleDragStart = (evt: React.MouseEvent | React.TouchEvent, handleType: 'start' | 'end') => {
    evt.preventDefault();
    setIsDragging(handleType);
    const mouseEvt = 'touches' in evt ? evt.touches[0] as any : evt as any;
    lastDragAngleRef.current = getMouseAngle(mouseEvt);
  };

  // 计算时间差和格式化文本
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

  // 计算弧线路径
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

  const setTimePeriod = (period: typeof TIME_PERIODS[0]) => {
    // 将小时转换为角度 (270度 = 0时, 每小时15度)
    const startAngle = (270 + period.start * 15) % 360;
    let endAngle = (270 + period.end * 15) % 360;
    
    // 处理跨越午夜的情况
    if (period.end === 0) {
      endAngle = 270; // 0时 = 270度
    }
    
    setStartAngle(startAngle);
    setEndAngle(endAngle);
    setSelectedPeriod(period);
  };

  const playPeriodName = () => {
    if (selectedPeriod) {
      speak(selectedPeriod.name);
    }
  };

  const timeInfo = getTimeInfo();
  const arcData = getArcPath();

  // --- 仅缓存刻度线和标签（作为覆盖层），不再包含底层灰色圆环 ---
  const staticOverlay = useMemo(() => {
    const ticks = generateTicks();
    const labels = generateLabels();
    return (
      <g>
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
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.timePeriods}>
        {TIME_PERIODS.map((period) => (
          <button
            key={period.name}
            className={`${styles.periodChip} ${selectedPeriod?.name === period.name ? styles.periodChipActive : ''}`}
            onClick={() => setTimePeriod(period)}
            title={period.description}
          >
            {period.name}
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

          {/* 1. 基础灰色底盘 (最底层) */}
          <circle cx="200" cy="200" r="150" fill="none" stroke="#f0f0f0" strokeWidth="50" />

          {/* 2. 绿色选中弧线 (中间层，盖在灰色底盘上) */}
          <path d={arcData.path} fill="none" stroke="#a9e55b" strokeWidth="50" strokeLinecap="butt" />

          {/* 3. 刻度和标签层 (静态覆盖层，渲染在绿色弧线之上) */}
          {staticOverlay}

          {/* 4. 中心内容 - 仅在未选中时显示时长文本 */}
          {!selectedPeriod && (
            <text x="200" y="215" textAnchor="middle" fontSize="44" fontWeight="500" fill="#222222">
              {timeInfo.text}
            </text>
          )}

          {/* 5. 起始时间控制点 */}
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

          {/* 6. 结束时间控制点 */}
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

        {/* HTML 覆盖层 - 显示时间段详细信息 */}
        {selectedPeriod && (
          <div className={styles.centerOverlay}>
            <div className={styles.periodKana}>{selectedPeriod.kana}</div>
            <div className={styles.periodKanji}>{selectedPeriod.name}</div>
            <button className={styles.speakerBtn} onClick={playPeriodName}>
              <Volume2 size={20} />
            </button>
            <div className={styles.periodTime}>
              {selectedPeriod.start === selectedPeriod.end 
                ? `${selectedPeriod.start}:00` 
                : `${selectedPeriod.start}:00 - ${selectedPeriod.end}:00`}
            </div>
          </div>
        )}
      </div>

      <div className={styles.timeDisplay}>
        {selectedPeriod ? (
          <>
            <div className={styles.timeBlock}>
              <div className={styles.timeLabel}>意思</div>
              <div className={styles.timeValue}>{selectedPeriod.description || '—'}</div>
            </div>
            <button className={styles.speakBtn} onClick={playPeriodName}>
              <Volume2 size={20} />
            </button>
          </>
        ) : (
          <>
            <div className={styles.timeBlock}>
              <div className={styles.timeLabel}>じかんたい</div>
              <div className={styles.timeValue}>{timeInfo.text}</div>
            </div>
          </>
        )}
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