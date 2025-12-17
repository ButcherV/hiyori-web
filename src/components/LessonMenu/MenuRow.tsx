import React from 'react';
import { Check, Play, ChevronRight } from 'lucide-react';
import styles from './LessonMenu.module.css';
// ✅ 从 types 文件引入接口
import type { LessonItem, LessonStatus } from './types'; 

interface MenuRowProps {
  item: LessonItem;
  status: LessonStatus;
  onClick: () => void;
}

export const MenuRow: React.FC<MenuRowProps> = ({ item, status, onClick }) => {
  // ... (下面的代码完全不用动)
  const className = `${styles.rowItem} ${styles[status]}`;

  return (
    <div className={className} onClick={onClick}>
      <div className={styles.info}>
        <div className={styles.title}>{item.title}</div>
        <div className={styles.subtitle}>{item.preview}</div>
      </div>
      <div className={styles.iconBox}>
        {status === 'mastered' && <Check size={18} strokeWidth={3} />}
        {status === 'current' && <Play size={16} fill="currentColor" />}
        {status === 'new' && <ChevronRight size={20} />} 
      </div>
    </div>
  );
};