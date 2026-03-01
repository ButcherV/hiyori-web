import { useCallback, forwardRef, useImperativeHandle } from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { Trans } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTS } from '../../hooks/useTTS';
import type { TimePeriod } from './Duration/types';
import styles from './ClockBottomDisplay.module.css';

// ── 時読音データ (time of day) ────────────────────────────
const HOUR_KANA: Record<number, string> = {
  0: 'れいじ',
  1: 'いちじ',
  2: 'にじ',
  3: 'さんじ',
  4: 'よじ',
  5: 'ごじ',
  6: 'ろくじ',
  7: 'しちじ',
  8: 'はちじ',
  9: 'くじ',
  10: 'じゅうじ',
  11: 'じゅういちじ',
  12: 'じゅうにじ',
  13: 'じゅうさんじ',
  14: 'じゅうよじ',
  15: 'じゅうごじ',
  16: 'じゅうろくじ',
  17: 'じゅうしちじ',
  18: 'じゅうはちじ',
  19: 'じゅうくじ',
  20: 'にじゅうじ',
  21: 'にじゅういちじ',
  22: 'にじゅうにじ',
  23: 'にじゅうさんじ',
};

// ── 時間読音 (duration hours) ─────────────────────────────
const HOUR_DURATION_KANA: Record<number, string> = {
  0: 'ぜろじかん',
  1: 'いちじかん',
  2: 'にじかん',
  3: 'さんじかん',
  4: 'よじかん',
  5: 'ごじかん',
  6: 'ろくじかん',
  7: 'ななじかん',
  8: 'はちじかん',
  9: 'くじかん',
  10: 'じゅうじかん',
  11: 'じゅういちじかん',
  12: 'じゅうにじかん',
  13: 'じゅうさんじかん',
  14: 'じゅうよじかん',
  15: 'じゅうごじかん',
  16: 'じゅうろくじかん',
  17: 'じゅうしちじかん',
  18: 'じゅうはちじかん',
  19: 'じゅうくじかん',
  20: 'にじゅうじかん',
  21: 'にじゅういちじかん',
  22: 'にじゅうにじかん',
  23: 'にじゅうさんじかん',
};

// ── 分読音 ────────────────────────────────────────────────
const MINUTE_KANA: Record<number, string> = {
  0: 'ぜろふん',
  1: 'いっぷん',
  2: 'にふん',
  3: 'さんぷん',
  4: 'よんぷん',
  5: 'ごふん',
  6: 'ろっぷん',
  7: 'ななふん',
  8: 'はっぷん',
  9: 'きゅうふん',
  10: 'じゅっぷん',
  11: 'じゅういっぷん',
  12: 'じゅうにふん',
  13: 'じゅうさんぷん',
  14: 'じゅうよんぷん',
  15: 'じゅうごふん',
  16: 'じゅうろっぷん',
  17: 'じゅうななふん',
  18: 'じゅうはっぷん',
  19: 'じゅうきゅうふん',
  20: 'にじゅっぷん',
  21: 'にじゅういっぷん',
  22: 'にじゅうにふん',
  23: 'にじゅうさんぷん',
  24: 'にじゅうよんぷん',
  25: 'にじゅうごふん',
  26: 'にじゅうろっぷん',
  27: 'にじゅうななふん',
  28: 'にじゅうはっぷん',
  29: 'にじゅうきゅうふん',
  30: 'さんじゅっぷん',
  31: 'さんじゅういっぷん',
  32: 'さんじゅうにふん',
  33: 'さんじゅうさんぷん',
  34: 'さんじゅうよんぷん',
  35: 'さんじゅうごふん',
  36: 'さんじゅうろっぷん',
  37: 'さんじゅうななふん',
  38: 'さんじゅうはっぷん',
  39: 'さんじゅうきゅうふん',
  40: 'よんじゅっぷん',
  41: 'よんじゅういっぷん',
  42: 'よんじゅうにふん',
  43: 'よんじゅうさんぷん',
  44: 'よんじゅうよんぷん',
  45: 'よんじゅうごふん',
  46: 'よんじゅうろっぷん',
  47: 'よんじゅうななふん',
  48: 'よんじゅうはっぷん',
  49: 'よんじゅうきゅうふん',
  50: 'ごじゅっぷん',
  51: 'ごじゅういっぷん',
  52: 'ごじゅうにふん',
  53: 'ごじゅうさんぷん',
  54: 'ごじゅうよんぷん',
  55: 'ごじゅうごふん',
  56: 'ごじゅうろっぷん',
  57: 'ごじゅうななふん',
  58: 'ごじゅうはっぷん',
  59: 'ごじゅうきゅうふん',
};

// ── 秒読音 ────────────────────────────────────────────────
const NUM_KANA = [
  'ぜろ',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];
const TENS_KANA = [
  '',
  'じゅう',
  'にじゅう',
  'さんじゅう',
  'よんじゅう',
  'ごじゅう',
];

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

// ── 特殊読音セット ────────────────────────────────────────
const SOKUON_MINUTES = new Set([
  1, 3, 6, 8, 10, 11, 16, 18, 20, 21, 23, 26, 28, 30, 31, 33, 36, 38, 40, 41,
  43, 46, 48, 50, 51, 53, 56, 58,
]);

const IRREGULAR_HOURS_TIME = new Set([4, 7, 9, 14, 17, 19]);
const IRREGULAR_HOURS_DURATION = new Set([4, 9, 14, 19]);

function isSokuonMinute(m: number): boolean {
  if (m === 0) return false;
  const ones = m % 10;
  return ones === 1 || ones === 3 || ones === 6 || ones === 8 || ones === 0;
}

// ── データ構造 ────────────────────────────────────────────
interface Segment {
  kanji: string;
  kana: string;
}

interface NoteData {
  key: string;
  values?: Record<string, string | number>;
}

interface DisplayData {
  segments: Segment[];
  notes: NoteData[];
  speakText: string;
  timeRange?: string;
}

// ── 時刻モード (time) ─────────────────────────────────────
function buildTimeData(
  hour: number,
  minute: number,
  is24h: boolean
): DisplayData {
  // 特殊な時刻：真夜中
  if (hour === 0 && minute === 0) {
    return {
      segments: [{ kanji: '真夜中', kana: 'まよなか' }],
      notes: [{ key: 'clock_study.note.midnight' }],
      speakText: 'まよなか',
    };
  }
  // 特殊な時刻：正午
  if (hour === 12 && minute === 0) {
    return {
      segments: [{ kanji: '正午', kana: 'しょうご' }],
      notes: [{ key: 'clock_study.note.noon' }],
      speakText: 'しょうご',
    };
  }

  const segments: Segment[] = [];
  const notes: NoteData[] = [];

  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const isAM = hour < 12;

  // 12時間制：午前／午後
  if (!is24h) {
    segments.push({
      kanji: isAM ? '午前' : '午後',
      kana: isAM ? 'ごぜん' : 'ごご',
    });
  }

  // 時
  const hourKey = is24h ? hour : h12;
  const hourKana = HOUR_KANA[hourKey] ?? `${hourKey}じ`;
  const hourKanji = is24h ? `${hour}時` : `${h12}時`;
  segments.push({ kanji: hourKanji, kana: hourKana });

  if (IRREGULAR_HOURS_TIME.has(hourKey)) {
    notes.push({ key: `clock_study.note.hour_${hourKey}` });
  }

  // 分
  if (minute > 0) {
    const minKana = MINUTE_KANA[minute] ?? `${minute}ふん`;
    segments.push({ kanji: `${minute}分`, kana: minKana });

    if (SOKUON_MINUTES.has(minute)) {
      notes.push({ key: 'clock_study.note.sokuon', values: { minute } });
    }

    if (minute === 30) {
      notes.push({
        key: 'clock_study.note.half',
        values: { h: is24h ? hour : h12 },
      });
    }
  } else {
    notes.push({ key: 'clock_study.note.exact_hour' });
  }

  const speakText = segments.map((s) => s.kana).join('');
  return { segments, notes, speakText };
}

// ── 時長モード (duration-length) ──────────────────────────
type Axis = 'hour' | 'minute' | 'second';

function buildDurationLengthData(
  hour: number,
  minute: number,
  second: number,
  activeAxes: Set<Axis>
): DisplayData {
  const segments: Segment[] = [];
  const notes: NoteData[] = [];

  if (activeAxes.has('hour')) {
    segments.push({
      kanji: `${hour}時間`,
      kana: HOUR_DURATION_KANA[hour] ?? `${numToKana(hour)}じかん`,
    });
    if (IRREGULAR_HOURS_DURATION.has(hour)) {
      notes.push({ key: `clock_study.duration_note.hour_${hour}` });
    }
  }

  if (activeAxes.has('minute')) {
    segments.push({
      kanji: `${minute}分`,
      kana: MINUTE_KANA[minute] ?? `${numToKana(minute)}ふん`,
    });
    if (isSokuonMinute(minute)) {
      notes.push({ key: 'clock_study.note.sokuon', values: { minute } });
    }
  }

  if (activeAxes.has('second')) {
    segments.push({
      kanji: `${second}秒`,
      kana: secondKana(second),
    });
  }

  return {
    segments,
    notes,
    speakText: segments.map((s) => s.kana).join(''),
  };
}

// ── 時段モード (duration-period) ──────────────────────────
function buildPeriodData(period: TimePeriod | null): DisplayData {
  if (!period) {
    return {
      segments: [{ kanji: '—', kana: 'じかんたい' }],
      notes: [],
      speakText: '',
    };
  }

  const timeRange =
    period.start === period.end
      ? `${period.start}:00`
      : `${period.start}:00 ~ ${period.end === 0 ? 24 : period.end}:00`;

  return {
    segments: [{ kanji: period.name, kana: period.kana }],
    notes: [{ key: `clock_study.period.${period.i18nKey}` }],
    speakText: period.kana, // 传递假名而非汉字
    timeRange,
  };
}

// ── Props ─────────────────────────────────────────────────
type ClockBottomDisplayProps =
  | { mode: 'time'; hour: number; minute: number; is24h: boolean }
  | {
      mode: 'duration-length';
      hour: number;
      minute: number;
      second: number;
      activeAxes: Set<Axis>;
    }
  | {
      mode: 'duration-period';
      period: TimePeriod | null;
      onPlayPeriod: () => void;
    };

export interface ClockBottomDisplayRef {
  play: () => void;
  playSegment: (axis: 'hour' | 'minute' | 'second', value?: number) => void;
}

// ── Component ─────────────────────────────────────────────
const jaSpan = <span className="jaFont" />;

export const ClockBottomDisplay = forwardRef<
  ClockBottomDisplayRef,
  ClockBottomDisplayProps
>(function ClockBottomDisplay(props, ref) {
  const { speak } = useTTS();

  // Build display data based on mode
  let data: DisplayData;
  let contentKey: string;

  if (props.mode === 'time') {
    data = buildTimeData(props.hour, props.minute, props.is24h);
    contentKey = `time-${props.hour}-${props.minute}-${props.is24h}`;
  } else if (props.mode === 'duration-length') {
    data = buildDurationLengthData(
      props.hour,
      props.minute,
      props.second,
      props.activeAxes
    );
    const activeAxesKey = (['hour', 'minute', 'second'] as Axis[])
      .filter((a) => props.activeAxes.has(a))
      .join('');
    contentKey = `duration-length-${props.hour}-${props.minute}-${props.second}-${activeAxesKey}`;
  } else {
    data = buildPeriodData(props.period);
    contentKey = `duration-period-${props.period?.i18nKey || 'empty'}`;
  }

  // 暴露播放方法给父组件
  useImperativeHandle(
    ref,
    () => ({
      play: () => {
        if (data.speakText) {
          speak(data.speakText, { gender: 'female' });
        }
      },
      playSegment: (axis: 'hour' | 'minute' | 'second', value?: number) => {
        // value 优先：调用方可直接传入新值，避免 React 异步 setState 导致 props 还是旧值
        if (props.mode === 'time') {
          if (axis === 'hour') {
            const h = value ?? props.hour;
            const hourKey = props.is24h ? h : h % 12 === 0 ? 12 : h % 12;
            const hourKana = HOUR_KANA[hourKey] ?? `${hourKey}じ`;
            speak(hourKana, { gender: 'female' });
          } else if (axis === 'minute') {
            const m = value ?? props.minute;
            const minuteKana = MINUTE_KANA[m] ?? `${m}ふん`;
            speak(minuteKana, { gender: 'female' });
          }
        } else if (props.mode === 'duration-length') {
          if (axis === 'hour') {
            const h = value ?? props.hour;
            const hourKana = HOUR_DURATION_KANA[h] ?? `${numToKana(h)}じかん`;
            speak(hourKana, { gender: 'female' });
          } else if (axis === 'minute') {
            const m = value ?? props.minute;
            const minuteKana = MINUTE_KANA[m] ?? `${numToKana(m)}ふん`;
            speak(minuteKana, { gender: 'female' });
          } else if (axis === 'second') {
            const s = value ?? props.second;
            const secKana = secondKana(s);
            speak(secKana, { gender: 'female' });
          }
        }
      },
    }),
    [props, speak]
  );

  // Handler for speaking individual segments
  const handleSpeakSegment = useCallback(
    (segmentKana: string) => {
      speak(segmentKana, { gender: 'female' });
    },
    [speak]
  );

  // Calculate font sizes for duration-length mode
  const totalKanjiLen = data.segments.reduce(
    (sum, s) => sum + s.kanji.length,
    0
  );
  const calcFontSizes = (len: number) => {
    if (len <= 4) return { kana: 15, kanji: 40 };
    if (len <= 7) return { kana: 13, kanji: 32 };
    return { kana: 12, kanji: 26 };
  };
  const { kana: kanaSize, kanji: kanjiSize } =
    props.mode === 'duration-length'
      ? calcFontSizes(totalKanjiLen)
      : { kana: undefined, kanji: undefined };

  const hasNotes = data.notes.length > 0;

  // 只有时刻和时长模式在小屏幕需要绝对定位（浮在滚筒上方），时段模式不需要
  const needsAbsolutePosition =
    props.mode === 'time' || props.mode === 'duration-length';

  return (
    <div
      className={`${styles.wrapper} ${needsAbsolutePosition ? styles.wrapperAbsolute : ''}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={contentKey}
          className={styles.content}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* ── 时刻行：读音假名 + 汉字 + 播放按钮 ── */}
          <div
            className={`${styles.timeRow} ${!hasNotes && props.mode === 'time' ? styles.timeRowLarge : ''} ${props.mode === 'duration-length' ? styles.timeRowLarge : ''} jaFont`}
          >
            {data.segments.map((seg, i) => (
              <button
                key={i}
                className={styles.segmentButton}
                onClick={() => handleSpeakSegment(seg.kana)}
                aria-label={`読み上げ: ${seg.kana}`}
              >
                <div className={styles.segment}>
                  <span
                    className={styles.segKana}
                    style={kanaSize ? { fontSize: kanaSize } : undefined}
                  >
                    {seg.kana}
                  </span>
                  <div className={styles.kanjiWrapper}>
                    <span
                      className={styles.segKanji}
                      style={kanjiSize ? { fontSize: kanjiSize } : undefined}
                    >
                      {seg.kanji}
                    </span>
                    <Volume2 size={10} className={styles.speakerIcon} />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── 时间范围 (duration-period only) ── */}
          {data.timeRange && (
            <div className={styles.timeRange}>{data.timeRange}</div>
          )}

          {/* ── 注意事项 ── */}
          {data.notes.map((note, i) => (
            <div className="notePill" key={i}>
              <Lightbulb size={14} className="noteIcon" />
              <span className="noteText">
                <Trans
                  i18nKey={note.key}
                  values={note.values}
                  components={{ ja: jaSpan }}
                />
              </span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
