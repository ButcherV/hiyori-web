import { useMemo, useState } from 'react';
import { Volume2, Pen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KANA_DB } from '../../../datas/kanaData';
import { OriginBadge } from '../../../components/OriginBadge';
import { useTTS } from '../../../hooks/useTTS';
import type { AnyKanaData } from '../../../datas/kanaData/core';
import { KanaTracingView } from './KanaTracingView';
import styles from './KanaDetailSheet.module.css';

const KANA_BY_ID: Record<string, AnyKanaData> = Object.fromEntries(
  Object.values(KANA_DB)
    .filter(Boolean)
    .map((item) => [item.id, item])
);

function findKana(prefix: 'h' | 'k', romaji: string): AnyKanaData | null {
  return (
    KANA_BY_ID[`${prefix}-${romaji}`] ??
    KANA_BY_ID[`${prefix}-yoon-${romaji}`] ??
    null
  );
}

function isSeion(data: AnyKanaData | null): boolean {
  return data?.kind === 'h-seion' || data?.kind === 'k-seion';
}

type TracingTarget = { data: AnyKanaData; variant: 'hiragana' | 'katakana' };

interface KanaSideProps {
  data: AnyKanaData | null;
  variant: 'hiragana' | 'katakana';
  onTrace: (target: TracingTarget) => void;
}

function KanaSide({ data, variant, onTrace }: KanaSideProps) {
  const { t } = useTranslation();
  const cardClass = variant === 'hiragana' ? styles.cardHiragana : styles.cardKatakana;
  const labelClass = variant === 'hiragana' ? styles.labelHiragana : styles.labelKatakana;
  const accentColor = variant === 'hiragana' ? '#FF6B00' : '#007AFF';
  const label = t(`kana_dictionary.tabs.${variant}`);

  return (
    <div className={cardClass}>
      <span className={labelClass}>{label}</span>
      <div className={`${styles.bigChar} jaFont`}>{data?.kana ?? '—'}</div>
      {data && isSeion(data) && data.kanaKanjiOrigin && (
        <OriginBadge
          char={data.kana}
          romaji={data.romaji}
          kanjiOrigin={data.kanaKanjiOrigin}
        />
      )}
      {data && (
        <button
          className={styles.traceBtn}
          style={{ color: accentColor }}
          onClick={() => onTrace({ data, variant })}
        >
          <Pen size={14} />
        </button>
      )}
    </div>
  );
}

interface KanaDetailSheetProps {
  romaji: string;
}

export function KanaDetailSheet({ romaji }: KanaDetailSheetProps) {
  const { speak } = useTTS();
  const [tracingTarget, setTracingTarget] = useState<TracingTarget | null>(null);

  const hData = useMemo(() => findKana('h', romaji), [romaji]);
  const kData = useMemo(() => findKana('k', romaji), [romaji]);

  const kanaForTTS = hData?.kana ?? kData?.kana ?? romaji;

  if (tracingTarget) {
    return (
      <KanaTracingView
        data={tracingTarget.data}
        variant={tracingTarget.variant}
        onClose={() => setTracingTarget(null)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.romajiRow}>
        <span className={styles.romaji}>
          {romaji}
          <button className={styles.speakerBtn} onClick={() => speak(kanaForTTS)}>
            <Volume2 size={16} />
          </button>
        </span>
      </div>

      <div className={styles.cards}>
        <KanaSide data={hData} variant="hiragana" onTrace={setTracingTarget} />
        <KanaSide data={kData} variant="katakana" onTrace={setTracingTarget} />
      </div>
    </div>
  );
}
