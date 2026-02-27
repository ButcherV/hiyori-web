import { useCallback } from 'react';
import { Volume2, Info } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './TimeDisplay.module.css';

// ── 時読音データ ──────────────────────────────────────────
const HOUR_KANA: Record<number, string> = {
  0: 'れいじ',
  1: 'いちじ',   2: 'にじ',         3: 'さんじ',
  4: 'よじ',     5: 'ごじ',         6: 'ろくじ',
  7: 'しちじ',   8: 'はちじ',       9: 'くじ',
  10: 'じゅうじ', 11: 'じゅういちじ', 12: 'じゅうにじ',
  13: 'じゅうさんじ', 14: 'じゅうよじ',   15: 'じゅうごじ',
  16: 'じゅうろくじ', 17: 'じゅうしちじ', 18: 'じゅうはちじ',
  19: 'じゅうくじ',   20: 'にじゅうじ',   21: 'にじゅういちじ',
  22: 'にじゅうにじ', 23: 'にじゅうさんじ',
};

// ── 分読音データ ──────────────────────────────────────────
const MINUTE_KANA: Record<number, string> = {
  1: 'いっぷん',     2: 'にふん',         3: 'さんぷん',
  4: 'よんぷん',     5: 'ごふん',         6: 'ろっぷん',
  7: 'ななふん',     8: 'はっぷん',       9: 'きゅうふん',
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

const SOKUON_MINUTES = new Set([
  1, 3, 6, 8, 10,
  11, 16, 18, 20, 21, 23, 26, 28, 30,
  31, 33, 36, 38, 40, 41, 43, 46, 48, 50,
  51, 53, 56, 58,
]);

const IRREGULAR_HOURS = new Set([4, 7, 9, 14, 17, 19]);

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
}

// ── 表示データの構築 ──────────────────────────────────────
function buildDisplayData(hour: number, minute: number, is24h: boolean): DisplayData {
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

  if (IRREGULAR_HOURS.has(hourKey)) {
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
      notes.push({ key: 'clock_study.note.half', values: { h: is24h ? hour : h12 } });
    }
  } else {
    notes.push({ key: 'clock_study.note.exact_hour' });
  }

  const speakText = segments.map((s) => s.kana).join('');
  return { segments, notes, speakText };
}

// ── コンポーネント ────────────────────────────────────────
interface TimeDisplayProps {
  hour: number;
  minute: number;
  is24h: boolean;
}

const jaSpan = <span className="jaFont" />;

export function TimeDisplay({ hour, minute, is24h }: TimeDisplayProps) {
  useTranslation(); // subscribe to language changes
  const data = buildDisplayData(hour, minute, is24h);

  const handleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window) || !data.speakText) return;
    const utt = new SpeechSynthesisUtterance(data.speakText);
    utt.lang = 'ja-JP';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }, [data.speakText]);

  // 用于 AnimatePresence 的唯一 key
  const contentKey = `${hour}-${minute}-${is24h}`;
  const hasNotes = data.notes.length > 0;

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
          {/* ── 时刻行：读音假名 + 汉字 + 播放按钮 ── */}
          <div className={`${styles.timeRow} ${!hasNotes ? styles.timeRowLarge : ''} jaFont`}>
            {data.segments.map((seg, i) => (
              <div className={styles.segment} key={i}>
                <span className={styles.segKana}>{seg.kana}</span>
                <span className={styles.segKanji}>{seg.kanji}</span>
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

          {/* ── 注意事项 ── */}
          {data.notes.map((note, i) => (
            <div className={styles.note} key={i}>
              <Info size={16} className={styles.noteIcon} />
              <div className={styles.noteContent}>
                <span className={styles.noteText}>
                  <Trans
                    i18nKey={note.key}
                    values={note.values}
                    components={{ ja: jaSpan }}
                  />
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
