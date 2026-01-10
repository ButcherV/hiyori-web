import React from 'react';
import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  className,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，防止如果父容器(Row)也有点击事件时触发两次
    e.stopPropagation();
    if (onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      className={`${styles.switch} ${checked ? styles.switchOn : ''} ${className || ''}`}
      onClick={handleClick}
      role="switch"
      aria-checked={checked}
    >
      <div className={styles.switchHandle} />
    </div>
  );
};
