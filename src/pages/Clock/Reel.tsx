import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './Reel.module.css';

const CELL_HEIGHT = 56;
const VISIBLE_AROUND = 8; // 增加到8，确保快速滚动时也有足够的数字
const SNAP_MS = 250;
const MOMENTUM_FACTOR = 0.3;
const MAX_MOMENTUM_INDICES = 3;

interface ItemStyle {
  fontSize: number;
  fontWeight: number;
  opacity: number;
  color: string;
}

const ITEM_STYLES: ItemStyle[] = [
  { fontSize: 44, fontWeight: 700, opacity: 1,    color: 'inherit' },
  { fontSize: 36, fontWeight: 600, opacity: 0.8,  color: '#71717A' },
  { fontSize: 28, fontWeight: 500, opacity: 0.6,  color: '#71717A' },
  { fontSize: 22, fontWeight: 400, opacity: 0.45, color: '#A1A1AA' },
  { fontSize: 18, fontWeight: 400, opacity: 0.3,  color: '#D4D4D8' },
  { fontSize: 16, fontWeight: 400, opacity: 0.2,  color: '#D4D4D8' },
  { fontSize: 14, fontWeight: 400, opacity: 0.15, color: '#E4E4E7' },
  { fontSize: 12, fontWeight: 400, opacity: 0.1,  color: '#E4E4E7' },
  { fontSize: 12, fontWeight: 400, opacity: 0.05, color: '#F4F4F5' },
];

export interface ReelProps {
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right';
  accentColor: string;
  accentBg: string;
}

export function Reel({
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
  accentColor,
  accentBg,
}: ReelProps) {
  const [offset, setOffset] = useState(0);

  const dragRef = useRef<{
    startY: number;
    startOffset: number;
    lastY: number;
    lastT: number;
    velocity: number;
  } | null>(null);
  const animRef = useRef<number | null>(null);

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
    [cancelAnim, offset]
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
  for (let j = -(VISIBLE_AROUND + 2); j <= VISIBLE_AROUND + 2; j++) {
    const distSigned = j - offset;
    const absDist = Math.abs(distSigned);
    if (absDist > VISIBLE_AROUND + 1) continue;

    const value = wrap(selected + j);
    const label = formatLabel(value);
    const styleIdx = Math.min(Math.round(absDist), ITEM_STYLES.length - 1);
    const s = ITEM_STYLES[styleIdx];
    const isCenter = styleIdx === 0;
    const yOffset = distSigned * CELL_HEIGHT;

    items.push(
      <div
        key={j}
        className={styles.item}
        style={{
          transform: `translateY(calc(-50% + ${yOffset}px))`,
          // 数字靠向内侧（冒号方向），与 selectionWindow 对齐
          justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
          paddingRight: side === 'left' ? 20 : 0,
          paddingLeft: side === 'right' ? 20 : 0,
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
      {/* 选中框：固定在内侧（靠冒号），不随滚动移动 */}
      <div
        className={styles.selectionWindow}
        style={{
          borderColor: accentColor,
          background: accentBg,
          // 左鼓靠右边缘（内侧），右鼓靠左边缘（内侧）
          ...(side === 'left' ? { right: 0 } : { left: 0 }),
        }}
      />

      {/* 滚动内容 */}
      <div className={styles.scrollContent}>
        {items}
      </div>
    </div>
  );
}
