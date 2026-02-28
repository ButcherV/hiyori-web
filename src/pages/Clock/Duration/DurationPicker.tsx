import { useState } from 'react';
import { useTTS } from '../../../hooks/useTTS';
import { TIME_PERIODS, type TimePeriod } from './types';
import { PeriodChips } from './PeriodChips';
import { CircularPicker } from './CircularPicker';
import { PeriodInfo } from './PeriodInfo';
import styles from './DurationPicker.module.css';

export function DurationPicker() {
  const { speak } = useTTS();
  
  const [startAngle, setStartAngle] = useState(270);
  const [endAngle, setEndAngle] = useState(360);
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod | null>(null);

  const setTimePeriod = (period: TimePeriod) => {
    // 将小时转换为角度 (270度 = 0时, 每小时15度)
    const startAngle = (270 + period.start * 15) % 360;
    let endAngle = (270 + period.end * 15) % 360;
    
    // 处理跨越午夜的情况
    if (period.end === 0) {
      endAngle = 270; // 0时 = 270度
    }
    
    setStartAngle(startAngle);
    setEndAngle(endAngle);
    setSelectedPeriod(period);
  };

  const playPeriodName = () => {
    if (selectedPeriod) {
      speak(selectedPeriod.name);
    }
  };

  // 计算时间差和格式化文本
  const getDurationText = () => {
    const s = Math.round(startAngle / 2.5) * 2.5;
    const e = Math.round(endAngle / 2.5) * 2.5;
    let diff = e - s;
    if (diff < 0) diff += 360;

    const diffHours = diff / 15;
    const h = Math.floor(diffHours);
    const m = Math.round((diffHours - h) * 60);
    
    if (m === 60) {
      return `${h + 1} h`;
    }
    return m > 0 ? `${h} h ${m} m` : `${h} h`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollArea}>
        <PeriodChips
          periods={TIME_PERIODS}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={setTimePeriod}
        />

        <CircularPicker
          startAngle={startAngle}
          endAngle={endAngle}
          selectedPeriod={selectedPeriod}
          onStartAngleChange={setStartAngle}
          onEndAngleChange={setEndAngle}
          onPlayPeriod={playPeriodName}
        />
      </div>

      <PeriodInfo
        selectedPeriod={selectedPeriod}
        durationText={getDurationText()}
        onPlayPeriod={playPeriodName}
      />
    </div>
  );
}