import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { HelpCircle, PartyPopper, Zap, Volume2 } from 'lucide-react';
import BottomSheet from '../../../components/BottomSheet';
import styles from './RulesHelpSheet.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesHelpSheet: React.FC<Props> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('mistake_notebook.help_sheet.title')}
    >
      <div className={styles.container}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <PartyPopper size={18} color="#FF9500" />
            <span>{t('mistake_notebook.help_sheet.mechanism_title')}</span>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.text}>
              {/* 🔥 使用 Trans 组件处理带 HTML 标签的翻译 */}
              {/* components 属性允许我们在翻译字符串中插入 React 元素/HTML 标签 */}
              <Trans
                i18nKey="mistake_notebook.help_sheet.mechanism_text"
                components={{
                  strong: <strong className="highlight-text" />,
                  br: <br />,
                }}
              />
            </p>
          </div>
        </div>

        {/* 板块 2: 图例字典 */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <HelpCircle size={18} color="var(--color-Blue)" />
            <span>{t('mistake_notebook.help_sheet.legend_title')}</span>
          </div>

          <div className={styles.sectionContent}>
            {/* 图例 A: 复习中 */}
            <div className={styles.legendRow}>
              <div className={styles.mockBadge}>3</div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>
                  {t('mistake_notebook.help_sheet.legend_review_title')}
                </span>
                <span className={styles.legendDesc}>
                  {t('mistake_notebook.help_sheet.legend_review_desc')}
                </span>
              </div>
            </div>

            {/* 图例 B: 即将移出 */}
            <div className={styles.legendRow}>
              <div className={styles.mockRingWrapper}>
                <div className={styles.mockRingBadge}>5</div>
                <div className={styles.mockRingBorder} />
              </div>
              <div className={styles.legendText}>
                <span
                  className={styles.legendTitle}
                  style={{ color: 'var(--color-success)' }}
                >
                  {t('mistake_notebook.help_sheet.legend_remove_title')}
                </span>
                <span className={styles.legendDesc}>
                  {t('mistake_notebook.help_sheet.legend_remove_desc')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 板块 3: 功能字典 */}
        <div className={styles.section} style={{ marginBottom: 0 }}>
          <div className={styles.sectionTitle}>
            <Zap size={18} fill="#FFCC00" color="#FF9500" />
            <span>{t('mistake_notebook.help_sheet.func_title')}</span>
          </div>
          <div className={styles.sectionContent}>
            {/* 闪电 */}
            <div className={styles.legendRow}>
              <div className={styles.iconBg}>
                <Zap
                  size={18}
                  color="var(--color-Blue)"
                  fill="var(--color-Blue)"
                />
              </div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>
                  {t('mistake_notebook.help_sheet.func_blitz_title')}
                </span>
                <span className={styles.legendDesc}>
                  {t('mistake_notebook.help_sheet.func_blitz_desc')}
                </span>
              </div>
            </div>
            {/* 喇叭 */}
            <div className={styles.legendRow}>
              <div className={styles.iconBg}>
                <Volume2 size={18} color="#8e8e93" />
              </div>
              <div className={styles.legendText}>
                <span className={styles.legendTitle}>
                  {t('mistake_notebook.help_sheet.func_sound_title')}
                </span>
                <span className={styles.legendDesc}>
                  {t('mistake_notebook.help_sheet.func_sound_desc')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};
