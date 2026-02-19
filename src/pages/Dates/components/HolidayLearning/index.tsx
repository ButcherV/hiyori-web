// src/pages/Dates/components/HolidayLearning/index.tsx

import React from 'react';
import { HolidayCard } from './HolidayCard';
import { getJapaneseHoliday } from '../../../../utils/dateHelper';
import { getHolidayItem, getCustomHolidayName } from '../../Datas/holidayData';

interface HolidayLearningProps {
  selectedDate: Date;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '12px 16px 24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  WebkitOverflowScrolling: 'touch',
};

const emptyStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '32px 0',
  fontSize: 14,
  color: '#94a3b8',
};

export const HolidayLearning: React.FC<HolidayLearningProps> = ({
  selectedDate,
}) => {
  const holidayName =
    getJapaneseHoliday(selectedDate) ?? getCustomHolidayName(selectedDate);
  const item = holidayName ? getHolidayItem(holidayName) : undefined;

  if (!item) {
    return (
      <div style={containerStyle}>
        <div style={emptyStyle}>请在日历中选择一个节日</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <HolidayCard item={item} selectedDate={selectedDate} />
    </div>
  );
};
