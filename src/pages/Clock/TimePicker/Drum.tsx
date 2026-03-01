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

export interface DrumProps {
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right';
  accentColor: string;
  accentBg?: string;
  physCount?: number;
  onDoubleTap?: () => void;
}

export function Drum({
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
  accentColor,
  physCount = 24,
  onDoubleTap,
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

  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null
  );
  const isInternalRef = useRef(false);
  const prevSelectedRef = useRef(selected);

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

          const rawSteps = Math.round(-p.snapTarget / stepRef.current);
          p.angle = 0;
          p.snapTarget = 0;
          setRenderAngle(0);

          if (rawSteps !== 0) {
            const vr = valueRangeRef.current;
            const newValue =
              (((selectedRef.current + rawSteps) % vr) + vr) % vr;
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

  useEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    if (isInternalRef.current) {
      isInternalRef.current = false;
      return;
    }
    if (prev === selected) return;

    let delta = selected - prev;
    const vr = valueRangeRef.current;
    if (delta > vr / 2) delta -= vr;
    if (delta < -vr / 2) delta += vr;

    const animSteps =
      Math.sign(delta) * Math.min(Math.abs(delta), MAX_JUMP_STEPS);

    const p = physRef.current;
    cancelAnim();
    p.angle = -animSteps * stepRef.current;
    p.phase = 'snap';
    p.snapTarget = 0;
    setRenderAngle(p.angle);
    startAnim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const now = performance.now();
      const { clientX, clientY } = e;

      if (lastTapRef.current) {
        const dt = now - lastTapRef.current.time;
        const dx = Math.abs(clientX - lastTapRef.current.x);
        const dy = Math.abs(clientY - lastTapRef.current.y);
        if (dt < 350 && dx < 25 && dy < 25) {
          lastTapRef.current = null;
          onDoubleTap?.();
          return;
        }
      }
      lastTapRef.current = { time: now, x: clientX, y: clientY };

      cancelAnim();
      const pa = getPA(clientX, clientY);
      const p = physRef.current;
      p.phase = 'drag';
      p.dragLastPointerAngle = pa;
      p.history = [{ pa, t: now }];
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [cancelAnim, getPA, onDoubleTap]
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
  // 建立两级轨道半径：文字偏外缘（数字轨道），刻度偏内侧（刻度轨道）
  const numR = R - 20;
  const tickR = R - 45;

  const safeR = R - 10;
  const cosThresh = safeR <= 0 ? 0 : (R - W) / safeR;
  const halfAngle = Math.acos(Math.max(-1, Math.min(1, cosThresh)));

  const intSteps = Math.round(-renderAngle / step);
  const centerPhysIdx = ((intSteps % physCount) + physCount) % physCount;

  const items: React.ReactNode[] = [];
  const SUB_TICKS = 5; // 两大刻度之间的分片数

  for (let phys = 0; phys < physCount; phys++) {
    // 1. 绘制刻度
    for (let j = 0; j < SUB_TICKS; j++) {
      let tickTheta = (phys + j / SUB_TICKS) * step + renderAngle;
      tickTheta =
        tickTheta - TWO_PI * Math.floor((tickTheta + Math.PI) / TWO_PI);
      if (Math.abs(tickTheta) > halfAngle) continue;

      const isLarge = j === 0;
      const cosT = Math.cos(tickTheta);
      const sinT = Math.sin(tickTheta);

      // 左表盘圆心在靠右 W-R 处，右表盘圆心在靠左 R 处
      const tx = side === 'left' ? W - R + tickR * cosT : R - tickR * cosT;
      const ty = H / 2 + tickR * sinT;

      const tickWidth = isLarge ? 14 : 8;
      const tickHeight = isLarge ? 2 : 1;
      const bgColor = isLarge ? '#a4a9af' : '#c9ccd0';
      // 刻度指向圆心
      const rotRad = side === 'left' ? tickTheta : Math.PI - tickTheta;

      items.push(
        <div
          key={`tick-${phys}-${j}`}
          style={{
            position: 'absolute',
            left: `${tx}px`,
            top: `${ty}px`,
            width: `${tickWidth}px`,
            height: `${tickHeight}px`,
            backgroundColor: bgColor,
            borderRadius: '1px',
            transform: `translate(-50%, -50%) rotate(${rotRad}rad)`,
            pointerEvents: 'none',
          }}
        />
      );
    }

    // 2. 绘制数字
    let theta = phys * step + renderAngle;
    theta = theta - TWO_PI * Math.floor((theta + Math.PI) / TWO_PI);
    if (Math.abs(theta) > halfAngle) continue;

    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const nx = side === 'left' ? W - R + numR * cosT : R - numR * cosT;
    const ny = H / 2 + numR * sinT;

    let offsetFromCenter = phys - centerPhysIdx;
    if (offsetFromCenter > physCount / 2) offsetFromCenter -= physCount;
    if (offsetFromCenter < -physCount / 2) offsetFromCenter += physCount;

    const slotValue =
      (((selected + intSteps + offsetFromCenter) % valueRange) + valueRange) %
      valueRange;
    const label = formatLabel(slotValue);
    const isCenter = phys === centerPhysIdx;

    const fontSize = 24; // 统一大小，远近只靠 opacity 渐隐
    const fontWeight = isCenter ? 600 : 400;
    const color = isCenter ? accentColor : '#959fa6';
    // 左表盘辐射角度，右表盘负辐射角度（保证文字不颠倒）
    const textRot = side === 'left' ? theta : -theta;

    items.push(
      <span
        key={`num-${phys}`}
        style={{
          position: 'absolute',
          left: `${nx}px`,
          top: `${ny}px`,
          transform: `translate(-50%, -50%) rotate(${textRot}rad)`,
          fontSize: `${fontSize}px`,
          fontWeight,
          color,
          fontVariantNumeric: 'tabular-nums',
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transition: 'font-size 0.2s, font-weight 0.2s, color 0.2s',
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
      {/* 底部内凹表盘阴影 */}
      <div
        className={styles.plateBg}
        style={{
          width: `${R * 2}px`,
          height: `${R * 2}px`,
          left: side === 'left' ? `${W - R * 2}px` : `0px`,
          top: `${H / 2 - R}px`,
        }}
      />
      {/* 居中激活指示线 */}
      <div
        className={`${styles.centerLine} ${styles[side]}`}
        style={{ backgroundColor: accentColor }}
      />
      {items}
    </div>
  );
}
