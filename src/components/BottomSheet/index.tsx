import React, { useEffect, useState } from 'react';
import styles from './BottomSheet.module.css';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  // 1. 控制渲染和动画
  const [shouldRender, setShouldRender] = useState(false);
  
  // 2. 监听 isOpen 处理进出场逻辑
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

  // 全局滚动锁定 (Body Scroll Lock)
  // 同时锁死 html 和 body
  useEffect(() => {
    if (shouldRender) {
      // 1. 锁死滚动
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden'; // 👈 新增这一行
      
      // 2. 禁用某些手势（慎用，如果会导致列表滑不动就删掉这句，但在 Overlay 上很有用）
      // document.body.style.touchAction = 'none'; 
    } else {
      // 恢复
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // document.body.style.touchAction = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      // document.body.style.touchAction = '';
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const animationClass = isOpen ? '' : styles.closing;

  return (
    <div 
      className={`${styles.overlay} ${animationClass}`} 
      onClick={onClose}
      // ✅ 新增：在蒙层上滑动时，直接杀掉事件，防止传递给 body
      onTouchMove={(e) => {
        // 只有当手指直接滑在 overlay 上（而不是 content 里）时才拦截
        if (e.target === e.currentTarget) {
          e.preventDefault();
        }
      }}
    >
      <div 
        className={`${styles.content} ${animationClass}`} 
        onClick={(e) => e.stopPropagation()} 
        // ✅ 恢复弹窗内部的触摸响应，否则上面的 touchAction='none' 会导致弹窗里也滑不动
        style={{ touchAction: 'auto' }}
      >
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default BottomSheet;