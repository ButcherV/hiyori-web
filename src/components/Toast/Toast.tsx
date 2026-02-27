import React, { type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import styles from './Toast.module.css';

interface ToastProps {
  isVisible: boolean;
  message: string | ReactNode;
  description?: string | ReactNode;
}

export const Toast: React.FC<ToastProps> = ({
  isVisible,
  message,
  description,
}) => {
  // 使用 Portal 将组件渲染到 document.body
  return ReactDOM.createPortal(
    <div className={styles.toastWrapper}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className={styles.iconWrapper}>
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <div className={styles.content}>
              <span className={styles.title}>{message}</span>
              {description && (
                <span className={styles.desc}>{description}</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body // 挂载目标
  );
};
