import styles from './JapaneseWritingIntro.module.css';
import { useTranslation } from 'react-i18next';

const ORIGIN_SAMPLES = [
  { kanji: '阿', hira: 'あ', kata: 'ア' },
  { kanji: '以', hira: 'い', kata: 'イ' },
  { kanji: '宇', hira: 'う', kata: 'ウ' },
  { kanji: '衣', hira: 'え', kata: 'エ' },
  { kanji: '於', hira: 'お', kata: 'オ' },
];

const SYSTEMS = [
  {
    key: 'hiragana',
    script: 'ひらがな',
    count: 46,
    color: '#FF6B00',
    sample: 'あいうえお',
  },
  {
    key: 'katakana',
    script: 'カタカナ',
    count: 46,
    color: '#007AFF',
    sample: 'アイウエオ',
  },
  {
    key: 'kanji',
    script: '漢字',
    count: 2136,
    color: '#34C759',
    sample: '日本語',
  },
];

const MAX_COUNT = 2136;

export function JapaneseWritingIntro() {
  const { t } = useTranslation();

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>{t('home.writing_intro.title')}</div>

      {/* 三套文字体系 + 字数可视化 */}
      <div className={styles.systems}>
        {SYSTEMS.map((s) => (
          <div key={s.key} className={styles.systemRow}>
            <div className={styles.systemLeft}>
              <span className={`${styles.systemScript} jaFont`} style={{ color: s.color }}>
                {s.script}
              </span>
              <span className={styles.systemSample}>{s.sample}</span>
            </div>
            <div className={styles.systemRight}>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{
                    width: `${(s.count / MAX_COUNT) * 100}%`,
                    backgroundColor: s.color,
                    minWidth: s.count < MAX_COUNT ? '6px' : undefined,
                  }}
                />
              </div>
              <span className={styles.systemCount} style={{ color: s.color }}>
                {s.count.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.divider} />

      {/* 字源示例 */}
      <div className={styles.originTitle}>{t('home.writing_intro.origin_title')}</div>
      <div className={styles.originRow}>
        {ORIGIN_SAMPLES.map((o) => (
          <div key={o.kanji} className={styles.originItem}>
            <span className={`${styles.originKanji} jaFont`}>{o.kanji}</span>
            <span className={styles.originArrow}>↓</span>
            <div className={styles.originKana}>
              <span className={`${styles.originHira} jaFont`}>{o.hira}</span>
              <span className={`${styles.originKata} jaFont`}>{o.kata}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
