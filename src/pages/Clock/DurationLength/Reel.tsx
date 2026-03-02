import {
  useState,
  useRef,
  useCallback,
  useEffect,
  useLayoutEffect,
} from 'react';
import styles from './Reel.module.css';

// 根据屏幕高度动态调整
const getReelConfig = () => {
  const height = window.innerHeight;
  if (height <= 700) {
    return {
      CELL_HEIGHT: 44,
      VISIBLE_AROUND: 5,
      ITEM_STYLES: [
        { fontSize: 48, fontWeight: 700, opacity: 1, color: 'inherit' },
        { fontSize: 34, fontWeight: 600, opacity: 0.75, color: '#71717A' },
        { fontSize: 26, fontWeight: 500, opacity: 0.55, color: '#A1A1AA' },
        { fontSize: 20, fontWeight: 400, opacity: 0.4, color: '#A1A1AA' },
        { fontSize: 16, fontWeight: 400, opacity: 0.28, color: '#D4D4D8' },
        { fontSize: 14, fontWeight: 400, opacity: 0.18, color: '#E4E4E7' },
      ],
    };
  }
  return {
    CELL_HEIGHT: 52,
    VISIBLE_AROUND: 8,
    ITEM_STYLES: [
      { fontSize: 56, fontWeight: 700, opacity: 1, color: 'inherit' },
      { fontSize: 40, fontWeight: 600, opacity: 0.75, color: '#71717A' },
      { fontSize: 30, fontWeight: 500, opacity: 0.55, color: '#A1A1AA' },
      { fontSize: 24, fontWeight: 400, opacity: 0.4, color: '#A1A1AA' },
      { fontSize: 20, fontWeight: 400, opacity: 0.28, color: '#D4D4D8' },
      { fontSize: 18, fontWeight: 400, opacity: 0.2, color: '#D4D4D8' },
      { fontSize: 16, fontWeight: 400, opacity: 0.14, color: '#E4E4E7' },
      { fontSize: 14, fontWeight: 400, opacity: 0.1, color: '#E4E4E7' },
      { fontSize: 12, fontWeight: 400, opacity: 0.06, color: '#F4F4F5' },
    ],
  };
};

// ── 物理常数 ──────────────────────────────────────────────
const DAMP_HALF_LIFE = 150; // 阻尼半衰期（毫秒），越小停得越快
const MIN_VEL = 0.001; // 最小速度阈值（槽/毫秒），低于此速度进入吸附
const SNAP_EASE = 0.25; // 吸附缓动系数
const SNAP_THRESH = 0.005; // 吸附完成阈值
const MAX_VEL = 0.08; // 最大初速度限制（防止用力过猛滚飞）

export interface ReelProps {
  valueRange: number;
  selected: number;
  formatLabel: (v: number) => string;
  onSelect: (v: number) => void;
  side: 'left' | 'right' | 'center';
  accentColor: string;
  accentBg?: string;
  onDoubleTap?: () => void;
  onScrollComplete?: (value: number) => void;
}

export function Reel({
  valueRange,
  selected,
  formatLabel,
  onSelect,
  side,
  accentColor,
  onDoubleTap,
  onScrollComplete,
}: ReelProps) {
  const config = getReelConfig();
  const { CELL_HEIGHT, VISIBLE_AROUND, ITEM_STYLES } = config;

  const [offset, setOffset] = useState(0);

  // 物理与状态引擎
  const physRef = useRef({
    offset: 0,
    velocity: 0,
    phase: 'idle' as 'idle' | 'drag' | 'inertia' | 'snap',
    snapTarget: 0,
    lastTime: 0,
    animId: null as number | null,
    history: [] as { y: number; t: number }[],
    dragStartY: 0,
    dragStartOffset: 0,
  });

  const lastTapRef = useRef<{ time: number; y: number } | null>(null);
  const isInternalRef = useRef(false);

  // 保持引用最新，避免闭包陷阱。这里改为 useLayoutEffect 以避免闪烁
  const selectedRef = useRef(selected);
  const prevSelectedRef = useRef(selected);
  useLayoutEffect(() => {
    selectedRef.current = selected;
  }, [selected]);

  const wrap = useCallback(
    (v: number) => ((Math.round(v) % valueRange) + valueRange) % valueRange,
    [valueRange]
  );

  const cancelAnim = useCallback(() => {
    const p = physRef.current;
    if (p.animId !== null) {
      cancelAnimationFrame(p.animId);
      p.animId = null;
    }
  }, []);

  // ── 核心物理循环 ─────────────────────────────────────────
  const startAnim = useCallback(() => {
    const p = physRef.current;
    p.lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - p.lastTime, 50);
      p.lastTime = now;

      if (p.phase === 'inertia') {
        // 惯性滑动：基于阻尼衰减
        p.offset += p.velocity * dt;
        p.velocity *= Math.pow(0.5, dt / DAMP_HALF_LIFE);

        if (Math.abs(p.velocity) < MIN_VEL) {
          p.phase = 'snap';
          p.snapTarget = Math.round(p.offset);
        }
      } else if (p.phase === 'snap') {
        // 自动吸附：向最近的整数槽靠近
        const diff = p.snapTarget - p.offset;
        p.offset += diff * SNAP_EASE;

        if (Math.abs(diff) < SNAP_THRESH) {
          p.offset = p.snapTarget;
          p.phase = 'idle';
          p.animId = null;

          // 吸附完成，计算实际选中的新值
          const targetIndex = Math.round(p.offset);
          const newValue = wrap(selectedRef.current + targetIndex);

          // 核心点：重置物理 offset，并通过更新 selected 驱动 UI
          p.offset = 0;
          setOffset(0);

          // 【修复】：外部双击跳转时 newValue === selectedRef.current，此时跳过更新，避免死锁
          if (newValue !== selectedRef.current) {
            isInternalRef.current = true;
            onSelect(newValue);
          }

          onScrollComplete?.(newValue);
          return; // 动画结束
        }
      }

      setOffset(p.offset);
      p.animId = requestAnimationFrame(tick);
    };

    p.animId = requestAnimationFrame(tick);
  }, [onSelect, onScrollComplete, wrap]);

  // ── 外部传入新值跳转（如点击快捷键） ───────────────────────
  useLayoutEffect(() => {
    const prev = prevSelectedRef.current;
    prevSelectedRef.current = selected;

    if (isInternalRef.current) {
      // 内部吸附导致的 selected 更新，不需二次动画
      isInternalRef.current = false;
      return;
    }
    if (prev === selected) return;

    // 计算最短环形跳跃距离
    let delta = selected - prev;
    if (delta > valueRange / 2) delta -= valueRange;
    if (delta < -valueRange / 2) delta += valueRange;

    // 限制起始动画点在视野内
    const startOffset =
      -Math.sign(delta) * Math.min(Math.abs(delta), VISIBLE_AROUND);

    cancelAnim();
    const p = physRef.current;
    p.offset = startOffset;
    p.phase = 'snap';
    p.snapTarget = 0; // 朝着中心 0 自动吸附
    setOffset(startOffset);
    startAnim();
  }, [selected, valueRange, VISIBLE_AROUND, cancelAnim, startAnim]);

  // ── 手势事件 ──────────────────────────────────────────────
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const now = performance.now();
      const { clientY } = e;

      // 双击检测
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

      e.preventDefault();
      cancelAnim();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const p = physRef.current;
      p.phase = 'drag';
      p.dragStartY = clientY;
      p.dragStartOffset = p.offset;
      p.history = [{ y: clientY, t: now }];
    },
    [cancelAnim, onDoubleTap]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const p = physRef.current;
      if (p.phase !== 'drag') return;

      const now = performance.now();
      // 计算拖拽中的偏移 (px -> cells)
      p.offset = p.dragStartOffset - (e.clientY - p.dragStartY) / CELL_HEIGHT;

      // 记录过去 130ms 的轨迹用于抛掷测速
      p.history = [
        ...p.history.filter((h) => now - h.t < 130),
        { y: e.clientY, t: now },
      ];

      setOffset(p.offset);
    },
    [CELL_HEIGHT]
  );

  const onPointerUp = useCallback(() => {
    const p = physRef.current;
    if (p.phase !== 'drag') return;

    let velocityPxPerMs = 0;
    if (p.history.length >= 2) {
      const old = p.history[0];
      const neo = p.history[p.history.length - 1];
      const dt = neo.t - old.t;
      if (dt > 5) {
        velocityPxPerMs = (neo.y - old.y) / dt;
      }
    }

    // 将 px/ms 转换为 offset/ms (向下滑 px 增加，代表 offset 减小)
    let v = -velocityPxPerMs / CELL_HEIGHT;
    v = Math.max(-MAX_VEL, Math.min(MAX_VEL, v));

    if (Math.abs(v) > MIN_VEL * 3) {
      p.phase = 'inertia';
      p.velocity = v;
    } else {
      p.phase = 'snap';
      p.snapTarget = Math.round(p.offset);
    }

    p.history = [];
    startAnim();
  }, [CELL_HEIGHT, startAnim]);

  // ── 渲染 ──────────────────────────────────────────────────
  const items: React.ReactNode[] = [];
  const renderBuffer = 5; // 视野外多渲染几个作为缓冲

  // 【核心修复】：以当前滚动到的 offset 为中心，动态计算需要渲染的范围
  const centerJ = Math.round(offset);
  const startJ = centerJ - (VISIBLE_AROUND + renderBuffer);
  const endJ = centerJ + (VISIBLE_AROUND + renderBuffer);

  for (let j = startJ; j <= endJ; j++) {
    const distSigned = j - offset;
    const absDist = Math.abs(distSigned);
    if (absDist > VISIBLE_AROUND + renderBuffer - 1) continue;

    const value = wrap(selected + j);
    const label = formatLabel(value);

    // 样式索引计算：距离中心越远，样式越淡/越小
    const styleIdx = Math.min(Math.round(absDist), ITEM_STYLES.length - 1);
    const s = ITEM_STYLES[styleIdx];
    const isCenter = styleIdx === 0;
    const yOffset = distSigned * CELL_HEIGHT;

    // 3D 视觉透视变形
    const normalizedDist = absDist / VISIBLE_AROUND;
    const scaleX = 1 - normalizedDist * 0.25;
    const scaleY = 1 - normalizedDist * 0.08;

    items.push(
      <div
        key={j} // 使用相对偏移量 j 作为 key 即可
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
      <div className={styles.scrollContent}>{items}</div>
    </div>
  );
}
