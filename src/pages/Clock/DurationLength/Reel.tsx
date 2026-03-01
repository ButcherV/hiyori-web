import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Reel.module.css';

// 根据屏幕高度动态调整
const getReelConfig = () => {
  const height = window.innerHeight;
  if (height <= 700) {
    // 小屏幕 (iPhone SE 等)
    return {
      CELL_HEIGHT: 44,
      VISIBLE_AROUND: 5,
      ITEM_STYLES: [
        { fontSize: 48, fontWeight: 700, opacity: 1,    color: 'inherit' },      // 中心：大
        { fontSize: 34, fontWeight: 600, opacity: 0.75, color: '#71717A' },      // ±1
        { fontSize: 26, fontWeight: 500, opacity: 0.55, color: '#A1A1AA' },      // ±2
        { fontSize: 20, fontWeight: 400, opacity: 0.4,  color: '#A1A1AA' },      // ±3
        { fontSize: 16, fontWeight: 400, opacity: 0.28, color: '#D4D4D8' },      // ±4
        { fontSize: 14, fontWeight: 400, opacity: 0.18, color: '#E4E4E7' },      // ±5
      ],
    };
  }
  // 正常屏幕
  return {
    CELL_HEIGHT: 52,
    VISIBLE_AROUND: 8,
    ITEM_STYLES: [
      { fontSize: 56, fontWeight: 700, opacity: 1,    color: 'inherit' },      // 中心：超大
      { fontSize: 40, fontWeight: 600, opacity: 0.75, color: '#71717A' },      // ±1：明显小
      { fontSize: 30, fontWeight: 500, opacity: 0.55, color: '#A1A1AA' },      // ±2：更小
      { fontSize: 24, fontWeight: 400, opacity: 0.4,  color: '#A1A1AA' },      // ±3
      { fontSize: 20, fontWeight: 400, opacity: 0.28, color: '#D4D4D8' },      // ±4
      { fontSize: 18, fontWeight: 400, opacity: 0.2,  color: '#D4D4D8' },      // ±5
      { fontSize: 16, fontWeight: 400, opacity: 0.14, color: '#E4E4E7' },      // ±6
      { fontSize: 14, fontWeight: 400, opacity: 0.1,  color: '#E4E4E7' },      // ±7
      { fontSize: 12, fontWeight: 400, opacity: 0.06, color: '#F4F4F5' },      // ±8
    ],
  };
};

const SNAP_MS = 250;
const MOMENTUM_FACTOR = 0.3;
const MAX_MOMENTUM_INDICES = 3;

export interface ReelProps {
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right' | 'center';
  accentColor: string;
  accentBg: string;
  onDoubleTap?: () => void;    // 双击回调
}

export function Reel({
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
  accentColor,
  accentBg,
  onDoubleTap,
}: ReelProps) {
  // 获取屏幕配置
  const config = getReelConfig();
  const { CELL_HEIGHT, VISIBLE_AROUND, ITEM_STYLES } = config;
  
  const [offset, setOffset] = useState(0);

  const dragRef = useRef<{
    startY: number;
    startOffset: number;
    lastY: number;
    lastT: number;
    velocity: number;
  } | null>(null);
  const animRef = useRef<number | null>(null);

  // 双击检测
  const lastTapRef = useRef<{ time: number; y: number } | null>(null);

  // true when the current selected change was triggered by THIS component's snap
  const isInternalRef = useRef(false);
  // track previous selected to compute delta for external jumps
  const prevSelectedRef = useRef(selected);

  const cancelAnim = useCallback(() => {
    if (animRef.current !== null) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
  }, []);

  const wrap = useCallback(
    (v: number) => ((Math.round(v) % valueRange) + valueRange) % valueRange,
    [valueRange]
  );

  // Animate offset from startOffset → 0, then settle
  const animateToZero = useCallback(
    (startOffset: number, duration = SNAP_MS, onDone?: () => void) => {
      cancelAnim();
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / duration);
        const eased = 1 - (1 - t) ** 3;
        setOffset(startOffset * (1 - eased));
        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          setOffset(0);
          onDone?.();
        }
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [cancelAnim]
  );

  // ── Snap after drag release ────────────────────────────────
  const snapTo = useCallback(
    (fromOffset: number, velocityPxPerMs = 0) => {
      const momentumIndices = (-velocityPxPerMs * 150 * MOMENTUM_FACTOR) / CELL_HEIGHT;
      const clamped = Math.max(-MAX_MOMENTUM_INDICES, Math.min(MAX_MOMENTUM_INDICES, momentumIndices));
      const targetIndex = Math.round(fromOffset + clamped);
      const startOffset = fromOffset;
      const startTime = performance.now();

      cancelAnim();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / SNAP_MS);
        const eased = 1 - (1 - t) ** 3;
        setOffset(startOffset + (targetIndex - startOffset) * eased);
        if (t < 1) {
          animRef.current = requestAnimationFrame(tick);
        } else {
          animRef.current = null;
          setOffset(0);
          // mark as internal BEFORE calling onSelect so the effect knows
          isInternalRef.current = true;
          onSelect(wrap(selected + targetIndex));
        }
      };
      animRef.current = requestAnimationFrame(tick);
    },
    [selected, wrap, onSelect, cancelAnim]
  );

  // ── External jump (chip / Now button) → scroll animation ──
  useEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    if (isInternalRef.current) {
      // Change came from our own snap — offset already 0, nothing to do
      isInternalRef.current = false;
      return;
    }
    if (prev === selected) return;

    // Calculate shortest circular delta
    let delta = selected - prev;
    if (delta > valueRange / 2) delta -= valueRange;
    if (delta < -valueRange / 2) delta += valueRange;

    // Start the reel at ≤VISIBLE_AROUND cells away so animation is visible
    const startOffset = -Math.sign(delta) * Math.min(Math.abs(delta), VISIBLE_AROUND);

    setOffset(startOffset);
    animateToZero(startOffset);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  // ── Pointer handlers ─────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const now = performance.now();
      const { clientY } = e;

      // 双击检测：350ms 内、25px 范围内的第二次按下
      if (lastTapRef.current) {
        const dt = now - lastTapRef.current.time;
        const dy = Math.abs(clientY - lastTapRef.current.y);
        
        if (dt < 350 && dy < 25) {
          lastTapRef.current = null;
          onDoubleTap?.();
          return;
        }
      }
      lastTapRef.current = { time: now, y: clientY };

      // 正常拖拽逻辑
      e.preventDefault();
      cancelAnim();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      dragRef.current = {
        startY: e.clientY,
        startOffset: offset,
        lastY: e.clientY,
        lastT: performance.now(),
        velocity: 0,
      };
    },
    [cancelAnim, offset, onDoubleTap]
  );

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const now = performance.now();
    const dt = now - d.lastT;
    if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
    d.lastY = e.clientY;
    d.lastT = now;
    setOffset(d.startOffset - (e.clientY - d.startY) / CELL_HEIGHT);
  }, []);

  const onPointerUp = useCallback(() => {
    const d = dragRef.current;
    if (!d) return;
    dragRef.current = null;
    snapTo(offset, d.velocity);
  }, [offset, snapTo]);

  // ── Render items ─────────────────────────────────────────
  const items: React.ReactNode[] = [];

  // 增加渲染范围，确保快速滚动时也有足够的数字
  // 从 +2 增加到 +5，确保快速滚动时不会出现空白
  const renderBuffer = 5;
  for (let j = -(VISIBLE_AROUND + renderBuffer); j <= VISIBLE_AROUND + renderBuffer; j++) {
    const distSigned = j - offset;
    const absDist = Math.abs(distSigned);
    if (absDist > VISIBLE_AROUND + renderBuffer - 1) continue;

    const value = wrap(selected + j);
    const label = formatLabel(value);
    const styleIdx = Math.min(Math.round(absDist), ITEM_STYLES.length - 1);
    const s = ITEM_STYLES[styleIdx];
    const isCenter = styleIdx === 0;
    const yOffset = distSigned * CELL_HEIGHT;

    // 3D 圆柱体效果：计算透视变形
    // 距离中心越远，scaleX 越小（模拟圆柱体弧度）
    const normalizedDist = absDist / VISIBLE_AROUND; // 0 到 1
    const scaleX = 1 - normalizedDist * 0.25; // 中心 1.0，边缘 0.75（增强横向压缩）
    const scaleY = 1 - normalizedDist * 0.08; // 轻微纵向压缩

    items.push(
      <div
        key={j}
        className={styles.item}
        style={{
          transform: `translateY(calc(-50% + ${yOffset}px)) scale(${scaleX}, ${scaleY})`,
        }}
      >
        <span
          className={styles.label}
          style={{
            fontSize: s.fontSize,
            fontWeight: s.fontWeight,
            color: isCenter ? accentColor : s.color,
            opacity: s.opacity,
          }}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${styles.reel} ${styles[side]}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* 选中框：与数字容器对齐 */}
      <div
        className={styles.selectionWindow}
        style={{
          borderColor: accentColor,
          background: accentBg,
          // 数字容器现在是 88px 宽，padding 9px，数字在容器内居中
          // selectionWindow 也是 88px 宽，直接对齐到边缘即可
          ...(side === 'left'
          ? { right: 0 }
          : side === 'right'
          ? { left: 0 }
          : { left: '50%', transform: 'translateX(-50%) translateY(-50%)' }),
        }}
      />

      {/* 滚动内容 */}
      <div className={styles.scrollContent}>
        {items}
      </div>
    </div>
  );
}
