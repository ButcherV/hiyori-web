import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import styles from './TimeDrumPicker.module.css';

// ── 物理常数 ──────────────────────────────────────────────
const TWO_PI = Math.PI * 2;
const DAMP_HALF_LIFE = 220;
const MIN_VEL = 0.00006;
const SNAP_EASE = 0.25;
const SNAP_THRESH = 0.0008;

// ── 日语读音 ──────────────────────────────────────────────
const HOUR_READINGS: Record<number, string> = {
  1: 'いちじ',
  2: 'にじ',
  3: 'さんじ',
  4: 'よじ',
  5: 'ごじ',
  6: 'ろくじ',
  7: 'しちじ',
  8: 'はちじ',
  9: 'くじ',
  10: 'じゅうじ',
  11: 'じゅういちじ',
  12: 'じゅうにじ',
};

function getMinuteReading(m: number): string {
  const map: Record<number, string> = {
    0: 'ちょうど',
    1: 'いっぷん',
    2: 'にふん',
    3: 'さんぷん',
    4: 'よんぷん',
    5: 'ごふん',
    6: 'ろっぷん',
    7: 'ななふん',
    8: 'はっぷん',
    9: 'きゅうふん',
    10: 'じゅっぷん',
    11: 'じゅういっぷん',
    12: 'じゅうにふん',
    13: 'じゅうさんぷん',
    14: 'じゅうよんぷん',
    15: 'じゅうごふん',
    16: 'じゅうろっぷん',
    17: 'じゅうななふん',
    18: 'じゅうはっぷん',
    19: 'じゅうきゅうふん',
    20: 'にじゅっぷん',
    21: 'にじゅういっぷん',
    22: 'にじゅうにふん',
    23: 'にじゅうさんぷん',
    24: 'にじゅうよんぷん',
    25: 'にじゅうごふん',
    26: 'にじゅうろっぷん',
    27: 'にじゅうななふん',
    28: 'にじゅうはっぷん',
    29: 'にじゅうきゅうふん',
    30: 'はん',
    31: 'さんじゅういっぷん',
    32: 'さんじゅうにふん',
    33: 'さんじゅうさんぷん',
    34: 'さんじゅうよんぷん',
    35: 'さんじゅうごふん',
    36: 'さんじゅうろっぷん',
    37: 'さんじゅうななふん',
    38: 'さんじゅうはっぷん',
    39: 'さんじゅうきゅうふん',
    40: 'よんじゅっぷん',
    41: 'よんじゅういっぷん',
    42: 'よんじゅうにふん',
    43: 'よんじゅうさんぷん',
    44: 'よんじゅうよんぷん',
    45: 'よんじゅうごふん',
    46: 'よんじゅうろっぷん',
    47: 'よんじゅうななふん',
    48: 'よんじゅうはっぷん',
    49: 'よんじゅうきゅうふん',
    50: 'ごじゅっぷん',
    51: 'ごじゅういっぷん',
    52: 'ごじゅうにふん',
    53: 'ごじゅうさんぷん',
    54: 'ごじゅうよんぷん',
    55: 'ごじゅうごふん',
    56: 'ごじゅうろっぷん',
    57: 'ごじゅうななふん',
    58: 'ごじゅうはっぷん',
    59: 'ごじゅうきゅうふん',
  };
  return map[m] ?? `${m}ふん`;
}

function getTimePeriod(h: number) {
  if (h === 0) return { kanji: '真夜中', kana: 'まよなか' };
  if (h < 4) return { kanji: '深夜', kana: 'しんや' };
  if (h < 6) return { kanji: '早朝', kana: 'そうちょう' };
  if (h < 10) return { kanji: '朝', kana: 'あさ' };
  if (h < 14) return { kanji: '昼', kana: 'ひる' };
  if (h < 17) return { kanji: '午後', kana: 'ごご' };
  if (h < 19) return { kanji: '夕方', kana: 'ゆうがた' };
  if (h < 23) return { kanji: '夜', kana: 'よる' };
  return { kanji: '深夜', kana: 'しんや' };
}

function buildDisplay(hour: number, minute: number, is24h: boolean) {
  if (hour === 0 && minute === 0)
    return { main: '真夜中', kana: 'まよなか', note: '零時（れいじ）ちょうど' };
  if (hour === 12 && minute === 0)
    return { main: '正午', kana: 'しょうご', note: null };

  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const isAM = hour < 12;
  const ampm = isAM ? '午前' : '午後';
  const ampmKana = isAM ? 'ごぜん' : 'ごご';
  const hourKana = HOUR_READINGS[h12] ?? `${h12}じ`;
  const minKana = getMinuteReading(minute);
  const minKanji =
    minute === 0 ? 'ちょうど' : minute === 30 ? '半' : `${minute}分`;
  const period = getTimePeriod(hour);

  if (is24h) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    return {
      main: `${hh}:${mm}`,
      kana: `${hourKana}${minKana}`,
      note: `${ampm}${h12}時${minKanji}`,
    };
  }

  return {
    main: `${ampm} ${h12}時${minKanji}`,
    kana: `${ampmKana} ${hourKana}${minKana}`,
    note:
      period.kanji !== '午後' && period.kanji !== '午前' ? period.kanji : null,
  };
}

// ── 物理状态 ──────────────────────────────────────────────
interface Phys {
  angle: number;
  velocity: number;
  phase: 'idle' | 'drag' | 'inertia' | 'snap';
  snapTarget: number;
  lastTime: number;
  animId: number | null;
  dragLastPointerAngle: number;
  history: Array<{ pa: number; t: number }>;
}

// ── Drum 组件 ─────────────────────────────────────────────
// physCount: 圆等分的物理槽数（决定视觉密度）
// valueRange: 实际取值范围（标签从 selected 出发动态计算）
// renderAngle=0 始终对应 selected 在中心，吸附后重置为 0
interface DrumProps {
  physCount: number;
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right';
}

function Drum({
  physCount,
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
}: DrumProps) {
  const step = TWO_PI / physCount;
  const containerRef = useRef<HTMLDivElement>(null);
  // R = 圆半径 = 容器高度的一半；W = 容器宽度（约 50vw）
  const [dims, setDims] = useState({ R: 185, H: 370, W: 195 });
  // angle=0 → selected 在中心；吸附后重置为 0
  const [renderAngle, setRenderAngle] = useState(0);

  const physRef = useRef<Phys>({
    angle: 0,
    velocity: 0,
    phase: 'idle',
    snapTarget: 0,
    lastTime: 0,
    animId: null,
    dragLastPointerAngle: 0,
    history: [],
  });

  // 用 ref 持有最新值，避免 tick 闭包过时
  const selectedRef = useRef(selected);
  const stepRef = useRef(step);
  const valueRangeRef = useRef(valueRange);
  useLayoutEffect(() => {
    selectedRef.current = selected;
  }, [selected]);
  useLayoutEffect(() => {
    stepRef.current = step;
  }, [step]);
  useLayoutEffect(() => {
    valueRangeRef.current = valueRange;
  }, [valueRange]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    // 圆半径 = 高度的一半；两圆圆心各在屏幕横向中心两侧 R 处
    if (width > 0) setDims({ R: height / 2, H: height, W: width });
  }, []);

  // 外部改变 selected 时（切换 12h/24h），重置角度
  useEffect(() => {
    const p = physRef.current;
    if (p.phase === 'idle') {
      p.angle = 0;
      p.snapTarget = 0;
      setRenderAngle(0);
    }
  }, [selected]);

  const getPA = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const R = rect.height / 2;
      // 左鼓：圆心在容器右边缘往左 R 处（= 屏幕横向中心，在容器外侧左边）
      // 右鼓：圆心在容器左边缘往右 R 处（= 屏幕横向中心，在容器外侧右边）
      // 两种情况下 dx 均为正值，atan2 输出在 (-π/2, π/2) 附近
      if (side === 'left') {
        const cx = rect.right - R; // 圆心 x（可能在屏幕左侧外）
        return Math.atan2(clientY - cy, clientX - cx);
      } else {
        const cx = rect.left + R; // 圆心 x（可能在屏幕右侧外）
        return Math.atan2(clientY - cy, cx - clientX);
      }
    },
    [side]
  );

  const cancelAnim = useCallback(() => {
    const p = physRef.current;
    if (p.animId !== null) {
      cancelAnimationFrame(p.animId);
      p.animId = null;
    }
  }, []);

  const nearestSnap = useCallback(
    (angle: number) => -Math.round(-angle / step) * step,
    [step]
  );

  const startAnim = useCallback(() => {
    const p = physRef.current;
    p.lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - p.lastTime, 50);
      p.lastTime = now;

      if (p.phase === 'inertia') {
        p.angle += p.velocity * dt;
        p.velocity *= Math.pow(0.5, dt / DAMP_HALF_LIFE);
        if (Math.abs(p.velocity) < MIN_VEL) {
          p.phase = 'snap';
          p.snapTarget =
            -Math.round(-p.angle / stepRef.current) * stepRef.current;
        }
      } else if (p.phase === 'snap') {
        const diff = p.snapTarget - p.angle;
        p.angle += diff * SNAP_EASE;
        if (Math.abs(diff) < SNAP_THRESH) {
          p.angle = p.snapTarget;
          p.phase = 'idle';
          p.animId = null;
          // 从原点出发转了多少物理步 → 计算新值
          const rawSteps = Math.round(-p.snapTarget / stepRef.current);
          const vr = valueRangeRef.current;
          const newValue = (((selectedRef.current + rawSteps) % vr) + vr) % vr;
          // 吸附完成后重置角度，下次交互从 0 开始
          p.angle = 0;
          p.snapTarget = 0;
          setRenderAngle(0);
          onSelect(newValue);
          return;
        }
      }

      setRenderAngle(p.angle);
      p.animId = requestAnimationFrame(tick);
    };

    p.animId = requestAnimationFrame(tick);
  }, [onSelect]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      cancelAnim();
      const pa = getPA(e.clientX, e.clientY);
      const p = physRef.current;
      p.phase = 'drag';
      p.dragLastPointerAngle = pa;
      p.history = [{ pa, t: performance.now() }];
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [cancelAnim, getPA]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const p = physRef.current;
      if (p.phase !== 'drag') return;
      const now = performance.now();
      const pa = getPA(e.clientX, e.clientY);
      let delta = pa - p.dragLastPointerAngle;
      if (delta > Math.PI) delta -= TWO_PI;
      if (delta < -Math.PI) delta += TWO_PI;
      p.angle += delta;
      p.dragLastPointerAngle = pa;
      p.history = [...p.history.filter((h) => now - h.t < 130), { pa, t: now }];
      setRenderAngle(p.angle);
    },
    [getPA]
  );

  const onPointerUp = useCallback(() => {
    const p = physRef.current;
    if (p.phase !== 'drag') return;
    let velocity = 0;
    if (p.history.length >= 2) {
      const old = p.history[0];
      const neo = p.history[p.history.length - 1];
      const dt = neo.t - old.t;
      if (dt > 5) {
        let da = neo.pa - old.pa;
        if (da > Math.PI) da -= TWO_PI;
        if (da < -Math.PI) da += TWO_PI;
        velocity = da / dt;
      }
    }
    if (Math.abs(velocity) > MIN_VEL * 8) {
      p.phase = 'inertia';
      p.velocity = velocity;
    } else {
      p.phase = 'snap';
      p.velocity = 0;
      p.snapTarget = nearestSnap(p.angle);
    }
    p.history = [];
    startAnim();
  }, [nearestSnap, startAnim]);

  // ── 渲染：每帧动态计算各槽标签 ────────────────────────
  const { R, H, W } = dims;

  // 径向内缩：文字放在半径 (R - MARGIN) 的内圆上，到弧面距离恒为 MARGIN
  const MARGIN = 8;
  const innerR = R - MARGIN;
  // 可见半角：cosθ ≥ (R-W)/innerR 的槽才在容器范围内
  const cosThresh = (R - W) / innerR;
  const halfAngle = Math.acos(Math.max(-1, Math.min(1, cosThresh)));

  const items: React.ReactNode[] = [];

  // 当前转了多少整步（保持浮点方向，用于 label 计算）
  const intSteps = Math.round(-renderAngle / step);
  // 哪个物理槽在中心
  const centerPhysIdx = ((intSteps % physCount) + physCount) % physCount;

  for (let phys = 0; phys < physCount; phys++) {
    let theta = phys * step + renderAngle;
    // 归一化到 (-π, π]
    theta = theta - TWO_PI * Math.floor((theta + Math.PI) / TWO_PI);
    if (Math.abs(theta) > halfAngle) continue;

    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const opacity = Math.max(0, cosT);
    // 左鼓：圆心在 (W-R, H/2)，弧面在右侧，x = (W-R) + innerR*cosT
    // 右鼓：圆心在 (R,   H/2)，弧面在左侧，x = R - innerR*cosT
    const x = side === 'left' ? W - R + innerR * cosT : R - innerR * cosT;
    const y = H / 2 + innerR * sinT;
    const fontSize = 13 + 20 * opacity * opacity;

    // 该槽距中心的偏移步数（归一化到 ±physCount/2）
    let offsetFromCenter = phys - centerPhysIdx;
    if (offsetFromCenter > physCount / 2) offsetFromCenter -= physCount;
    if (offsetFromCenter < -physCount / 2) offsetFromCenter += physCount;

    // 该槽显示的值 = (selected + 总步数 + 偏移) mod valueRange
    const slotValue =
      (((selected + intSteps + offsetFromCenter) % valueRange) + valueRange) %
      valueRange;
    const label = formatLabel(slotValue);
    const isCenter = phys === centerPhysIdx;

    items.push(
      <span
        key={phys}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          transform:
            side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
          opacity,
          fontSize: `${fontSize}px`,
          fontWeight: isCenter ? 700 : 400,
          color: isCenter
            ? 'var(--color-primary, #1a1a1a)'
            : 'var(--color-Gray7, #5a6779)',
          fontVariantNumeric: 'tabular-nums',
          fontFamily:
            '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
          letterSpacing: '-0.01em',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    );
  }

  // 左鼓：圆心在容器坐标 (W-R, H/2)，即右边缘往左 R px，可能为负（圆心在屏幕外）
  // 右鼓：圆心在容器坐标 (R, H/2)，即左边缘往右 R px，可能超出容器右边界
  const clipPath =
    side === 'left'
      ? `circle(${R}px at ${W - R}px 50%)`
      : `circle(${R}px at ${R}px 50%)`;

  return (
    <div
      ref={containerRef}
      className={`${styles.drum} ${styles[side]}`}
      style={{ clipPath }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {items}
    </div>
  );
}

// ── TimeDrumPicker 组件（纯鼓轮功能） ────────────────────
export function TimeDrumPicker() {
  const headerRef = useRef<HTMLDivElement>(null);
  const drumsContainerRef = useRef<HTMLDivElement>(null);

  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);
  const [is24h, setIs24h] = useState(false);

  // 测量 header 真实高度，注入 CSS 变量供鼓高度计算使用
  useLayoutEffect(() => {
    if (!headerRef.current || !drumsContainerRef.current) return;
    const h = headerRef.current.getBoundingClientRect().height;
    drumsContainerRef.current.style.setProperty('--sys-header-h', `${h}px`);
  }, []);

  const hourIdx12 = hour % 12;

  const setHourFrom12 = useCallback(
    (idx: number) => {
      const h12 = idx === 0 ? 12 : idx;
      const wasAM = hour < 12;
      setHour(wasAM ? (h12 === 12 ? 0 : h12) : h12 === 12 ? 12 : h12 + 12);
    },
    [hour]
  );

  const display = buildDisplay(hour, minute, is24h);

  const fmtPad2 = useCallback((v: number) => String(v).padStart(2, '0'), []);
  const fmt12h = useCallback(
    (v: number) => (v === 0 ? '12' : String(v).padStart(2, '0')),
    []
  );

  return (
    <>
      <div ref={headerRef} className={styles.toggle}>
        <button
          className={`${styles.toggleBtn} ${!is24h ? styles.active : ''}`}
          onClick={() => setIs24h(false)}
        >
          12h
        </button>
        <button
          className={`${styles.toggleBtn} ${is24h ? styles.active : ''}`}
          onClick={() => setIs24h(true)}
        >
          24h
        </button>
      </div>

      <div ref={drumsContainerRef} className={styles.drums}>
        {is24h ? (
          <Drum
            key="h24"
            physCount={24}
            valueRange={24}
            selected={hour}
            formatLabel={fmtPad2}
            onSelect={setHour}
            side="left"
          />
        ) : (
          <Drum
            key="h12"
            physCount={12}
            valueRange={12}
            selected={hourIdx12}
            formatLabel={fmt12h}
            onSelect={setHourFrom12}
            side="left"
          />
        )}
        {/* 分钟盘：圆等分 24 份，标签覆盖 0-59，一圈 = 24 分钟 */}
        <Drum
          physCount={24}
          valueRange={60}
          selected={minute}
          formatLabel={fmtPad2}
          onSelect={setMinute}
          side="right"
        />
      </div>

      {!is24h && (
        <div className={styles.ampm}>
          <span className={styles.ampmKanji}>
            {hour < 12 ? '午前' : '午後'}
          </span>
          <span className={styles.ampmKana}>
            {hour < 12 ? 'ごぜん' : 'ごご'}
          </span>
        </div>
      )}

      <div className={styles.display} key={`${hour}-${minute}-${is24h}`}>
        <div className={styles.mainText}>{display.main}</div>
        <div className={styles.kanaText}>{display.kana}</div>
        {display.note && <div className={styles.noteText}>{display.note}</div>}
      </div>
    </>
  );
}
