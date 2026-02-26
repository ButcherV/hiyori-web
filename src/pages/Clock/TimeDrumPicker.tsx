import { useState, useCallback } from 'react';
import { Drum } from './Drum';
import { TimeFormatToggle } from './TimeFormatToggle';
import { TimeDisplay } from './TimeDisplay';
import styles from './TimeDrumPicker.module.css';

export function TimeDrumPicker() {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(30);
  const [is24h, setIs24h] = useState(true);

  const hourIdx12 = hour % 12;

  const setHourFrom12 = useCallback(
    (idx: number) => {
      const h12 = idx === 0 ? 12 : idx;
      const wasAM = hour < 12;
      setHour(wasAM ? (h12 === 12 ? 0 : h12) : h12 === 12 ? 12 : h12 + 12);
    },
    [hour]
  );

  const fmtPad2 = useCallback((v: number) => String(v).padStart(2, '0'), []);
  const fmt12h = useCallback(
    (v: number) => (v === 0 ? '12' : String(v).padStart(2, '0')),
    []
  );

  return (
    <>
      <TimeFormatToggle is24h={is24h} onChange={setIs24h} />

      <div className={styles.drums}>
        <div className={styles.selectionBox} />
        {is24h ? (
          <Drum
            key="h24"
            physCount={24}
            valueRange={24}
            selected={hour}
            formatLabel={fmtPad2}
            onSelect={setHour}
            side="left"
          />
        ) : (
          <Drum
            key="h12"
            physCount={24}
            valueRange={12}
            selected={hourIdx12}
            formatLabel={fmt12h}
            onSelect={setHourFrom12}
            side="left"
          />
        )}
        <Drum
          physCount={24}
          valueRange={60}
          selected={minute}
          formatLabel={fmtPad2}
          onSelect={setMinute}
          side="right"
        />
      </div>

      <TimeDisplay hour={hour} minute={minute} is24h={is24h} />
    </>
  );
}
