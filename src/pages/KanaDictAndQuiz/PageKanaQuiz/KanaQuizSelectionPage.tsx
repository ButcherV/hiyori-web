// src/pages/KanaDictAndQuiz/PageKanaQuiz/KanaQuizSelectionPage.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, X, Dices, RotateCcw } from 'lucide-react';

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
        return;
      }
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleStartQuiz = () => {
    if (selectedIds.size < MIN_SELECTION) return;
    navigate('/quiz/session', {
      state: { mode: 'manual', targetIds: Array.from(selectedIds) },
    });
  };

  // 随机选择逻辑
  const handleRandomSelection = () => {
    // A. 确定当前的 ID 前缀 (h- 或 k-)，只在当前 Tab 内随机
    const prefix = activeTab === 'hiragana' ? 'h-' : 'k-';

    // B. 从 KANA_DB 中筛选出所有符合当前 Tab 的 ID
    // @ts-ignore
    const validIds = Object.values(KANA_DB)
      .filter((item: any) => item?.id && item.id.startsWith(prefix))
      .map((item: any) => item.id);

    if (validIds.length === 0) return;

    // C. 随机决定要选多少个 (6 到 12 之间)
    const count =
      Math.floor(Math.random() * (MAX_SELECTION - MIN_SELECTION + 1)) +
      MIN_SELECTION;

    // D. 洗牌算法 (Fisher-Yates Shuffle 简化版)
    // 复制一份数组，打乱顺序，然后切取前 count 个
    const shuffled = [...validIds].sort(() => 0.5 - Math.random());
    const randomSelection = shuffled.slice(0, count);

    // E. 覆盖选中状态
    setSelectedIds(new Set(randomSelection));
  };

  return (
    <KanaBoard
      activeTab={activeTab}
      tabOptions={tabOptions}
      title={t('kana_quiz.selection_title')}
      seionTitle={t('kana_dictionary.sections.seion')}
      dakuonTitle={t('kana_dictionary.sections.dakuon')}
      yoonTitle={t('kana_dictionary.sections.yoon')}
      onBackClick={() => navigate(-1)}
      onTabChange={setActiveTab}
      onItemClick={handleItemClick}
      isSelectionMode={true}
      selectedIds={selectedIds}
      showRomaji={true}
      // 🔥 修改右上角：图标按钮组
      headerRight={
        <div className={styles.iconGroup}>
          {/* 骰子按钮：随时可用 */}
          <button
            className={styles.iconBtn}
            onClick={handleRandomSelection}
            aria-label={t('kana_quiz.aria.random')}
          >
            <Dices size={22} />
          </button>

          {/* 重置按钮：仅当有选中项时显示 (或者也可以设为 disabled) */}
          {selectedIds.size > 0 && (
            <button
              className={styles.iconBtn}
              onClick={() => setSelectedIds(new Set())}
              aria-label={t('kana_quiz.aria.reset')}
            >
              <RotateCcw size={22} />
            </button>
          )}
        </div>
      }
      footer={
        <div className={styles.footer}>
          {selectedItems.length > 0 && (
            <div className={styles.previewBar}>
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
                {t('kana_quiz.limit_hint', {
                  max: MAX_SELECTION,
                  min: MIN_SELECTION,
                })}
              </span>
            </div>

            <button
              className={styles.startBtn}
              disabled={selectedIds.size < MIN_SELECTION}
              onClick={handleStartQuiz}
            >
              <Play size={18} fill="currentColor" />
              <span style={{ marginLeft: 4 }}>{t('kana_quiz.start_btn')}</span>
            </button>
          </div>
        </div>
      }
    />
  );
};
