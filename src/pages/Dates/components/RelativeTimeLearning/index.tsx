// src/pages/Dates/components/RelativeTimeLearning/index.tsx

import React, { useState, useEffect, useRef } from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import {
  type Granularity,
  type TimelineNode,
  type PointItem,
  type DurationItem,
  generateTimelineNodes,
  getRelativeItem,
  getMinorNodeItem,
  getDurationExpression,
  getDateLabel,
} from '../../Datas/RelativeTimeData';
import styles from './index.module.css';

interface RelativeTimeLearningProps {
  granularity: Granularity;
}

interface Selection {
  anchor: number;
  focus: number;
}

function getTodayIdx(nodes: TimelineNode[]): number {
  const i = nodes.findIndex((n) => n.dayOffset === 0);
  return i >= 0 ? i : 0;
}

/** Date label for any node — compact format for dense views. */
function getNodeDateLabel(granularity: Granularity, node: TimelineNode): string {
  const today = new Date();

  if (node.type === 'minor' || granularity === 'day') {
    // Minor nodes and day-granularity major: plain M/D
    const d = new Date(today);
    d.setDate(d.getDate() + node.dayOffset);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  // Major nodes in dense views — shorter labels
  const offset = node.unitOffset!;

  if (granularity === 'week') {
    // Show Monday of that week as "M/D"
    const dow = today.getDay();
    const toMon = dow === 0 ? -6 : 1 - dow;
    const mon = new Date(today);
    mon.setDate(today.getDate() + toMon + offset * 7);
    return `${mon.getMonth() + 1}/${mon.getDate()}`;
  }

  if (granularity === 'month') {
    const d = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    return `${d.getMonth() + 1}月`;
  }

  // year
  return String(today.getFullYear() + offset);
}

// ── Point card ────────────────────────────────────────────────────────────

const PointCard: React.FC<{ item: PointItem }> = ({ item }) => {
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';
  return (
    <div className={styles.detail}>
      <div className={styles.heroRow}>
        <p className={`${styles.heroKanji} jaFont`}>{item.kanji}</p>
        {item.trap && (
          <span className={styles.trapBadge}>{t('date_study.relative.trap_badge')}</span>
        )}
      </div>
      <p className={styles.meaning}>{item.meaning[locale]}</p>
      <div className={styles.kanaRow}>
        <p className={`${styles.kana} jaFont`}>{item.kana}</p>
        <button className={styles.audioBtn} onClick={() => speak(item.kana)} aria-label={`Play ${item.kana}`}>
          <Volume2 size={15} />
        </button>
      </div>
      <p className={styles.romaji}>{item.romaji}</p>
      {item.altKana && (
        <div className={styles.altRow}>
          <span className={styles.altBadge}>{t('date_study.relative.alt_badge')}</span>
          {item.altKanji && <span className={`${styles.altKanji} jaFont`}>{item.altKanji}</span>}
          <span className={`${styles.altKana} jaFont`}>{item.altKana}</span>
          <span className={styles.altRomaji}>{item.altRomaji}</span>
          <button className={styles.audioBtn} onClick={() => speak(item.altKana!)} aria-label={`Play ${item.altKana}`}>
            <Volume2 size={13} />
          </button>
        </div>
      )}
      {item.note && <p className={styles.note}>{item.note[locale]}</p>}
    </div>
  );
};

// ── Duration card ─────────────────────────────────────────────────────────

const DurationCard: React.FC<{ item: DurationItem }> = ({ item }) => {
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';
  return (
    <div className={styles.detail}>
      <div className={styles.heroRow}>
        <p className={`${styles.heroKanji} jaFont`}>{item.kanji}</p>
        <span className={styles.durationBadge}>{t('date_study.relative.duration_badge')}</span>
      </div>
      <p className={styles.meaning}>{item.meaning[locale]}</p>
      <div className={styles.kanaRow}>
        <p className={`${styles.kana} jaFont`}>{item.kana}</p>
        <button className={styles.audioBtn} onClick={() => speak(item.kana)} aria-label={`Play ${item.kana}`}>
          <Volume2 size={15} />
        </button>
      </div>
      <p className={styles.romaji}>{item.romaji}</p>
      {item.note && <p className={styles.note}>{item.note[locale]}</p>}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────

export const RelativeTimeLearning: React.FC<RelativeTimeLearningProps> = ({ granularity }) => {
  const [nodes, setNodes] = useState<TimelineNode[]>(() => generateTimelineNodes(granularity));

  // Auto-select "today" on first load
  const [selection, setSelection] = useState<Selection>(() => {
    const n = generateTimelineNodes(granularity);
    const i = getTodayIdx(n);
    return { anchor: i, focus: i };
  });

  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Reset to today when granularity switches
  useEffect(() => {
    const n = generateTimelineNodes(granularity);
    setNodes(n);
    const i = getTodayIdx(n);
    setSelection({ anchor: i, focus: i });
  }, [granularity]);

  // Attach non-passive touch events so e.preventDefault() works for horizontal drag
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    /** Snap to the node whose center is closest to clientX */
    const getNearest = (clientX: number): number => {
      let best = 0;
      let bestDist = Infinity;
      nodeRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const { left, width } = ref.getBoundingClientRect();
        const dist = Math.abs(clientX - (left + width / 2));
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      return best;
    };

    // Mutable drag state — lives inside this effect closure
    let phase: 'idle' | 'pending' | 'horizontal' | 'vertical' = 'idle';
    let startX = 0, startY = 0, anchor = 0;

    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      anchor = getNearest(t.clientX);
      startX = t.clientX;
      startY = t.clientY;
      phase = 'pending';
      setSelection({ anchor, focus: anchor });
    };

    const onMove = (e: TouchEvent) => {
      if (phase === 'vertical') return;

      const t = e.touches[0];
      const adx = Math.abs(t.clientX - startX);
      const ady = Math.abs(t.clientY - startY);

      if (phase === 'pending') {
        // Need > 12px horizontal lead before committing to range mode
        if (adx > ady && adx > 12) {
          phase = 'horizontal';
        } else if (ady > adx && ady > 8) {
          phase = 'vertical'; // yield to scroll
          return;
        } else {
          return; // too small to decide yet
        }
      }

      // Horizontal drag confirmed — block scroll and update range
      e.preventDefault();
      const focusIdx = getNearest(t.clientX);
      setSelection({ anchor, focus: focusIdx });
    };

    const onEnd = () => { phase = 'idle'; };

    // touchstart can be passive (no preventDefault needed there)
    el.addEventListener('touchstart', onStart, { passive: true });
    // touchmove must be non-passive so we can call preventDefault
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd);

    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, []); // empty deps — only uses refs and the stable setSelection

  // ── Derived state ──────────────────────────────────────────────────────

  const isRange = selection.anchor !== selection.focus;
  const minIdx  = Math.min(selection.anchor, selection.focus);
  const maxIdx  = Math.max(selection.anchor, selection.focus);

  const pointItem: PointItem | undefined = (() => {
    if (isRange) return undefined;
    const node = nodes[selection.anchor];
    if (!node) return undefined;
    return node.type === 'major'
      ? getRelativeItem(granularity, node.unitOffset!)
      : getMinorNodeItem(node.dayOffset, granularity);
  })();

  const durationItem: DurationItem | undefined = (() => {
    if (!isRange) return undefined;
    const a = nodes[selection.anchor];
    const f = nodes[selection.focus];
    if (!a || !f) return undefined;
    return getDurationExpression(granularity, a.dayOffset, f.dayOffset);
  })();

  // Range highlight bar geometry — measured from actual node DOM positions
  // so that padding on the timeline doesn't throw off the bar's placement.
  const [rangeBar, setRangeBar] = useState<{ left: string; right: string } | null>(null);

  useEffect(() => {
    if (!isRange) { setRangeBar(null); return; }
    const tlEl = timelineRef.current;
    const minEl = nodeRefs.current[minIdx];
    const maxEl = nodeRefs.current[maxIdx];
    if (!tlEl || !minEl || !maxEl) return;
    const tlRect  = tlEl.getBoundingClientRect();
    const minRect = minEl.getBoundingClientRect();
    const maxRect = maxEl.getBoundingClientRect();
    const leftPx  = (minRect.left + minRect.width  / 2) - tlRect.left;
    const rightPx = tlRect.right  - (maxRect.left  + maxRect.width / 2);
    setRangeBar({ left: `${leftPx}px`, right: `${rightPx}px` });
  }, [isRange, minIdx, maxIdx]);

  // Card key drives a re-mount (fade-in) when content changes
  const cardKey = isRange
    ? `dur-${granularity}-${minIdx}-${maxIdx}`
    : `pt-${granularity}-${selection.anchor}`;

  return (
    <div className={styles.container}>

      {/* ── Timeline ── */}
      <div ref={timelineRef} className={styles.timeline}>
        <div className={styles.timelineAxis} />

        {/* Highlighted span between anchor and focus */}
        {isRange && rangeBar && (
          <div className={styles.rangeHighlight} style={rangeBar} />
        )}

        {nodes.map((node, idx) => {
          const isMajor   = node.type === 'major';
          const isEndpoint = idx === selection.anchor || idx === selection.focus;
          const inRange    = isRange && idx > minIdx && idx < maxIdx;
          const isCurrent  = node.dayOffset === 0;
          const nodeItem   = isMajor ? getRelativeItem(granularity, node.unitOffset!) : null;

          return (
            <div
              key={idx}
              ref={(el) => { nodeRefs.current[idx] = el; }}
              className={[
                styles.node,
                isMajor ? styles.nodeMajor : styles.nodeMinor,
                isEndpoint ? styles.nodeSelected : '',
                isCurrent && !isEndpoint ? styles.nodeCurrent : '',
                inRange ? styles.nodeInRange : '',
              ].join(' ')}
            >
              {isMajor && (
                <>
                  <span className={`${styles.nodeKanji} jaFont`}>
                    {nodeItem?.kanji ?? '—'}
                    {nodeItem?.trap && <span className={styles.trapDot} />}
                  </span>
                  <div className={styles.nodeDot} />
                  <span className={styles.nodeDate}>{getNodeDateLabel(granularity, node)}</span>
                </>
              )}
              {!isMajor && <div className={styles.nodeDot} />}
            </div>
          );
        })}
      </div>

      {/* ── Card ── */}
      {!isRange && pointItem && <PointCard key={cardKey} item={pointItem} />}
      {isRange && durationItem && <DurationCard key={cardKey} item={durationItem} />}

    </div>
  );
};
