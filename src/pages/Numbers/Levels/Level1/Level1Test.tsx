// src/pages/Numbers/Levels/Level1Test.tsx
import { useState } from 'react';
import styles from './Level1Test.module.css';
import { NumberKeypad } from './NumberKeypad';

export const Level1Test = () => {
  // 这里暂时只留一个状态，等你决定测试逻辑是“听音辨数”还是“看字辨数”
  const [feedback, setFeedback] = useState('请定义测试规则');

  const handleKeyClick = (num: number) => {
    setFeedback(`你点击了: ${num} (测试逻辑待实现)`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stageContainer}>
        {/* 这里是你将来设计测试界面的地方 */}
        <div className={styles.placeholderText}>
          <h2>Test Mode</h2>
          <p>{feedback}</p>
        </div>
      </div>

      {/* 复用键盘 */}
      <NumberKeypad onKeyClick={handleKeyClick} />
    </div>
  );
};
