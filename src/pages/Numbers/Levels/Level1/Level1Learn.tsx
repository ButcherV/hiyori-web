import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../../../hooks/useTTS';
import { LEVEL_1_DATA } from './Level1Data';
import styles from './Level1Learn.module.css';
import { NumberKeypad } from './NumberKeypad';

interface Level1LearnProps {
  initialNum?: number | null;
}

export const Level1Learn: React.FC<Level1LearnProps> = ({ initialNum }) => {
  const { speak } = useTTS();

  // 如果有 initialNum，就用它初始化；否则归零
  const [currentNum, setCurrentNum] = useState(initialNum ?? 0);

  // 监听 props 变化，确保从 Test 跳回来时能立即更新
  useEffect(() => {
    if (typeof initialNum === 'number') {
      setCurrentNum(initialNum);
    }
  }, [initialNum]);

  // 记录选中的多音字索引 (0 或 1)
  const [activeSplitIdx, setActiveSplitIdx] = useState<number>(0);

  const data = LEVEL_1_DATA[currentNum];
  const isMultiReading = data.readings.length > 1;

  // 组件挂载时，自动播放当前数字(0)的声音
  useEffect(() => {
    // 这里使用 setTimeout 稍微延迟一点点，确保 TTS 引擎加载就绪（针对某些浏览器）
    // 也可以直接 speak(data.readings[0].kana);
    const timer = setTimeout(() => {
      if (data && data.readings.length > 0) {
        speak(data.readings[0].kana);
      }
    }, 400); // 延迟

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 空数组表示只在组件“第一次打开”时执行

  // 切换数字
  const handleKeyClick = (num: number) => {
    setCurrentNum(num);
    setActiveSplitIdx(0);
    speak(LEVEL_1_DATA[num].readings[0].kana); // 切换数字时自动播放主读音
  };

  // 点击多音字卡片
  const handleMultiClick = (idx: number, kana: string) => {
    setActiveSplitIdx(idx);
    speak(kana);
  };

  // 点击单音字区域
  const handleSingleClick = () => {
    speak(data.readings[0].kana);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stageContainer}>
        {/* 1. 背景数字 (装饰，透视感) */}
        <div className={styles.bgNumber}>{currentNum}</div>

        {/* 2. 汉字 (主角) */}
        <div className={`${styles.heroKanji} jaFont`}>{data.kanji}</div>

        {/* 3. 内容区：分两种情况渲染 */}

        {/* --- 情况 A: 单读音 (无卡片，极简) --- */}
        {!isMultiReading && (
          <div className={styles.singleContainer} onClick={handleSingleClick}>
            <div className={styles.romajiLabel}>{data.readings[0].romaji}</div>

            <div className={styles.kanaRow}>
              <span className={`${styles.kanaLabel} jaFont`}>
                {data.readings[0].kana}
              </span>
              <Volume2 size={20} className={styles.speakerIcon} />
            </div>
          </div>
        )}

        {/* --- 情况 B: 多读音 (左右对齐卡片 + 角落标签) --- */}
        {isMultiReading && (
          <div className={styles.splitContainer}>
            {data.readings.map((r, idx) => {
              const isActive = activeSplitIdx === idx;
              const isMain = r.isMain;

              return (
                <div
                  key={idx}
                  className={`
                    ${styles.splitCard} 
                    ${isMain ? styles.cardMain : ''}
                    ${isActive ? styles.cardActive : ''}
                  `}
                  onClick={() => handleMultiClick(idx, r.kana)}
                >
                  {/* 角落标签 */}
                  {isMain && <div className={styles.mainBadge}>常用</div>}

                  {/* 上半部分：Romaji + Kana */}
                  <div className={styles.cardTopContent}>
                    <span className={styles.romajiText}>{r.romaji}</span>
                    <div className={`${styles.kanaText} jaFont`}>
                      {r.kana}
                      <Volume2 size={16} className={styles.speakerIconInCard} />
                    </div>
                  </div>

                  {/* 下半部分：说明文字 (自动沉底对齐) */}
                  <div className={styles.usageWrapper}>
                    <span className={styles.usageText}>{r.usage}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 底部键盘 - 顺序阿拉伯 */}
      <NumberKeypad
        onKeyClick={handleKeyClick}
        activeNum={currentNum}
        shuffle={false}
        displayMode="arabic"
      />
    </div>
  );
};
