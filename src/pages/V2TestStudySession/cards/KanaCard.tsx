import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OriginBadge } from '../../../components/OriginBadge';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../studyKanaData';
import styles from '../TestStudySession.module.css';

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const KanaCard: React.FC<Props> = ({ data, onPlaySound }) => {
  const { t, i18n } = useTranslation();
  const { kanjiBackground } = useSettings();

  // 🔥 2. 定义语言判断逻辑
  //   // i18n.language 可能是 'zh-CN', 'zh-TW', 'en-US' 等
  //   const isChinese = i18n.language.startsWith('zh');

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound(data.kana);
  };

  if (data.kind === 'h-seion') {
    return (
      <div className={styles.learnShape}>
        {kanjiBackground && (
          <OriginBadge
            char={data.kana}
            romaji={data.romaji}
            kanjiOrigin={data.kanaKanjiOrigin}
          />
        )}

        <div className={`${styles.bigChar} ${styles.jaFont}`}>{data.kana}</div>

        <div className={styles.romajiSub}>{data.romaji}</div>

        {data.noteKey && (
          <div className={styles.cardNoteLabel}>
            <Lightbulb size={14} className={styles.noteIcon} />
            <span>{t(data.noteKey)}</span>
          </div>
        )}

        <div className={styles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  return null;
};
