import {
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
  useEffect,
} from 'react';
import styles from './Drum.module.css';

// ── 物理常数 ──────────────────────────────────────────────
const TWO_PI = Math.PI * 2;
const DAMP_HALF_LIFE = 220;
const MIN_VEL = 0.00006;
const SNAP_EASE = 0.25;
const SNAP_THRESH = 0.0008;
// 外部跳转动画最大偏移槽数
const MAX_JUMP_STEPS = 5;

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
export interface DrumProps {
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right';
  accentColor: string;
  accentBg?: string;           // 接受但不强制使用，保持与 Reel 接口一致
  physCount?: number;          // 圆等分物理槽数，默认 24
}

export function Drum({
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
  accentColor,
  physCount = 24,
}: DrumProps) {
  const step = TWO_PI / physCount;
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ R: 185, H: 370, W: 195 });
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

  // 区分内部 snap 还是外部跳转
  const isInternalRef = useRef(false);
  const prevSelectedRef = useRef(selected);

  // 用 ref 持有最新值，避免 tick 闭包过时
  const selectedRef = useRef(selected);
  const stepRef = useRef(step);
  const valueRangeRef = useRef(valueRange);
  useLayoutEffect(() => { selectedRef.current = selected; }, [selected]);
  useLayoutEffect(() => { stepRef.current = step; }, [step]);
  useLayoutEffect(() => { valueRangeRef.current = valueRange; }, [valueRange]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const measure = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      if (width > 0) setDims({ R: height / 2, H: height, W: width });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getPA = useCallback(
    (clientX: number, clientY: number) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const R = rect.height / 2;
      if (side === 'left') {
        const cx = rect.right - R;
        return Math.atan2(clientY - cy, clientX - cx);
      } else {
        const cx = rect.left + R;
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
          p.snapTarget = -Math.round(-p.angle / stepRef.current) * stepRef.current;
        }
      } else if (p.phase === 'snap') {
        const diff = p.snapTarget - p.angle;
        p.angle += diff * SNAP_EASE;
        if (Math.abs(diff) < SNAP_THRESH) {
          p.angle = p.snapTarget;
          p.phase = 'idle';
          p.animId = null;

          const rawSteps = Math.round(-p.snapTarget / stepRef.current);
          p.angle = 0;
          p.snapTarget = 0;
          setRenderAngle(0);

          // rawSteps === 0：外部跳转动画完成，不需要回调
          if (rawSteps !== 0) {
            const vr = valueRangeRef.current;
            const newValue = (((selectedRef.current + rawSteps) % vr) + vr) % vr;
            isInternalRef.current = true;
            onSelect(newValue);
          }
          return;
        }
      }

      setRenderAngle(p.angle);
      p.animId = requestAnimationFrame(tick);
    };

    p.animId = requestAnimationFrame(tick);
  }, [onSelect]);

  // ── 外部跳转动画（chip / Now 按钮触发）────────────────
  useEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    if (isInternalRef.current) {
      isInternalRef.current = false;
      return;
    }
    if (prev === selected) return;

    // 最短圆形路径 delta
    let delta = selected - prev;
    const vr = valueRangeRef.current;
    if (delta > vr / 2) delta -= vr;
    if (delta < -vr / 2) delta += vr;

    // 限制动画幅度，避免大跳
    const animSteps = Math.sign(delta) * Math.min(Math.abs(delta), MAX_JUMP_STEPS);

    const p = physRef.current;
    cancelAnim();
    p.angle = -animSteps * stepRef.current;
    p.phase = 'snap';
    p.snapTarget = 0;
    setRenderAngle(p.angle);
    startAnim();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ── Pointer handlers ─────────────────────────────────────
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

  // ── 渲染 ─────────────────────────────────────────────────
  const { R, H, W } = dims;
  const MARGIN = 8;
  const innerR = R - MARGIN;
  const cosThresh = (R - W) / innerR;
  const halfAngle = Math.acos(Math.max(-1, Math.min(1, cosThresh)));

  const intSteps = Math.round(-renderAngle / step);
  const centerPhysIdx = ((intSteps % physCount) + physCount) % physCount;

  const items: React.ReactNode[] = [];

  for (let phys = 0; phys < physCount; phys++) {
    let theta = phys * step + renderAngle;
    theta = theta - TWO_PI * Math.floor((theta + Math.PI) / TWO_PI);
    if (Math.abs(theta) > halfAngle) continue;

    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const opacity = Math.max(0, cosT);
    const x = side === 'left' ? W - R + innerR * cosT : R - innerR * cosT;
    const y = H / 2 + innerR * sinT;
    const fontSize = Math.round(15 + 23 * cosT * cosT);

    let offsetFromCenter = phys - centerPhysIdx;
    if (offsetFromCenter > physCount / 2) offsetFromCenter -= physCount;
    if (offsetFromCenter < -physCount / 2) offsetFromCenter += physCount;

    const slotValue =
      (((selected + intSteps + offsetFromCenter) % valueRange) + valueRange) % valueRange;
    const label = formatLabel(slotValue);
    const isCenter = phys === centerPhysIdx;
    items.push(
      <span
        key={phys}
        style={{
          position: 'absolute',
          left: `${x}px`,
          top: `${y}px`,
          transform: side === 'left' ? 'translate(-100%, -50%)' : 'translate(0, -50%)',
          opacity,
          fontSize: `${fontSize}px`,
          fontWeight: isCenter ? 700 : 400,
          color: isCenter ? accentColor : 'var(--color-Gray6, #6b7280)',
          fontVariantNumeric: 'tabular-nums',
          fontFamily: 'Inter, -apple-system, sans-serif',
          letterSpacing: isCenter ? '-0.025em' : '-0.01em',
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
