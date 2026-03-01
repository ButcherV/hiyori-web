import { useTranslation } from 'react-i18next';
import styles from './QuickActions.module.css';

type Axis = 'hour' | 'minute' | 'second';

interface QuickActionsProps {
  activeAxes: Set<Axis>;
  onToggleAxis: (axis: Axis) => void;
}

const AXIS_DATA: Record<Axis, { kanji: string; kana: string; i18nKey: string }> = {
  hour: { kanji: '時間', kana: 'じかん', i18nKey: 'clock_study.duration_axis.hour' },
  minute: { kanji: '分', kana: 'ふん', i18nKey: 'clock_study.duration_axis.minute' },
  second: { kanji: '秒', kana: 'びょう', i18nKey: 'clock_study.duration_axis.second' },
};

export function QuickActions({ activeAxes, onToggleAxis }: QuickActionsProps) {
  const { t } = useTranslation();
  const axes: Axis[] = ['hour', 'minute', 'second'];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {axes.map((axis) => {
          const data = AXIS_DATA[axis];
          return (
            <button
              key={axis}
              className={`${styles.chip} ${activeAxes.has(axis) ? styles.chipActive : styles.chipInactive}`}
              onClick={() => {
                if (activeAxes.has(axis) && activeAxes.size === 1) return;
                onToggleAxis(axis);
              }}
            >
              <div className={styles.chipContent}>
                <span className={`${styles.kana} jaFont`}>{data.kana}</span>
                <span className={`${styles.kanji} jaFont`}>{data.kanji}</span>
                <span className={styles.translation}>{t(data.i18nKey)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
