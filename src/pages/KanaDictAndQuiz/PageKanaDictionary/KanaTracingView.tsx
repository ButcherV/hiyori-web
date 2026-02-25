import { useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Eraser } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AnyKanaData } from '../../../datas/kanaData/core';
import styles from './KanaTracingView.module.css';

interface KanaTracingViewProps {
  data: AnyKanaData;
  variant: 'hiragana' | 'katakana';
  onClose: () => void;
}

const CANVAS_SIZE = 400;

export function KanaTracingView({ data, variant, onClose }: KanaTracingViewProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const accentColor = variant === 'hiragana' ? '#FF6B00' : '#007AFF';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [accentColor]);

  const getPos = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (CANVAS_SIZE / rect.width),
      y: (e.clientY - rect.top) * (CANVAS_SIZE / rect.height),
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      isDrawing.current = true;
      lastPos.current = getPos(e);
      (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    },
    [getPos]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing.current || !lastPos.current) return;
      const ctx = canvasRef.current!.getContext('2d')!;
      const pos = getPos(e);
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      lastPos.current = pos;
    },
    [getPos]
  );

  const handlePointerUp = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  const handleClear = useCallback(() => {
    canvasRef.current!.getContext('2d')!.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={onClose}>
          <ArrowLeft size={18} />
        </button>
        <div className={styles.titleGroup}>
          <span className={`${styles.kanaChar} jaFont`}>{data.kana}</span>
          <span className={styles.romajiLabel}>{data.romaji}</span>
          <span className={styles.variantTag} style={{ color: accentColor }}>
            {t(`kana_dictionary.tabs.${variant}`)}
          </span>
        </div>
      </div>

      <div className={styles.canvasWrap}>
        <div
          className={`${styles.guideChar} jaFont`}
          style={{ color: variant === 'hiragana' ? 'rgba(255,107,0,0.07)' : 'rgba(0,122,255,0.07)' }}
        >
          {data.kana}
        </div>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      <button
        className={styles.clearBtn}
        onClick={handleClear}
        style={{ color: accentColor, borderColor: `${accentColor}30` }}
      >
        <Eraser size={15} />
        <span>{t('tracing.clear')}</span>
      </button>
    </div>
  );
}
