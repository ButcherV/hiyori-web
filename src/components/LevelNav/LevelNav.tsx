import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './LevelNav.module.css';

export interface LevelNavItem {
  id: string;
  label: string;
}

interface LevelNavProps {
  items: LevelNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string; // 允许外部传入样式微调（比如 margin）
}

export const LevelNav: React.FC<LevelNavProps> = ({
  items,
  activeId,
  onSelect,
  className = '',
}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // 自动滚动居中逻辑
  useEffect(() => {
    const container = navRef.current;
    const targetItem = itemsRef.current.get(activeId);

    if (container && targetItem) {
      // 计算目标位置：(元素左偏移 + 元素一半宽) - (容器一半宽)
      const targetLeft =
        targetItem.offsetLeft +
        targetItem.offsetWidth / 2 -
        container.offsetWidth / 2;

      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
  }, [activeId]); // 只要 activeId 变了就触发

  return (
    <div className={`${styles.container} ${className}`} ref={navRef}>
      {items.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) itemsRef.current.set(item.id, el);
              else itemsRef.current.delete(item.id);
            }}
            className={`${styles.pillBtn} ${
              isActive ? styles.pillActive : styles.pillDefault
            }`}
            onClick={() => onSelect(item.id)}
          >
            <span className={styles.pillText}>{item.label}</span>

            {isActive && (
              <motion.div
                className={styles.activeBackground}
                layoutId="levelNavActiveBg" // 只要在同一个 LevelNav 实例内唯一即可
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
