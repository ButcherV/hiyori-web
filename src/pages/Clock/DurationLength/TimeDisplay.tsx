import { useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTS } from '../../../hooks/useTTS';
import styles from './TimeDisplay.module.css';

type Axis = 'hour' | 'minute' | 'second';

// ── 時間読音 (duration hours 0–23) ───────────────────────
const HOUR_DURATION_KANA: Record<number, string> = {
  0: 'ぜろじかん',
  1: 'いちじかん',   2: 'にじかん',         3: 'さんじかん',
  4: 'よじかん',     5: 'ごじかん',         6: 'ろくじかん',
  7: 'ななじかん',   8: 'はちじかん',       9: 'くじかん',
  10: 'じゅうじかん', 11: 'じゅういちじかん', 12: 'じゅうにじかん',
  13: 'じゅうさんじかん', 14: 'じゅうよじかん', 15: 'じゅうごじかん',
  16: 'じゅうろくじかん', 17: 'じゅうしちじかん', 18: 'じゅうはちじかん',
  19: 'じゅうくじかん', 20: 'にじゅうじかん', 21: 'にじゅういちじかん',
  22: 'にじゅうにじかん', 23: 'にじゅうさんじかん',
};

// ── 分読音 (0–59) ─────────────────────────────────────────
const MINUTE_KANA: Record<number, string> = {
  0: 'ぜろふん',
  1: 'いっぷん',   2: 'にふん',         3: 'さんぷん',
  4: 'よんぷん',   5: 'ごふん',         6: 'ろっぷん',
  7: 'ななふん',   8: 'はっぷん',       9: 'きゅうふん',
  10: 'じゅっぷん',  11: 'じゅういっぷん', 12: 'じゅうにふん',
  13: 'じゅうさんぷん', 14: 'じゅうよんぷん', 15: 'じゅうごふん',
  16: 'じゅうろっぷん', 17: 'じゅうななふん', 18: 'じゅうはっぷん',
  19: 'じゅうきゅうふん', 20: 'にじゅっぷん',  21: 'にじゅういっぷん',
  22: 'にじゅうにふん',   23: 'にじゅうさんぷん', 24: 'にじゅうよんぷん',
  25: 'にじゅうごふん',   26: 'にじゅうろっぷん', 27: 'にじゅうななふん',
  28: 'にじゅうはっぷん', 29: 'にじゅうきゅうふん', 30: 'さんじゅっぷん',
  31: 'さんじゅういっぷん', 32: 'さんじゅうにふん', 33: 'さんじゅうさんぷん',
  34: 'さんじゅうよんぷん', 35: 'さんじゅうごふん', 36: 'さんじゅうろっぷん',
  37: 'さんじゅうななふん', 38: 'さんじゅうはっぷん', 39: 'さんじゅうきゅうふん',
  40: 'よんじゅっぷん',    41: 'よんじゅういっぷん', 42: 'よんじゅうにふん',
  43: 'よんじゅうさんぷん', 44: 'よんじゅうよんぷん', 45: 'よんじゅうごふん',
  46: 'よんじゅうろっぷん', 47: 'よんじゅうななふん', 48: 'よんじゅうはっぷん',
  49: 'よんじゅうきゅうふん', 50: 'ごじゅっぷん',    51: 'ごじゅういっぷん',
  52: 'ごじゅうにふん',   53: 'ごじゅうさんぷん', 54: 'ごじゅうよんぷん',
  55: 'ごじゅうごふん',   56: 'ごじゅうろっぷん', 57: 'ごじゅうななふん',
  58: 'ごじゅうはっぷん', 59: 'ごじゅうきゅうふん',
};

// ── 秒読音 (N びょう) ─────────────────────────────────────
const NUM_KANA = ['ぜろ', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
const TENS_KANA = ['', 'じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう'];

function numToKana(n: number): string {
  if (n === 0) return 'ぜろ';
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (t === 0) return NUM_KANA[o];
  if (o === 0) return TENS_KANA[t];
  return TENS_KANA[t] + NUM_KANA[o];
}

function secondKana(n: number): string {
  return numToKana(n) + 'びょう';
}

// ── 表示データ ────────────────────────────────────────────
interface Segment {
  kanji: string;
  kana: string;
}

interface DisplayData {
  segments: Segment[];
  speakText: string;
}

function buildDisplayData(
  hour: number,
  minute: number,
  second: number,
  activeAxes: Set<Axis>
): DisplayData {
  const segments: Segment[] = [];

  if (activeAxes.has('hour')) {
    segments.push({
      kanji: `${hour}時間`,
      kana: HOUR_DURATION_KANA[hour] ?? `${numToKana(hour)}じかん`,
    });
  }

  if (activeAxes.has('minute')) {
    segments.push({
      kanji: `${minute}分`,
      kana: MINUTE_KANA[minute] ?? `${numToKana(minute)}ふん`,
    });
  }

  if (activeAxes.has('second')) {
    segments.push({
      kanji: `${second}秒`,
      kana: secondKana(second),
    });
  }

  return {
    segments,
    speakText: segments.map((s) => s.kana).join(''),
  };
}

// ── コンポーネント ────────────────────────────────────────
interface TimeDisplayProps {
  hour: number;
  minute: number;
  second: number;
  activeAxes: Set<Axis>;
}

// 漢字の総文字数で3段階：1軸(≤4)→大、2軸(≤7)→中、3軸(>7)→小
function calcFontSizes(totalKanjiLen: number): { kana: number; kanji: number } {
  if (totalKanjiLen <= 4) return { kana: 13, kanji: 40 };
  if (totalKanjiLen <= 7) return { kana: 11, kanji: 32 };
  return                         { kana: 10, kanji: 26 };
}

export function TimeDisplay({ hour, minute, second, activeAxes }: TimeDisplayProps) {
  const { speak } = useTTS();
  const data = buildDisplayData(hour, minute, second, activeAxes);

  const totalKanjiLen = data.segments.reduce((sum, s) => sum + s.kanji.length, 0);
  const { kana: kanaSize, kanji: kanjiSize } = calcFontSizes(totalKanjiLen);

  const handleSpeak = useCallback(() => {
    if (!data.speakText) return;
    speak(data.speakText, { gender: 'female' });
  }, [data.speakText, speak]);

  const activeAxesKey = (['hour', 'minute', 'second'] as Axis[])
    .filter((a) => activeAxes.has(a))
    .join('');
  const contentKey = `${hour}-${minute}-${second}-${activeAxesKey}`;

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          className={styles.content}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className={`${styles.timeRow} ${styles.timeRowLarge} jaFont`}>
            {data.segments.map((seg, i) => (
              <div className={styles.segment} key={i}>
                <span className={styles.segKana} style={{ fontSize: kanaSize }}>{seg.kana}</span>
                <span className={styles.segKanji} style={{ fontSize: kanjiSize }}>{seg.kanji}</span>
              </div>
            ))}
            <button
              className={styles.speakerBtnSmall}
              onClick={handleSpeak}
              aria-label="読み上げ"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
