import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './OriginBadge.module.css';

interface OriginBadgeProps {
  char: string; // 当前假名，如 'ア'
  romaji: string; // 对应罗马音，如 'a'，用于匹配文件名
  kanjiOrigin: string; // 字源汉字，如 '阿'
}

export const OriginBadge: React.FC<OriginBadgeProps> = ({
  char,
  romaji,
  kanjiOrigin,
}) => {
  const { t } = useTranslation();
  const [svgContent, setSvgContent] = useState<string>('');

  // 内部自动判断
  const isKatakana = /[\u30A0-\u30FF]/.test(char);
  // 打印看看接收到的参数对不对
  console.log('Badge Render:', { char, romaji, isKatakana });
  // 只有片假名才去加载 SVG
  useEffect(() => {
    if (isKatakana && romaji) {
      const svgPath = `/katakanaOrigin/kata_${romaji}.svg`;

      fetch(svgPath)
        .then((res) => {
          if (!res.ok) throw new Error(`SVG not found: ${svgPath}`);
          return res.text();
        })
        .then((text) => {
          // 过滤掉冗余信息，保留核心 svg 内容
          const cleanSvg = text
            .replace(/<\?xml.*?\?>/g, '')
            .replace(/<!DOCTYPE.*?>/g, '')
            .replace(/<style.*?<\/style>/gs, '') // 移除原始样式，改用我们的外部样式
            .replace(/id="kvg:StrokeNumbers_.*?<\/g>/gs, ''); // 兜底：万一忘了删数字
          setSvgContent(cleanSvg);
        })
        .catch((err) => console.error('Error loading kanji origin SVG:', err));
    }
  }, [romaji, isKatakana]);

  // 📝 情况 A：片假名模式
  if (isKatakana) {
    return (
      <div className={styles.originBadge}>
        <div
          className={styles.originCharBox}
          // 将 SVG 源码注入，这样 .kana-radical 类名才能被外部 CSS 控制
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        <span className={styles.originLabel}>
          {t('studyKana.katakanaKanjiOrigin', { char: kanjiOrigin })}
        </span>
      </div>
    );
  }

  // 📝 情况 B：平假名模式（保持原样）
  return (
    <div className={styles.originBadge}>
      <div className={styles.originCharBox} data-char={kanjiOrigin}>
        <span className={styles.originChar}>{kanjiOrigin}</span>
      </div>
      <span className={styles.originLabel}>
        {t('studyKana.hiraganaKanjiOrigin', { char: kanjiOrigin })}
      </span>
    </div>
  );
};
