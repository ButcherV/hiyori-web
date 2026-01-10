import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { KanaTable } from './KanaTable';
import {
  SEION_ROWS,
  SEION_ROW_HEADERS,
  DAKUON_ROWS,
  DAKUON_ROW_HEADERS,
  YOON_ROWS,
  YOON_ROW_HEADERS,
  SEION_COL_HEADERS,
  YOON_COL_HEADERS,
} from './constants';
import styles from './Dictionary.module.css';
import { Switch } from '../../components/Switch';
import { CategoryTabs } from '../../components/CategoryTabs';

export const KanaDictionaryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [showRomaji, setShowRomaji] = useState(true);

  const tabOptions = useMemo(
    () => [
      { id: 'hiragana', label: t('kana_dictionary.tabs.hiragana') },
      { id: 'katakana', label: t('kana_dictionary.tabs.katakana') },
    ],
    [t]
  );

  const handleItemClick = (data: any) => {
    console.log('Clicked:', data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stickyHeader}>
        <div className={styles.stickyHeaderCol}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <span className={styles.pageTitle}>
              {t('kana_dictionary.title')}
            </span>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.romajiLabel}>
              {t('kana_dictionary.romaji_label')}
            </span>
            <Switch
              checked={showRomaji}
              onChange={() => setShowRomaji(!showRomaji)}
            />
          </div>
        </div>
        <div className={styles.stickyHeaderCol2}>
          {/* <div className={styles.tabContainer}>
            {['hiragana', 'katakana'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`${styles.tabBtn} ${
                  activeTab === tab ? styles.tabBtnActive : ''
                }`}
              >
                {tab === 'hiragana' ? '平假名 (Hiragana)' : '片假名 (Katakana)'}
              </button>
            ))}
          </div> */}
          <div className={styles.tabWrapper}>
            {/* 这里的 tabWrapper 是为了限制宽度，或者你可以直接放进去 */}
            <CategoryTabs
              options={tabOptions}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as 'hiragana' | 'katakana')}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sectionsWrapper}>
          {/* 1. 清音 */}
          <section>
            <h2 className={`${styles.sectionHeader} jaFont`}>
              {t('kana_dictionary.sections.seion')}
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={SEION_ROWS}
              rowHeaders={SEION_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
            />
          </section>

          {/* 2. 浊音 */}
          <section>
            <h2 className={styles.sectionHeader}>
              {t('kana_dictionary.sections.dakuon')}
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={DAKUON_ROWS}
              rowHeaders={DAKUON_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
            />
          </section>

          {/* 3. 拗音 */}
          <section>
            <h2 className={styles.sectionHeader}>
              {t('kana_dictionary.sections.yoon')}
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={YOON_ROWS}
              rowHeaders={YOON_ROW_HEADERS}
              colHeaders={YOON_COL_HEADERS}
            />
          </section>
        </div>
      </div>
    </div>
  );
};
