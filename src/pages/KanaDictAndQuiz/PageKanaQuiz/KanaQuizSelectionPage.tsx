// src/pages/KanaDictAndQuiz/PageKanaQuiz/KanaQuizSelectionPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, X } from 'lucide-react';
import { KanaBoard } from '../KanaBoard';
import { KANA_DB } from '../../../datas/kanaData';
import styles from './KanaQuizSelectionPage.module.css';

export const KanaQuizSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 🔥 修改限制：最少 6 个，最多 12 个
  const MIN_SELECTION = 6;
  const MAX_SELECTION = 12;

  const kanaMap = useMemo(() => {
    const map: Record<string, any> = {};
    // @ts-ignore
    Object.values(KANA_DB).forEach((item: any) => {
      if (item?.id) map[item.id] = item;
    });
    return map;
  }, []);

  const selectedItems = useMemo(() => {
    return Array.from(selectedIds)
      .map((id) => kanaMap[id])
      .filter(Boolean);
  }, [selectedIds, kanaMap]);

  const tabOptions = useMemo(
    () => [
      { id: 'hiragana', label: t('kana_dictionary.tabs.hiragana') },
      { id: 'katakana', label: t('kana_dictionary.tabs.katakana') },
    ],
    [t]
  );

  const handleItemClick = (data: any) => {
    const id = data.id;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size >= MAX_SELECTION) {
        // 可选：提示
        // alert(`最多只能选择 ${MAX_SELECTION} 个假名`);
        return;
      }
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleStartQuiz = () => {
    if (selectedIds.size < MIN_SELECTION) return;
    navigate('/quiz/session', {
      state: {
        mode: 'manual',
        targetIds: Array.from(selectedIds),
      },
    });
  };

  return (
    <KanaBoard
      activeTab={activeTab}
      tabOptions={tabOptions}
      title="自由测试选题"
      seionTitle={t('kana_dictionary.sections.seion')}
      dakuonTitle={t('kana_dictionary.sections.dakuon')}
      yoonTitle={t('kana_dictionary.sections.yoon')}
      onBackClick={() => navigate(-1)}
      onTabChange={setActiveTab}
      onItemClick={handleItemClick}
      isSelectionMode={true}
      selectedIds={selectedIds}
      showRomaji={true}
      headerRight={
        <button
          onClick={() => setSelectedIds(new Set())}
          className={styles.resetBtn}
          style={{ visibility: selectedIds.size > 0 ? 'visible' : 'hidden' }}
        >
          重置
        </button>
      }
      footer={
        <div className={styles.footer}>
          {selectedItems.length > 0 && (
            <div className={styles.previewBar}>
              {/* 这里类名还是叫 previewScroll，但我们在 CSS 里把它改成 Grid 了 */}
              <div className={styles.previewScroll}>
                {selectedItems.map((item) => (
                  <button
                    key={item.id}
                    className={styles.previewTag}
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="jaFont">{item.kana}</span>
                    <X size={12} className={styles.removeIcon} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.footerContent}>
            <div className={styles.counterInfo}>
              <span className={styles.countNumber}>{selectedIds.size}</span>
              <span className={styles.countLabel}>
                / {MAX_SELECTION} (至少 {MIN_SELECTION} 个)
              </span>
            </div>

            <button
              className={styles.startBtn}
              disabled={selectedIds.size < MIN_SELECTION}
              onClick={handleStartQuiz}
            >
              <Play size={18} fill="currentColor" />
              <span style={{ marginLeft: 4 }}>开始测试</span>
            </button>
          </div>
        </div>
      }
    />
  );
};
