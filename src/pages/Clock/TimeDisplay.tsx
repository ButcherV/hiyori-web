import { useCallback } from 'react';
import { Volume2 } from 'lucide-react';
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

// 读音不规则的时（需要提示）
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

// ── 数据结构 ──────────────────────────────────────────────
interface Segment {
  kanji: string;
  kana: string;
}

interface DisplayData {
  segments: Segment[];
  notes: string[];
  speakText: string;
}

// ── 构建展示数据 ──────────────────────────────────────────
function buildDisplayData(
  hour: number,
  minute: number,
  is24h: boolean,
  lang: string
): DisplayData {
  // 特殊：真夜中
  if (hour === 0 && minute === 0) {
    return {
      segments: [{ kanji: '真夜中', kana: 'まよなか' }],
      notes: [getMidnightNote(lang)],
      speakText: 'まよなか',
    };
  }
  // 特殊：正午
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

  // 午前／午後（12h 模式）
  if (!is24h) {
    segments.push({
      kanji: isAM ? '午前' : '午後',
      kana: isAM ? 'ごぜん' : 'ごご',
    });
  }

  // 时
  const hourKey = is24h ? hour : h12;
  const hourKana = HOUR_KANA[hourKey] ?? `${hourKey}じ`;
  const hourKanji = is24h ? `${hour}時` : `${h12}時`;
  segments.push({ kanji: hourKanji, kana: hourKana });
  
  const irregularNote = getIrregularHourNote(hourKey, lang);
  if (irregularNote) {
    notes.push(irregularNote);
  }

  // 分
  if (minute > 0) {
    const minKana = MINUTE_KANA[minute] ?? `${minute}ふん`;
    segments.push({ kanji: `${minute}分`, kana: minKana });
    if (minute === 30) {
      notes.push(getHalfNote(hour, is24h, lang));
    }
  } else {
    notes.push(getExactHourNote(lang));
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

  return (
    <div className={styles.wrapper}>
      <div className={styles.animated} key={`${hour}-${minute}-${is24h}`}>
        {/* ── 主行：汉字 + 假名 + 喇叭 ── */}
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

        {/* ── 特殊提示 ── */}
        {data.notes.map((note, i) => (
          <div className={styles.note} key={i}>
            {note}
          </div>
        ))}
      </div>
    </div>
  );
}
