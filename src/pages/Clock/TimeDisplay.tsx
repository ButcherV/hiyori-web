import styles from './TimeDisplay.module.css';

// ── 日语读音数据 ───────────────────────────────────────────
const HOUR_READINGS: Record<number, string> = {
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
};

function getMinuteReading(m: number): string {
  const map: Record<number, string> = {
    0: 'ちょうど',
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
    30: 'はん',
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
  return map[m] ?? `${m}ふん`;
}

function getTimePeriod(h: number) {
  if (h === 0) return { kanji: '真夜中', kana: 'まよなか' };
  if (h < 4) return { kanji: '深夜', kana: 'しんや' };
  if (h < 6) return { kanji: '早朝', kana: 'そうちょう' };
  if (h < 10) return { kanji: '朝', kana: 'あさ' };
  if (h < 14) return { kanji: '昼', kana: 'ひる' };
  if (h < 17) return { kanji: '午後', kana: 'ごご' };
  if (h < 19) return { kanji: '夕方', kana: 'ゆうがた' };
  if (h < 23) return { kanji: '夜', kana: 'よる' };
  return { kanji: '深夜', kana: 'しんや' };
}

function buildDisplay(hour: number, minute: number, is24h: boolean) {
  if (hour === 0 && minute === 0)
    return { main: '真夜中', kana: 'まよなか', note: '零時（れいじ）ちょうど' };
  if (hour === 12 && minute === 0)
    return { main: '正午', kana: 'しょうご', note: null };

  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const isAM = hour < 12;
  const ampm = isAM ? '午前' : '午後';
  const ampmKana = isAM ? 'ごぜん' : 'ごご';
  const hourKana = HOUR_READINGS[h12] ?? `${h12}じ`;
  const minKana = getMinuteReading(minute);
  const minKanji =
    minute === 0 ? 'ちょうど' : minute === 30 ? '半' : `${minute}分`;
  const period = getTimePeriod(hour);

  if (is24h) {
    const hh = String(hour).padStart(2, '0');
    const mm = String(minute).padStart(2, '0');
    return {
      main: `${hh}:${mm}`,
      kana: `${hourKana}${minKana}`,
      note: `${ampm}${h12}時${minKanji}`,
    };
  }

  return {
    main: `${ampm} ${h12}時${minKanji}`,
    kana: `${ampmKana} ${hourKana}${minKana}`,
    note:
      period.kanji !== '午後' && period.kanji !== '午前' ? period.kanji : null,
  };
}

// ── TimeDisplay 组件 ──────────────────────────────────────
interface TimeDisplayProps {
  hour: number;
  minute: number;
  is24h: boolean;
}

export function TimeDisplay({ hour, minute, is24h }: TimeDisplayProps) {
  const display = buildDisplay(hour, minute, is24h);

  return (
    <div className={styles.wrapper}>
      {!is24h && (
        <div className={styles.ampm}>
          <span className={styles.ampmKanji}>
            {hour < 12 ? '午前' : '午後'}
          </span>
          <span className={styles.ampmKana}>
            {hour < 12 ? 'ごぜん' : 'ごご'}
          </span>
        </div>
      )}
      <div className={styles.display} key={`${hour}-${minute}-${is24h}`}>
        <div className={styles.mainText}>{display.main}</div>
        <div className={styles.kanaText}>{display.kana}</div>
        {display.note && (
          <div className={styles.noteText}>{display.note}</div>
        )}
      </div>
    </div>
  );
}
