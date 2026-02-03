import React from 'react';
import styles from './TranslationResultArea.module.css';
import { type TranslationResult } from './TranslatorTypes';
import { useTranslation } from 'react-i18next';

interface Props {
  inputVal: string;
  result: TranslationResult | null;
}

export const TranslationResultArea: React.FC<Props> = ({
  inputVal,
  result,
}) => {
  const { t } = useTranslation();
  if (!inputVal) {
    return (
      <div className={styles.resultContainer}>
        <div className={styles.emptyState}>
          {t('number_study.translator.empty_state')}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resultContainer}>
      <div className={styles.chipsFlow}>
        {result?.blocks.map((block, index) => {
          // 过滤逻辑：只有当不是0，或者是唯一的个位0时才显示
          if (block.isZero && result.originalNum !== 0) return null;

          return (
            <div key={index} className={styles.blockCard}>
              <div className={styles.textStack}>
                <div className={styles.cardRomaji}>
                  {block.romajiParts.map((part, pIdx) => (
                    <span
                      key={pIdx}
                      className={`${styles.phonePart} ${
                        part.isMutation ? styles.mutation : ''
                      }`}
                    >
                      {part.text}
                    </span>
                  ))}
                </div>
                <div className={styles.cardKana}>{block.kana}</div>
                <div className={styles.cardKanji}>{block.kanji}</div>
              </div>

              {block.unit && (
                <div className={styles.unitBadge}>
                  <span className={styles.unitChar}>{block.unit}</span>
                  <span className={styles.unitReading}>
                    {block.unitReading}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
