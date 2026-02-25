import { useMemo, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KANA_DB } from '../../../datas/kanaData';
import { OriginBadge } from '../../../components/OriginBadge';
import { useTTS } from '../../../hooks/useTTS';
import type { AnyKanaData } from '../../../datas/kanaData/core';
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

interface KanaSideProps {
  data: AnyKanaData | null;
  variant: 'hiragana' | 'katakana';
}

function KanaSide({ data, variant }: KanaSideProps) {
  const { t } = useTranslation();
  const cardClass = variant === 'hiragana' ? styles.cardHiragana : styles.cardKatakana;
  const labelClass = variant === 'hiragana' ? styles.labelHiragana : styles.labelKatakana;
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
    </div>
  );
}

interface KanaDetailSheetProps {
  romaji: string;
}

export function KanaDetailSheet({ romaji }: KanaDetailSheetProps) {
  const { speak } = useTTS();

  const hData = useMemo(() => findKana('h', romaji), [romaji]);
  const kData = useMemo(() => findKana('k', romaji), [romaji]);

  const kanaForTTS = hData?.kana ?? kData?.kana ?? romaji;

  // 弹窗展开后自动播音，稍作延迟等弹窗动画落定
  useEffect(() => {
    const timer = setTimeout(() => speak(kanaForTTS), 250);
    return () => clearTimeout(timer);
  }, [kanaForTTS, speak]);

  return (
    <div className={styles.container}>
      {/* 罗马音 + 播放按钮 */}
      <div className={styles.romajiRow}>
        <span className={styles.romaji}>
          {romaji}
          <button className={styles.speakerBtn} onClick={() => speak(kanaForTTS)}>
            <Volume2 size={16} />
          </button>
        </span>
      </div>

      {/* 平 / 片 两列卡片 */}
      <div className={styles.cards}>
        <KanaSide data={hData} variant="hiragana" />
        <KanaSide data={kData} variant="katakana" />
      </div>
    </div>
  );
}
