import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import styles from './QuizActionButtons.module.css';

interface Props {
  onReject: () => void;
  onAccept: () => void;
  disabled?: boolean;
  className?: string; // 允許父組件傳入額外樣式類名（比如微調位置）
}

export const QuizActionButtons: React.FC<Props> = ({
  onReject,
  onAccept,
  disabled = false,
  className = '',
}) => {
  const [isLocked, setIsLocked] = useState(false);

  // 當組件卸載時，確保清理定時器（防止內存洩漏或狀態更新報錯）
  useEffect(() => {
    return () => {
      setIsLocked(false);
    };
  }, []);

  const handleClick = (action: 'reject' | 'accept') => {
    if (isLocked || disabled) return;

    setIsLocked(true);

    if (action === 'reject') onReject();
    else onAccept();

    // 400ms 冷卻時間
    setTimeout(() => {
      setIsLocked(false);
    }, 600);
  };

  const isBtnDisabled = isLocked || disabled;

  return (
    <div className={`${styles.quizActions} ${className}`}>
      <button
        className={`${styles.actionBtn} ${styles.reject}`}
        onClick={() => handleClick('reject')}
        disabled={isBtnDisabled}
        style={{ opacity: isBtnDisabled ? 0.6 : 1 }}
        aria-label="Reject"
      >
        <X size={32} strokeWidth={3} />
      </button>

      <button
        className={`${styles.actionBtn} ${styles.accept}`}
        onClick={() => handleClick('accept')}
        disabled={isBtnDisabled}
        style={{ opacity: isBtnDisabled ? 0.6 : 1 }}
        aria-label="Accept"
      >
        <Check size={32} strokeWidth={3} />
      </button>
    </div>
  );
};
