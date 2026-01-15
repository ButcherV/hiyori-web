import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sword, CheckCircle2, Circle, Play } from 'lucide-react';
import BottomSheet from '../../../components/BottomSheet';
import styles from './QuizConfirmSheet.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hMistakeIds: string[];
  kMistakeIds: string[];
  defaultTab: 'hiragana' | 'katakana';
  // 🔥 确认回调需要把最终计算好的 IDs 传回去
  onConfirm: (finalIds: string[]) => void;
}

export const QuizConfirmSheet: React.FC<Props> = ({
  isOpen,
  onClose,
  hMistakeIds,
  kMistakeIds,
  defaultTab,
  onConfirm,
}) => {
  const { t } = useTranslation();

  // 状态：分别控制平假名和片假名的勾选
  const [isHSelected, setHSelected] = useState(true);
  const [isKSelected, setKSelected] = useState(false);

  // 🔥 核心逻辑：每次打开弹窗时，根据当前 Tab 重置默认勾选
  useEffect(() => {
    if (isOpen) {
      if (defaultTab === 'hiragana') {
        // 如果当前是平假名 Tab：默认勾选平假名（如果有错题的话）
        setHSelected(hMistakeIds.length > 0);
        // 片假名默认不勾，除非平假名没题（但这种情况通常由父组件控制入口）
        setKSelected(false);
      } else {
        // 如果当前是片假名 Tab
        setKSelected(kMistakeIds.length > 0);
        setHSelected(false);
      }
    }
  }, [isOpen, defaultTab, hMistakeIds.length, kMistakeIds.length]);

  // 实时计算当前选中的总数
  const totalCount =
    (isHSelected ? hMistakeIds.length : 0) +
    (isKSelected ? kMistakeIds.length : 0);

  const handleConfirm = () => {
    const finalIds = [
      ...(isHSelected ? hMistakeIds : []),
      ...(isKSelected ? kMistakeIds : []),
    ];
    onConfirm(finalIds);
  };

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('mistake_notebook.confirm_sheet.title')}
    >
      <div className={styles.container}>
        <div className={styles.iconWrapper}>
          <Sword size={32} color="#007AFF" />
        </div>

        <h3 className={styles.title}>
          {t('mistake_notebook.confirm_sheet.prefix')} {totalCount}{' '}
          {t('mistake_notebook.confirm_sheet.suffix')}
        </h3>

        <p className={styles.description}>
          {t('mistake_notebook.confirm_sheet.desc_1')}
          <br />
          <span className={styles.highlight}>
            {t('mistake_notebook.confirm_sheet.desc_highlight')}
          </span>{' '}
          {t('mistake_notebook.confirm_sheet.desc_3')}
        </p>

        <div className={styles.optionsContainer}>
          {/* 平假名选项 */}
          <label
            className={`${styles.checkboxLabel} ${
              isHSelected ? styles.checked : ''
            } ${hMistakeIds.length === 0 ? styles.disabled : ''}`}
          >
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isHSelected}
              disabled={hMistakeIds.length === 0}
              onChange={(e) => setHSelected(e.target.checked)}
              style={{ display: 'none' }}
            />
            {isHSelected ? (
              <CheckCircle2
                size={20}
                className={styles.checkIcon}
                fill="#007AFF"
                color="white"
              />
            ) : (
              <Circle size={20} color="#C7C7CC" />
            )}

            <span>
              {t('mistake_notebook.hiragana')} ({hMistakeIds.length})
            </span>
          </label>

          {/* 片假名选项 */}
          <label
            className={`${styles.checkboxLabel} ${
              isKSelected ? styles.checked : ''
            } ${kMistakeIds.length === 0 ? styles.disabled : ''}`}
          >
            <input
              type="checkbox"
              className={styles.checkboxInput}
              checked={isKSelected}
              disabled={kMistakeIds.length === 0}
              onChange={(e) => setKSelected(e.target.checked)}
              style={{ display: 'none' }}
            />

            {isKSelected ? (
              <CheckCircle2
                size={20}
                className={styles.checkIcon}
                fill="#007AFF"
                color="white"
              />
            ) : (
              <Circle size={20} color="#C7C7CC" />
            )}

            <span>
              {t('mistake_notebook.katakana')} ({kMistakeIds.length})
            </span>
          </label>
        </div>

        <div className={styles.buttonGroup}>
          {/* <button
            onClick={onClose}
            className={`${styles.cancelBtn} btn-base btn-secondary`}
          >
            {t('mistake_notebook.confirm_sheet.btn_cancel')}
          </button>

          <button
            onClick={handleConfirm}
            disabled={totalCount === 0}
            className={`${styles.startBtn} btn-base btn-primary`}
          >
            {t('mistake_notebook.confirm_sheet.btn_start')}
          </button> */}
          <button
            onClick={handleConfirm}
            className={`${styles.startBtn} btn-base btn-primary`}
            disabled={totalCount === 0}
          >
            <Play size={18} fill="currentColor" />
            <span style={{ marginLeft: 4 }}>
              {t('mistake_notebook.confirm_sheet.btn_start')}
            </span>
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
