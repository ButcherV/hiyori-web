import { useCallback } from 'react';
import { Volume2, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './TimeDisplay.module.css';

// ── 时读音数据 ────────────────────────────────────────────
const HOUR_KANA: Record<number, string> = {
  0: 'れいじ',
  1: 'いちじ',   2: 'にじ',       3: 'さんじ',
  4: 'よじ',     5: 'ごじ',       6: 'ろくじ',
  7: 'しちじ',   8: 'はちじ',     9: 'くじ',
  10: 'じゅうじ', 11: 'じゅういちじ', 12: 'じゅうにじ',
  13: 'じゅうさんじ', 14: 'じゅうよじ',   15: 'じゅうごじ',
  16: 'じゅうろくじ', 17: 'じゅうしちじ', 18: 'じゅうはちじ',
  19: 'じゅうくじ',   20: 'にじゅうじ',   21: 'にじゅういちじ',
  22: 'にじゅうにじ', 23: 'にじゅうさんじ',
};

// ── 分读音数据 ────────────────────────────────────────────
const MINUTE_KANA: Record<number, string> = {
  1: 'いっぷん',     2: 'にふん',       3: 'さんぷん',
  4: 'よんぷん',     5: 'ごふん',       6: 'ろっぷん',
  7: 'ななふん',     8: 'はっぷん',     9: 'きゅうふん',
  10: 'じゅっぷん',  11: 'じゅういっぷん', 12: 'じゅうにふん',
  13: 'じゅうさんぷん', 14: 'じゅうよんぷん', 15: 'じゅうごふん',
  16: 'じゅうろっぷん', 17: 'じゅうななふん', 18: 'じゅうはっぷん',
  19: 'じゅうきゅうふん', 20: 'にじゅっぷん',  21: 'にじゅういっぷん',
  22: 'にじゅうにふん',  23: 'にじゅうさんぷん', 24: 'にじゅうよんぷん',
  25: 'にじゅうごふん', 26: 'にじゅうろっぷん', 27: 'にじゅうななふん',
  28: 'にじゅうはっぷん', 29: 'にじゅうきゅうふん', 30: 'さんじゅっぷん',
  31: 'さんじゅういっぷん', 32: 'さんじゅうにふん', 33: 'さんじゅうさんぷん',
  34: 'さんじゅうよんぷん', 35: 'さんじゅうごふん', 36: 'さんじゅうろっぷん',
  37: 'さんじゅうななふん', 38: 'さんじゅうはっぷん', 39: 'さんじゅうきゅうふん',
  40: 'よんじゅっぷん',  41: 'よんじゅういっぷん', 42: 'よんじゅうにふん',
  43: 'よんじゅうさんぷん', 44: 'よんじゅうよんぷん', 45: 'よんじゅうごふん',
  46: 'よんじゅうろっぷん', 47: 'よんじゅうななふん', 48: 'よんじゅうはっぷん',
  49: 'よんじゅうきゅうふん', 50: 'ごじゅっぷん',  51: 'ごじゅういっぷん',
  52: 'ごじゅうにふん',  53: 'ごじゅうさんぷん', 54: 'ごじゅうよんぷん',
  55: 'ごじゅうごふん',  56: 'ごじゅうろっぷん', 57: 'ごじゅうななふん',
  58: 'ごじゅうはっぷん', 59: 'ごじゅうきゅうふん',
};

function getIrregularHourNote(hour: number, lang: string): string | null {
  const notes: Record<number, Record<string, string>> = {
    4: {
      zh: '注意：读作「よじ」，不是「よんじ」',
      'zh-Hant': '注意：讀作「よじ」，不是「よんじ」',
      en: 'Note: Pronounced "yoji", not "yonji"',
    },
    9: {
      zh: '注意：读作「くじ」，不是「きゅうじ」',
      'zh-Hant': '注意：讀作「くじ」，不是「きゅうじ」',
      en: 'Note: Pronounced "kuji", not "kyūji"',
    },
    14: {
      zh: '注意：读作「じゅうよじ」，不是「じゅうよんじ」',
      'zh-Hant': '注意：讀作「じゅうよじ」，不是「じゅうよんじ」',
      en: 'Note: Pronounced "jūyoji", not "jūyonji"',
    },
    19: {
      zh: '注意：读作「じゅうくじ」，不是「じゅうきゅうじ」',
      'zh-Hant': '注意：讀作「じゅうくじ」，不是「じゅうきゅうじ」',
      en: 'Note: Pronounced "jūkuji", not "jūkyūji"',
    },
  };
  return notes[hour]?.[lang] ?? notes[hour]?.['en'] ?? null;
}

function getIrregularMinuteNote(minute: number, lang: string): string | null {
  const sokuonMinutes = [1, 3, 6, 8, 10, 11, 16, 18, 20, 21, 23, 26, 28, 30, 31, 33, 36, 38, 40, 41, 43, 46, 48, 50, 51, 53, 56, 58];
  if (!sokuonMinutes.includes(minute)) return null;
  const notes: Record<string, string> = {
    zh: '注意：促音化，读作「ぷん」',
    'zh-Hant': '注意：促音化，讀作「ぷん」',
    en: 'Sokuon: っぷん — the small っ doubles the next consonant',
  };
  return notes[lang] ?? notes['en'];
}

function getHalfNote(hour: number, is24h: boolean, lang: string): string {
  const h = is24h ? hour : (hour > 12 ? hour - 12 : hour === 0 ? 12 : hour);
  const notes: Record<string, string> = {
    zh: `也可以说「${h}時半（はん）」`,
    'zh-Hant': `也可以說「${h}時半（はん）」`,
    en: `Can also say "${h}時半 (han)"`,
  };
  return notes[lang] ?? notes['en'];
}

function getExactHourNote(lang: string): string {
  const notes: Record<string, string> = {
    zh: '也可以说「ちょうど（丁度）」',
    'zh-Hant': '也可以說「ちょうど（丁度）」',
    en: 'Can also say "chōdo" (exactly)',
  };
  return notes[lang] ?? notes['en'];
}

function getMidnightNote(lang: string): string {
  const notes: Record<string, string> = {
    zh: '也可以说「零時（れいじ）ちょうど」',
    'zh-Hant': '也可以說「零時（れいじ）ちょうど」',
    en: 'Can also say "reiji chōdo" (0:00)',
  };
  return notes[lang] ?? notes['en'];
}

function getNoonNote(lang: string): string {
  const notes: Record<string, string> = {
    zh: '也可以说「十二時（じゅうにじ）ちょうど」',
    'zh-Hant': '也可以說「十二時（じゅうにじ）ちょうど」',
    en: 'Can also say "jūniji chōdo" (12:00)',
  };
  return notes[lang] ?? notes['en'];
}

interface Segment {
  kanji: string;
  kana: string;
}

interface DisplayData {
  segments: Segment[];
  notes: string[];
  speakText: string;
}

function buildDisplayData(
  hour: number,
  minute: number,
  is24h: boolean,
  lang: string
): DisplayData {
  if (hour === 0 && minute === 0) {
    return {
      segments: [{ kanji: '真夜中', kana: 'まよなか' }],
      notes: [getMidnightNote(lang)],
      speakText: 'まよなか',
    };
  }
  if (hour === 12 && minute === 0) {
    return {
      segments: [{ kanji: '正午', kana: 'しょうご' }],
      notes: [getNoonNote(lang)],
      speakText: 'しょうご',
    };
  }

  const segments: Segment[] = [];
  const notes: string[] = [];

  const h12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  const isAM = hour < 12;

  if (!is24h) {
    segments.push({
      kanji: isAM ? '午前' : '午後',
      kana: isAM ? 'ごぜん' : 'ごご',
    });
  }

  const hourKey = is24h ? hour : h12;
  const hourKana = HOUR_KANA[hourKey] ?? `${hourKey}じ`;
  const hourKanji = is24h ? `${hour}時` : `${h12}時`;
  segments.push({ kanji: hourKanji, kana: hourKana });

  const irregularNote = getIrregularHourNote(hourKey, lang);
  if (irregularNote) notes.push(irregularNote);

  if (minute > 0) {
    const minKana = MINUTE_KANA[minute] ?? `${minute}ふん`;
    segments.push({ kanji: `${minute}分`, kana: minKana });

    if (minute === 30) notes.push(getHalfNote(hour, is24h, lang));

    const irregularMinNote = getIrregularMinuteNote(minute, lang);
    if (irregularMinNote) notes.push(irregularMinNote);
  } else {
    notes.push(getExactHourNote(lang));
  }

  const speakText = segments.map((s) => s.kana).join('');
  return { segments, notes, speakText };
}

interface TimeDisplayProps {
  hour: number;
  minute: number;
  is24h: boolean;
}

export function TimeDisplay({ hour, minute, is24h }: TimeDisplayProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const data = buildDisplayData(hour, minute, is24h, lang);

  const handleSpeak = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    const utt = new SpeechSynthesisUtterance(data.speakText);
    utt.lang = 'ja-JP';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utt);
  }, [data.speakText]);

  // 使用 hour-minute-is24h 作为 key，确保内容变化时触发动画
  const contentKey = `${hour}-${minute}-${is24h}`;

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} key={contentKey}>
        {/* ── Furigana Row ── */}
        <div className={styles.timeRow}>
          {data.segments.map((seg, i) => (
            <div className={styles.segment} key={i}>
              <span className={styles.segKana}>{seg.kana}</span>
              <span className={styles.segKanji}>{seg.kanji}</span>
            </div>
          ))}
          <button
            className={styles.speakerBtn}
            onClick={handleSpeak}
            aria-label="読み上げ"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* ── Notes ── */}
        {data.notes.map((note, i) => (
          <div className={styles.note} key={i}>
            <Info size={16} className={styles.noteIcon} />
            <span className={styles.noteText}>{note}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
