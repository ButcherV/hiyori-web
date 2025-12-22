import React from 'react';
import { motion } from 'framer-motion';
import styles from './CategoryTabs.module.css';

export interface TabOption {
  id: string;
  label: string;
  [key: string]: any;
}

interface CategoryTabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  renderTab?: (item: TabOption, isActive: boolean) => React.ReactNode;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  options,
  activeId,
  onChange,
  renderTab,
}) => {
  return (
    <div className={styles.container}>
      {options.map((item) => {
        const isActive = activeId === item.id;

        return (
          <button
            key={item.id}
            className={`${styles.tabBtn} ${isActive ? styles.active : ''}`}
            onClick={() => onChange(item.id)}
          >
            {isActive && (
              <motion.div
                className={styles.activeBackground}
                layoutId="active-pill" // 只要 ID 一样，它就会自动从上一个位置滑过来
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            {/* 内容层：加个 relative 和 z-index，保证文字在滑块上面 */}
            <div className={styles.contentContainer}>
              {renderTab ? (
                renderTab(item, isActive)
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
