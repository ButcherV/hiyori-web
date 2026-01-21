import React from 'react';
import { Volume2, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OriginBadge } from '../../../components/OriginBadge';
import { useSettings } from '../../../context/SettingsContext';
import type { AnyKanaData } from '../../../datas/kanaData';

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

  // 统一判断字号
  const isYoon = data.kind === 'h-yoon';
  const sizeClass = isYoon ? styles.mid : styles.big;

  if (
    data.kind === 'h-seion' ||
    data.kind === 'h-dakuon' ||
    data.kind === 'h-yoon' ||
    data.kind === 'k-seion'
  ) {
    return (
      <div className={styles.container}>
        {/* 1. 喇叭：右上角绝对定位 */}
        <div className={`speakerBtn`} onClick={handlePlay}>
          <Volume2 />
        </div>

        {/* 2. 核心视觉区：罗马音 + 假名 (永远在一起) */}
        <div className={styles.mainZone}>
          <div className={styles.romajiSub}>{data.romaji}</div>
          <div
            className={`${styles.kanaText} ${sizeClass} ${commonStyles.jaFont}`}
          >
            {data.kana}
          </div>
        </div>

        {/* 3. 底部信息堆叠区：字源 + 提示 */}
        <div className={styles.footerInfo}>
          {/* 字源 */}
          {kanjiBackground &&
            (data.kind === 'h-seion' || data.kind === 'k-seion') && (
              <OriginBadge
                char={data.kana}
                romaji={data.romaji}
                // @ts-ignore
                kanjiOrigin={data.kanaKanjiOrigin}
              />
            )}

          {/* 提示胶囊 (长度不固定，会自动撑开高度) */}
          {data.noteKey && (
            <div className={`notePill`}>
              <Lightbulb size={14} className={`noteIcon`} />
              <span>{t(data.noteKey)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
};
