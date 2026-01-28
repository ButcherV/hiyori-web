import { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useTTS } from '../../../../hooks/useTTS';
import { LEVEL_1_DATA, type LocalizedText } from './Level1Data';
import styles from './Level1Learn.module.css';
import { NumberKeypad } from '../NumberKeypad';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Level1LearnProps {
  initialNum?: number | null;
}

export const Level1Learn: React.FC<Level1LearnProps> = ({ initialNum }) => {
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();

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

  const getUsageText = (usage?: LocalizedText) => {
    if (!usage) return null;
    const isChinese = i18n.language.startsWith('zh');
    return isChinese ? usage.zh : usage.en;
  };

  const data = LEVEL_1_DATA[currentNum];
  const isMultiReading = data.readings.length > 1;

  // 初次进场的“开场白” (专门播报数字 0)
  // useEffect(() => {
  //   // 触发条件：
  //   // 不是错题返回 (initialNum 为空)
  //   if (initialNum === null || initialNum === undefined) {
  //     const timer = setTimeout(() => {
  //       speak(LEVEL_1_DATA[0].readings[0].kana);
  //     }, 400);
  //     return () => clearTimeout(timer);
  //   }
  // }, [initialNum, speak]);

  // 错题返回的“纠错引导” (播报正确的错题读音)
  useEffect(() => {
    // 触发条件：
    // 确实是错题返回 (initialNum 是个数字)
    if (typeof initialNum === 'number') {
      const timer = setTimeout(() => {
        speak(LEVEL_1_DATA[initialNum].readings[0].kana);
      }, 400);
      return () => clearTimeout(timer);
    }
    // 监听 initialNum，只要测试失败跳回来，数字变了就会响
  }, [initialNum, speak]);

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
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentNum}
          className={`${styles.stageContainer}`}
          // 进场：稍微放大 + 淡入
          initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
          // 停留：正常
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          // 离场：变大 + 淡出 (会有种扑面而来的消逝感)
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(4px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* 1. 背景数字 (装饰，透视感) */}
          <div className={styles.bgNumber}>{currentNum}</div>

          {/* 2. 汉字 (主角) */}
          <div className={`${styles.heroKanji} jaFont`}>{data.kanji}</div>

          {/* 3. 内容区：分两种情况渲染 */}

          {/* --- 情况 A: 单读音 (无卡片，极简) --- */}
          {!isMultiReading && (
            <div className={styles.singleContainer} onClick={handleSingleClick}>
              <div className={styles.romajiLabel}>
                {data.readings[0].romaji}
              </div>

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
                const usageText = getUsageText(r.usage);

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
                    {isMain && (
                      <div className={styles.mainBadge}>
                        {t('number_study.numbers.interaction.common_badge')}
                      </div>
                    )}

                    {/* 上半部分：Romaji + Kana */}
                    <div className={styles.cardTopContent}>
                      <span className={styles.romajiText}>{r.romaji}</span>
                      <div className={`${styles.kanaText} jaFont`}>
                        {r.kana}
                        <Volume2
                          size={16}
                          className={styles.speakerIconInCard}
                        />
                      </div>
                    </div>

                    {/* 下半部分：说明文字 (自动沉底对齐) */}
                    {usageText && (
                      <div className={styles.usageWrapper}>
                        <span className={styles.usageText}>{usageText}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

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
