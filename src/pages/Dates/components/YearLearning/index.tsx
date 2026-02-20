// src/pages/Dates/components/YearLearning/index.tsx

import React, { useEffect, useRef } from 'react';
import { useTTS } from '../../../../hooks/useTTS';
import { getEraItem } from '../../Datas/EraData';
import { EraCard } from './EraCard';

interface YearLearningProps {
  activeEraKey: string;
  onEraSelect: (key: string) => void;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '4px 16px 24px',
  boxSizing: 'border-box',
  WebkitOverflowScrolling: 'touch',
};

export const YearLearning: React.FC<YearLearningProps> = ({ activeEraKey }) => {
  const { speak } = useTTS();
  const audioEnabledRef = useRef(false);

  // Silence period on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      audioEnabledRef.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Play audio when era changes
  useEffect(() => {
    if (audioEnabledRef.current) {
      const item = getEraItem(activeEraKey);
      if (item) speak(item.kana);
    }
  }, [activeEraKey, speak]);

  const item = getEraItem(activeEraKey);
  if (!item) return null;

  return (
    <div style={containerStyle}>
      <EraCard item={item} />
    </div>
  );
};
