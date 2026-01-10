// src/pages/KanaDictAndQuiz/PageQuizSelection/KanaQuizSelectionPage.tsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react'; // 引入一个开始图标

import { KanaBoard } from '../KanaBoard';
import styles from './KanaQuizSelectionPage.module.css'; // 需要新建一个简单的样式文件

export const KanaQuizSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 1. 状态
  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // 2. 限制常量
  const MIN_SELECTION = 5;
  const MAX_SELECTION = 10;

  // 3. Tab 选项
  const tabOptions = useMemo(
    () => [
      { id: 'hiragana', label: t('kana_dictionary.tabs.hiragana') },
      { id: 'katakana', label: t('kana_dictionary.tabs.katakana') },
    ],
    [t]
  );

  // 4. 🔥 核心交互：点击格子
  const handleItemClick = (data: any) => {
    const id = data.id;
    const newSet = new Set(selectedIds);

    if (newSet.has(id)) {
      // 如果已选，则取消
      newSet.delete(id);
    } else {
      // 如果未选，先检查是否超限
      if (newSet.size >= MAX_SELECTION) {
        // 可选：这里可以加个 Toast 提示 "最多选择 10 个"
        alert(`最多只能选择 ${MAX_SELECTION} 个假名`);
        return;
      }
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // 5. 开始测试
  const handleStartQuiz = () => {
    if (selectedIds.size < MIN_SELECTION) return;

    // 跳转到答题页，并把选中的 ID 传过去
    // 假设答题页路由是 /quiz/session
    navigate('/quiz/session', {
      state: {
        mode: 'manual', // 标记这是手动选的模式
        targetIds: Array.from(selectedIds),
      },
    });
  };

  return (
    <KanaBoard
      // --- 基础信息 ---
      activeTab={activeTab}
      tabOptions={tabOptions}
      title="自由测试选题" // 建议放入 i18n
      seionTitle={t('kana_dictionary.sections.seion')}
      dakuonTitle={t('kana_dictionary.sections.dakuon')}
      yoonTitle={t('kana_dictionary.sections.yoon')}
      // --- 交互控制 ---
      onBackClick={() => navigate(-1)}
      onTabChange={setActiveTab}
      onItemClick={handleItemClick}
      // --- 🔥 开启选择模式 ---
      isSelectionMode={true}
      selectedIds={selectedIds}
      showRomaji={true} // 选的时候最好显示罗马音，方便辨认
      // --- 插槽：右上角 (可以放个重置按钮) ---
      headerRight={
        <button
          onClick={() => setSelectedIds(new Set())}
          className={styles.resetBtn}
          style={{ visibility: selectedIds.size > 0 ? 'visible' : 'hidden' }}
        >
          重置
        </button>
      }
      // --- 🔥 插槽：底部悬浮栏 ---
      footer={
        <div className={styles.footer}>
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
