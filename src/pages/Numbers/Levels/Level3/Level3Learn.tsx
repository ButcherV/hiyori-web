import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 🔴 引入 useTranslation 用于获取当前语言状态
import { useTranslation } from 'react-i18next';
import { LEVEL_3_DATA } from './Level3Data';
import { NumberKeypad } from '../NumberKeypad';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import styles from './Level3Learn.module.css';

const snapSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
  mass: 1,
};

const KANJI_MULTIPLIERS = [
  '',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];
const KANJI_HEIGHT = 88;

const KanjiReel = ({ targetIndex }: { targetIndex: number }) => {
  return (
    <div className={styles.kanjiWindow}>
      <motion.div
        animate={{ y: -targetIndex * KANJI_HEIGHT }}
        transition={snapSpring}
        className={styles.kanjiReel}
      >
        {KANJI_MULTIPLIERS.map((char, i) => (
          <div key={i} className={`${styles.kanjiCell} jaFont`}>
            {char}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Drum = ({
  from,
  to,
  delay = 0,
  isLeft = true,
}: {
  from: string;
  to: string;
  delay?: number;
  isLeft?: boolean;
}) => {
  const isChanging = from !== to;

  return (
    <div className={styles.drumColumn}>
      <div
        className={`${styles.drumWindow} ${isChanging ? styles.warningBorder : ''}`}
      >
        <motion.div
          key={from + to}
          initial={{ y: 0 }}
          animate={{ y: isChanging ? -64 : 0 }}
          transition={{ ...snapSpring, delay: delay + 0.4 }}
          className={styles.drumReel}
        >
          <div
            className={`${styles.cell} jaFont ${isLeft ? styles.alignRight : styles.alignLeft}`}
          >
            {from}
          </div>
          <div
            className={`${styles.cell} jaFont ${isLeft ? styles.alignRight : styles.alignLeft} ${isChanging ? styles.activeText : ''}`}
          >
            {to}
          </div>
        </motion.div>
      </div>
      {/* 局部演化标注 (小箭头) */}
      <div className={styles.hintSpace}>
        {isChanging && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.8 }}
            className={`${styles.localHint} jaFont`}
          >
            {from}
            <span className={styles.arrow}>→</span>
            {to}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export const Level3Learn = () => {
  // 🔴 获取 i18n 实例
  const { i18n } = useTranslation();
  // 🔴 简单判断语言：如果是 zh 开头(如 zh-CN, zh-TW)则用 zh，否则用 en
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const [currentNum, setCurrentNum] = useState(200);
  const data = LEVEL_3_DATA[currentNum];
  const isHundred = currentNum === 100; // 核心判断标志

  const kanjiIndex = Math.floor(currentNum / 100);

  const evo = useMemo(
    () =>
      data.evolution || {
        multiplier: { from: data.parts.kana[0], to: data.parts.kana[0] },
        unit: { from: 'ひゃく', to: 'ひゃく' },
      },
    [data]
  );

  const handleKeyClick = (num: number) => {
    setCurrentNum(num);
    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Medium });
      if (LEVEL_3_DATA[num].evolution) {
        setTimeout(() => Haptics.impact({ style: ImpactStyle.Heavy }), 600);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          {/* ================= 分支 A: 100 (单体布局) ================= */}
          {isHundred ? (
            <motion.div
              key="single-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={styles.singleModeContainer}
            >
              {/* 1. 汉字：居中大写的“百” */}
              <div className={`${styles.singleKanji} jaFont`}>
                {data.parts.kanji[1]}
              </div>

              {/* 2. 罗马音 */}
              <div className={`${styles.romaji} jaFont`}>{data.romaji}</div>

              {/* 3. 假名：居中单体视窗 (无滚动) */}
              <div className={styles.singleDrumWindow}>
                <div className={`${styles.cell} jaFont`}>
                  {data.parts.kana[1]}
                </div>
              </div>

              {/* 4. 解释文案 */}
              <div className={styles.reasonContainer}>
                {data.reason && (
                  <div className={styles.reasonBadge}>{data.reason[lang]}</div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ================= 分支 B: 200-900 (双体滚动布局) ================= */
            <motion.div
              key="split-multi"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.05,
                transition: { duration: 0.15 },
              }}
              className={styles.splitModeContainer}
            >
              {/* 1. 汉字层 (左滚右静) */}
              <div className={`${styles.kanjiRow} jaFont`}>
                <div className={styles.kanjiLeft}>
                  <KanjiReel targetIndex={kanjiIndex} />
                </div>
                <span className={styles.kanjiRight}>{data.parts.kanji[1]}</span>
              </div>

              {/* 2. 罗马音 */}
              <motion.div
                key={currentNum} // 每次数字变化重新触发升起
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
                className={`${styles.romaji} jaFont`}
              >
                {data.romaji}
              </motion.div>

              {/* 3. 假名滚轮层 (双 Drum) */}
              <div className={styles.drumsContainer}>
                <Drum
                  from={evo.multiplier.from}
                  to={evo.multiplier.to}
                  isLeft={true}
                />
                <Drum
                  from={evo.unit.from}
                  to={evo.unit.to}
                  delay={0.15}
                  isLeft={false}
                />
              </div>

              {/* 4. 解释文案 */}
              <div className={styles.reasonContainer}>
                {data.reason && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className={styles.reasonBadge}
                  >
                    {data.reason[lang]}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NumberKeypad
        onKeyClick={handleKeyClick}
        activeNum={currentNum}
        customNums={[100, 200, 300, 400, 500, 600, 700, 800, 900]}
        layout={{ splitIdx: 4, maxCols: 5 }}
      />
    </div>
  );
};
