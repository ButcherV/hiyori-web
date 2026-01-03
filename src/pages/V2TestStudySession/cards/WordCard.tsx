import React from 'react';
import { Volume2 } from 'lucide-react';
// 引入 Hooks 实现组件自治
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../studyKanaData';
import styles from '../TestStudySession.module.css';

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const WordCard: React.FC<Props> = ({ data, onPlaySound }) => {
  // 防御 1: 如果没有单词数据，不渲染
  if (!data.word) return null;

  // Hooks 获取全局状态
  const { i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound(data.kana);
  };

  const meaningText = data.wordMeaning
    ? data.wordMeaning[currentLang as 'zh' | 'en'] || data.wordMeaning.en
    : '';

  // 🔥🔥🔥 核心修正：严格判断身份 🔥🔥🔥
  // 只有当它是 "平假名清音 (h-seion)" 时，才执行下面的渲染逻辑。
  // 如果未来有 k-seion (片假名)，你会在这里写 else if (data.kind === 'k-seion') { ... }
  if (data.kind === 'h-seion') {
    // 内部渲染逻辑：决定中间显示什么 (汉字? Emoji? 假名?)
    const renderMainContent = () => {
      // 场景 A: 汉字背景开启 -> 标准模式
      if (kanjiBackground) {
        return (
          <>
            <div className={`${styles.furigana} ${styles.jaFont}`}>
              {data.wordKana}
            </div>
            <div className={`${styles.kanjiMain} ${styles.jaFont}`}>
              {data.word}
            </div>
          </>
        );
      }

      // 场景 B: 汉字背景关闭 -> 盲听模式
      // B1. 有 Emoji 显 Emoji
      if (data.wordEmoji) {
        return (
          <>
            <div className={`${styles.furigana} ${styles.jaFont}`}>
              {data.wordKana}
            </div>
            <div
              className={styles.kanjiMain}
              style={{
                fontSize: '100px',
                lineHeight: 1.2,
                fontFamily:
                  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
              }}
            >
              {data.wordEmoji}
            </div>
          </>
        );
      }

      // B2. 没 Emoji 显假名
      return (
        <div className={`${styles.kanjiMain} ${styles.jaFont}`}>
          {data.wordKana || data.word}
        </div>
      );
    };

    return (
      <div className={styles.learnContext}>
        {renderMainContent()}

        <div className={styles.romajiBottom}>{data.wordRomaji}</div>

        <div className={styles.meaningText}>{meaningText}</div>

        <div className={styles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  // 如果不是 h-seion，或者未来未知的类型，暂不渲染
  return null;
};
