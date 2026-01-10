// src/pages/KanaDictionary/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { KanaTable } from './KanaTable';
import {
  SEION_ROWS,
  SEION_ROW_HEADERS,
  DAKUON_ROWS,
  DAKUON_ROW_HEADERS,
  YOON_ROWS,
  YOON_ROW_HEADERS,
  // 🔥 1. 必须引入这两个新的列头定义！
  SEION_COL_HEADERS,
  YOON_COL_HEADERS,
} from './constants';
import styles from './Dictionary.module.css';

const Toggle = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => (
  <div
    onClick={onChange}
    className={`${styles.toggle} ${checked ? styles.toggleChecked : ''}`}
  >
    <div
      className={`${styles.toggleHandle} ${checked ? styles.toggleHandleChecked : ''}`}
    />
  </div>
);

export const KanaDictionaryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [showRomaji, setShowRomaji] = useState(true);

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
              {/* <CircleX size={28} /> */}
            </button>
            <span className={styles.pageTitle}>五十音图</span>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.romajiLabel}>罗马音</span>
            <Toggle
              checked={showRomaji}
              onChange={() => setShowRomaji(!showRomaji)}
            />
          </div>
        </div>
        <div className={styles.stickyHeaderCol2}>
          <div className={styles.tabContainer}>
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
          </div>
        </div>
      </div>

      <div className={styles.content}>
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

        <div className={styles.sectionsWrapper}>
          {/* 1. 清音 */}
          <section>
            <h2 className={styles.sectionHeader}>清音 (Seion)</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={SEION_ROWS}
              rowHeaders={SEION_ROW_HEADERS}
              // 🔥 2. 传入清音表头 (a i u e o)
              colHeaders={SEION_COL_HEADERS}
            />
          </section>

          {/* 2. 浊音 */}
          <section>
            <h2 className={styles.sectionHeader}>浊音 (Dakuon)</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={DAKUON_ROWS}
              rowHeaders={DAKUON_ROW_HEADERS}
              // 🔥 3. 传入浊音表头 (也是 a i u e o)
              colHeaders={SEION_COL_HEADERS}
            />
          </section>

          {/* 3. 拗音 */}
          <section>
            <h2 className={styles.sectionHeader}>拗音 (Yoon)</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={handleItemClick}
              rows={YOON_ROWS}
              rowHeaders={YOON_ROW_HEADERS}
              // 🔥 4. 传入拗音表头 (ya - yu - yo)
              colHeaders={YOON_COL_HEADERS}
            />
          </section>
        </div>
      </div>
    </div>
  );
};
