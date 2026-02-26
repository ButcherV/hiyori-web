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
export interface DrumProps {
  physCount: number;
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right';
}

export function Drum({
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

    const measure = () => {
      const { width, height } = containerRef.current!.getBoundingClientRect();
      // 圆半径 = 高度的一半；两圆圆心各在屏幕横向中心两侧 R 处
      if (width > 0) setDims({ R: height / 2, H: height, W: width });
    };

    measure(); // 首次测量

    // 父容器高度随 is24h 切换而变（TimeDisplay 内 ampm 行出现/消失），
    // 用 ResizeObserver 确保 dims 始终与实际像素一致
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
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
      // 左鼓：圆心在容器右边缘往左 R 处（屏幕横向中心）
      // 右鼓：圆心在容器左边缘往右 R 处（屏幕横向中心）
      // 两种情况下 dx 均为正值，atan2 输出在 (-π/2, π/2) 附近
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
    const fontSize = Math.round(15 + 23 * cosT * cosT);

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
            ? 'var(--color-primary, #111827)'
            : 'var(--color-Gray6, #6b7280)',
          fontVariantNumeric: 'tabular-nums',
          fontFamily:
            '-apple-system, "SF Pro Display", "Helvetica Neue", sans-serif',
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

  // 左鼓：圆心在 (W-R, H/2)，可能为负（圆心在屏幕外左侧）
  // 右鼓：圆心在 (R, H/2)，可能超出容器右边界（圆心在屏幕外右侧）
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
