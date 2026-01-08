import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './BottomSheet.module.css';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // 等待动画结束
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // 全局滚动锁定 (Body Scroll Lock)，同时锁死 html 和 body
  useEffect(() => {
    if (shouldRender) {
      // 锁死 body 会导致其他 sticky 的组件出问题
      // document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // 恢复
      // document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const animationClass = isOpen ? '' : styles.closing;

  const content = (
    <div className={`${styles.overlay} ${animationClass}`} onClick={onClose}>
      <div
        className={`${styles.content} ${animationClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
  return createPortal(content, document.body);
};

export default BottomSheet;
