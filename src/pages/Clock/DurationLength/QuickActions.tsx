import styles from './QuickActions.module.css';

type Axis = 'hour' | 'minute' | 'second';

interface QuickActionsProps {
  activeAxes: Set<Axis>;
  onToggleAxis: (axis: Axis) => void;
}

const AXIS_LABELS: Record<Axis, string> = {
  hour: '時間',
  minute: '分',
  second: '秒',
};

export function QuickActions({ activeAxes, onToggleAxis }: QuickActionsProps) {
  const axes: Axis[] = ['hour', 'minute', 'second'];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {axes.map((axis) => (
          <button
            key={axis}
            className={`${styles.chip} ${activeAxes.has(axis) ? styles.chipActive : styles.chipInactive} jaFont`}
            onClick={() => {
              if (activeAxes.has(axis) && activeAxes.size === 1) return;
              onToggleAxis(axis);
            }}
          >
            {AXIS_LABELS[axis]}
          </button>
        ))}
      </div>
    </div>
  );
}
