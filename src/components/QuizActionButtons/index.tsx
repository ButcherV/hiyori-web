import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import styles from './QuizActionButtons.module.css';

interface Props {
  onReject: () => void;
  onAccept: () => void;
  disabled?: boolean;
  className?: string;
}

export const QuizActionButtons: React.FC<Props> = ({
  onReject,
  onAccept,
  disabled = false,
  className = '',
}) => {
  const isLocked = useRef(false);
  const [activeBtn, setActiveBtn] = useState<'reject' | 'accept' | null>(null);

  useEffect(() => {
    return () => {
      isLocked.current = false; // 清理
    };
  }, []);

  const handleClick = (action: 'reject' | 'accept') => {
    // 1. 门卫拦截：如果锁住了，或者外部禁用了，直接无视
    //    此时 activeBtn 不会被设置，所以按钮纹丝不动（不会缩放）
    if (isLocked.current || disabled) return;

    // 2. 立即上逻辑锁
    isLocked.current = true;

    // 3. 触发“按下去”的视觉动画
    setActiveBtn(action);

    // 4. 执行业务逻辑
    if (action === 'reject') onReject();
    else onAccept();

    // 5. 【视觉回弹】150ms 后松手：保证第一下的动画完美播放
    setTimeout(() => {
      setActiveBtn(null);
    }, 150);

    // 6. 【逻辑解锁】600ms 后允许下一次点击
    setTimeout(() => {
      isLocked.current = false;
    }, 600);
  };

  return (
    <div className={`${styles.quizActions} ${className}`}>
      <button
        className={`
          ${styles.actionBtn} 
          ${styles.reject} 
          ${activeBtn === 'reject' ? styles.active : ''} 
        `}
        onClick={() => handleClick('reject')}
        aria-label="Reject"
      >
        <X size={32} strokeWidth={3} />
      </button>

      <button
        className={`
          ${styles.actionBtn} 
          ${styles.accept} 
          ${activeBtn === 'accept' ? styles.active : ''} 
        `}
        onClick={() => handleClick('accept')}
        aria-label="Accept"
      >
        <Check size={32} strokeWidth={3} />
      </button>
    </div>
  );
};
