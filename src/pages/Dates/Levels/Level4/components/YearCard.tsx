import React from 'react';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import styles from './YearCard.module.css';
import { type YearData } from '../Level4Data';
import showaBgImage from '../../../../../assets/images/showa.png';

interface YearCardProps {
  data: YearData;
  onPrevEra: () => void;
  onNextEra: () => void;
}

// // 🎨 临时模拟：根据时代生成不同的氛围背景图
// // 以后你可以把这个换成真实的 Unsplash 图片 URL 或者本地图片路径
// const getEraBackground = (eraRomaji: string, year: number) => {
//   // 简单模拟：昭和偏暖(夕阳)，平成偏冷(科技)，令和偏紫(新时代)
//   // 实际项目中，这里应该是 <img src={`/assets/eras/${eraRomaji}_${year}.jpg`} />
//   if (eraRomaji === 'meiji')
//     return 'linear-gradient(to bottom, #78350f, #92400e)'; // 明治：深褐古旧
//   if (eraRomaji === 'taisho')
//     return 'linear-gradient(to bottom, #701a75, #a21caf)'; // 大正：浪漫紫红
//   if (eraRomaji === 'showa')
//     return 'linear-gradient(to bottom, #9a3412, #c2410c)'; // 昭和：夕阳橙红
//   if (eraRomaji === 'heisei')
//     return 'linear-gradient(to bottom, #1e3a8a, #3b82f6)'; // 平成：商务蓝
//   return 'linear-gradient(to bottom, #4c1d95, #8b5cf6)'; // 令和：紫罗兰
// };
const getEraBackground = (eraRomaji: string) => {
  if (eraRomaji === 'showa') {
    // 注意：这里返回的是 CSS 的 background-image 语法
    return `url(${showaBgImage})`;
  }

  // 其他时代暂时保持渐变，或者你也去找图替换
  if (eraRomaji === 'meiji')
    return 'linear-gradient(to bottom, #78350f, #92400e)';
  if (eraRomaji === 'taisho')
    return 'linear-gradient(to bottom, #701a75, #a21caf)';
  if (eraRomaji === 'heisei')
    return 'linear-gradient(to bottom, #1e3a8a, #3b82f6)';
  return 'linear-gradient(to bottom, #4c1d95, #8b5cf6)';
};

export const YearCard: React.FC<YearCardProps> = ({
  data,
  onPrevEra,
  onNextEra,
}) => {
  // 模拟背景，实际这里应该是 <img src="..." />
  const bgStyle = {
    backgroundImage: getEraBackground(data.era.key),
  };

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Playing audio for ${data.romaji}`);
    // 这里调用你的播音逻辑
  };

  return (
    <div className={styles.cardContainer}>
      {/* 1. 背景层：图片/渐变 */}
      {/* 如果有真实图片，用 <img className={styles.bgImage} src={...} /> 替换下面的 div */}
      <div className={styles.bgImage} style={bgStyle} />

      {/* 2. 质感层：噪点 */}
      <div className={styles.grainOverlay} />

      {/* 3. 左上角：西历年份 (像相机的日期水印) */}
      <div className={styles.westernYear}>{data.year}</div>

      {/* 4. 右上角：导航 */}
      <div className={styles.eraNav}>
        <button className={styles.navBtn} onClick={onPrevEra}>
          <ChevronLeft size={16} />
        </button>
        <button className={styles.navBtn} onClick={onNextEra}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* 5. 底部内容层：渐变遮罩 + 文字 */}
      <div className={styles.contentOverlay}>
        {/* 主标题：昭和 64 年 */}
        <div className={styles.mainTitleGroup}>
          <span className={styles.eraKanji}>{data.era.kanji}</span>
          <span className={styles.eraKanji}>{data.kanji}</span>

          {/* 特殊标签：如果这一年有坑 */}
          {data.isTrap && (
            <span className={`${styles.tag} ${styles.tagTrap}`}>注意</span>
          )}
        </div>

        {/* 读音与播音 */}
        <div className={styles.readingGroup}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className={styles.kana}>
              {data.era.kanji}の{data.kanji}
            </span>
            <span className={styles.romaji}>{data.romaji}</span>
          </div>

          <button className={styles.playBtn} onClick={handlePlayAudio}>
            <Volume2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
