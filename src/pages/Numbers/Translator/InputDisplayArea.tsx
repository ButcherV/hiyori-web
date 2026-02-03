import React from 'react';
import { Volume2 } from 'lucide-react';
import styles from './InputDisplayArea.module.css';

interface Props {
  inputVal: string;
  onPlayAudio: () => void;
}

export const InputDisplayArea: React.FC<Props> = ({
  inputVal,
  onPlayAudio,
}) => {
  // 1. 西方格式 (标准三位分节): 12,345,678
  const westernFormat = inputVal
    ? parseInt(inputVal).toLocaleString('en-US')
    : '0';

  // 2. 🟢 新增：日式格式 (四位分节): 1234 5678
  // 正则解释：\B 匹配非单词边界，(?=(\d{4})+(?!\d)) 查找后面跟着 4 的倍数个数字的位置
  const japaneseFormat = inputVal
    ? inputVal.replace(/\B(?=(\d{4})+(?!\d))/g, ' ')
    : '0';

  // 动态字号逻辑 (保持不变)
  const getFontSizeClass = () => {
    const len = inputVal.length;
    if (len > 11) return styles.fontSmall;
    if (len > 8) return styles.fontMedium;
    return styles.fontLarge;
  };

  return (
    <div className={styles.inputDisplayArea}>
      <div className={styles.inputActions}>
        {inputVal && (
          <div className={styles.inputActionBtn} onClick={onPlayAudio}>
            <Volume2 size={20} />
          </div>
        )}
      </div>
      <div className={styles.numberWrapper}>
        {/* 🟢 主显示：使用日式四位分节，方便阅读 */}
        <div className={`${styles.arabicNum} ${getFontSizeClass()}`}>
          {japaneseFormat}
        </div>

        {/* 辅助显示：保留西方格式，作为对照 */}
        <div className={styles.westernHint}>Western: {westernFormat}</div>
      </div>
    </div>
  );
};
