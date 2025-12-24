// src/components/Flipper/Flipper.tsx

import React, { useState, useEffect } from 'react';
import styles from './Flipper.module.css';

interface FlipperProps {
  frontText: string;
  backText: string;
  interval?: number;

  // 🔥 修改点：拆分样式 Props
  className?: string; // 1. 容器样式 (用于定位、布局、公用的字号颜色)
  frontClassName?: string; // 2. 正面样式 (专门传 styles.japaneseTitle)
  backClassName?: string; // 3. 背面样式 (专门传中文/英文样式，可选)
}

const Flipper: React.FC<FlipperProps> = ({
  frontText,
  backText,
  interval = 5000,
  className = '',
  frontClassName = '',
  backClassName = '',
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsFlipped((prev) => !prev);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    // 外层容器：接收 className (处理位置、大小)
    <div className={`${styles.flipperContainer} ${className}`}>
      <div
        className={`${styles.flipperContent} ${isFlipped ? styles.flipped : ''}`}
      >
        {/* 正面：接收 frontClassName (处理日语字体) */}
        <div
          className={`${styles.flipperFace} ${styles.flipperFront} ${frontClassName}`}
        >
          {frontText}
        </div>

        {/* 背面：接收 backClassName (处理本地化字体) */}
        <div
          className={`${styles.flipperFace} ${styles.flipperBack} ${backClassName}`}
        >
          {backText}
        </div>
      </div>
    </div>
  );
};

export default Flipper;
