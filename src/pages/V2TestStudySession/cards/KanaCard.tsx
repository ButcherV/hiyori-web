import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OriginBadge } from '../../../components/OriginBadge';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../studyKanaData';

import styles from './KanaCard.module.css';
import commonStyles from '../TestStudySession.module.css';

interface Props {
  data: AnyKanaData;
  onPlaySound: (char: string) => void;
}

export const KanaCard: React.FC<Props> = ({ data, onPlaySound }) => {
  const { t } = useTranslation();
  const { kanjiBackground } = useSettings();

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlaySound(data.kana);
  };

  if (data.kind === 'h-seion') {
    return (
      <div className={styles.container}>
        {kanjiBackground && (
          <OriginBadge
            char={data.kana}
            romaji={data.romaji}
            kanjiOrigin={data.kanaKanjiOrigin}
          />
        )}

        <div className={`${styles.bigChar} ${commonStyles.jaFont}`}>
          {data.kana}
        </div>

        <div className={styles.romajiSub}>{data.romaji}</div>

        {data.noteKey && (
          <div className={styles.cardNoteLabel}>
            <Lightbulb size={14} className={styles.noteIcon} />
            <span>{t(data.noteKey)}</span>
          </div>
        )}

        <div className={commonStyles.speakerBtn} onClick={handlePlay}>
          <Volume2 />
        </div>
      </div>
    );
  }

  return null;
};
