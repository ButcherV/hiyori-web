import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Zap, HelpCircle } from 'lucide-react';
import { useMistakes } from '../../../context/MistakeContext';
import { KANA_DB } from '../../../datas/kanaData';
import { CategoryTabs } from '../../../components/CategoryTabs';
import { useTTS } from '../../../hooks/useTTS';
import { MistakeRowCard, type MistakeItem } from './MistakeRowCard';
import styles from './MistakeNotebook.module.css';
import { QuizConfirmSheet } from './QuizConfirmSheet';
import { RulesHelpSheet } from './RulesHelpSheet';
import { SpecialReportCard } from './SpecialReportCard';

interface BannerData {
  fixed: string[]; // 移出/掌握的假名
  failed: string[]; // 加重的假名
}

export const MistakeNotebook = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { speak } = useTTS();
  const { mistakes: mistakeRecords } = useMistakes();

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [isQuizConfirmOpen, setIsQuizConfirmOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [hasInitializedTab, setHasInitializedTab] = useState(false);

  useEffect(() => {
    // 如果已经初始化过，或者数据还没加载出来，就跳过
    if (hasInitializedTab || !mistakeRecords) return;

    // 临时计算一下数量 (为了不依赖下方的 useMemo，保证逻辑独立且迅速)
    let hCount = 0;
    let kCount = 0;
    Object.values(mistakeRecords).forEach((record) => {
      if (record.mistakeCount > 0 && record.streak < 2) {
        if (record.id.startsWith('h-')) hCount++;
        else if (record.id.startsWith('k-')) kCount++;
      }
    });

    // 🧠 核心判断逻辑：
    // 只有当 "平假名没有错题" 且 "片假名有错题" 时，才切到片假名。
    // 其他情况（都有、都没有、只有平假名有）默认就是 'hiragana'，不用动。
    if (hCount === 0 && kCount > 0) {
      setActiveTab('katakana');
    }

    // 标记为已初始化，以后不再自动乱跳
    setHasInitializedTab(true);
  }, [mistakeRecords, hasInitializedTab]);

  useEffect(() => {
    // 读取路由参数中的 sessionResults
    const sessionResults = location.state?.sessionResults as
      | Record<string, 'success' | 'fail'>
      | undefined;

    if (sessionResults && mistakeRecords) {
      const fixed: string[] = [];
      const failed: string[] = [];

      Object.entries(sessionResults).forEach(([id, status]) => {
        // @ts-ignore
        const originData = Object.values(KANA_DB).find((k: any) => k.id === id);
        const char = originData?.kana || id;

        if (status === 'success') {
          // 判定逻辑：本次答对了，且（不再错题本里了 OR 连对 >= 2）
          // 注意：mistakeRecords 此时已经是 Context 更新后的最新值
          const record = mistakeRecords[id];
          if (!record || record.mistakeCount === 0 || record.streak >= 2) {
            fixed.push(char);
          }
        } else {
          // 判定逻辑：本次答错了，肯定是被加重了
          failed.push(char);
        }
      });

      // 如果有变动，就显示横幅
      if (fixed.length > 0 || failed.length > 0) {
        setBannerData({ fixed, failed });

        // 🧹 清理：清除 location state，防止刷新页面或切后台回来重复显示
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, mistakeRecords]); // 依赖 location.state

  // 🔥 改动: 分别准备 Hiragana 和 Katakana 的错题 ID 列表
  // 这里既用于计算 Counts，也用于传给 QuizConfirmSheet
  const mistakeIds = useMemo(() => {
    const hIds: string[] = [];
    const kIds: string[] = [];

    if (mistakeRecords) {
      Object.values(mistakeRecords).forEach((record) => {
        if (record.mistakeCount > 0 && record.streak < 2) {
          if (record.id.startsWith('h-')) hIds.push(record.id);
          else if (record.id.startsWith('k-')) kIds.push(record.id);
        }
      });
    }
    return { hIds, kIds };
  }, [mistakeRecords]);

  // Counts 直接从上面的 IDs 取长度即可
  const counts = { h: mistakeIds.hIds.length, k: mistakeIds.kIds.length };
  const totalMistakes = counts.h + counts.k;

  // 列表显示用的 Items (受 Tab 限制)
  const displayItems = useMemo(() => {
    if (!mistakeRecords) return [];
    const prefix = activeTab === 'hiragana' ? 'h-' : 'k-';

    const list = Object.values(mistakeRecords)
      .filter(
        (record) =>
          record.id.startsWith(prefix) &&
          record.mistakeCount > 0 &&
          record.streak < 2
      )
      .map((record) => {
        // @ts-ignore
        const originData = Object.values(KANA_DB).find(
          (k: any) => k.id === record.id
        );
        if (!originData) return null;

        return {
          id: record.id,
          char: originData.kana,
          romaji: originData.romaji,
          mistakeCount: record.mistakeCount,
          streak: record.streak,
          kind: originData.kind,
          word: originData.word,
          wordKana: originData.wordKana,
          wordRomaji: originData.wordRomaji,
          meaning: originData.wordMeaning,
        };
      })
      .filter(Boolean) as MistakeItem[];

    list.sort((a, b) => b.mistakeCount - a.mistakeCount);
    return list;
  }, [mistakeRecords, activeTab]);

  // const handleTestAll = () => {
  //   if (allItems.length === 0) return;
  //   navigate('/quiz/session', {
  //     state: { mode: 'mistake_review', targetIds: allItems.map((i) => i.id) },
  //   });
  // };

  // banner 调试用
  // const debugTriggerBanner = () => {
  //   setBannerData({
  //     fixed: ['あ', 'い', 'う'], // 假装修好了这几个
  //     failed: ['か', 'き'], // 假装这几个又错了
  //   });
  // };

  const handleTestClick = () => {
    if (totalMistakes === 0) return;
    setIsQuizConfirmOpen(true);
  };
  const handleRealStart = (targetIds: string[]) => {
    setIsQuizConfirmOpen(false);
    navigate('/quiz/session', {
      state: {
        mode: 'mistake_review',
        targetIds: targetIds, // 使用用户勾选的 IDs
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <div className={styles.navBar}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate('/')} className={styles.iconBtn}>
              <ChevronLeft size={24} color="white" />
            </button>
            <div className={styles.title}>
              <span>{t('mistake_notebook.title')}</span>
              <button
                onClick={() => setIsHelpOpen(true)}
                className={styles.iconBtn}
                style={{ color: 'white' }}
              >
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
          {/* 标题 */}

          <div className={styles.headerRight}>
            {/* {allItems.length > 0 && (
              <button onClick={handleTestAll} className={styles.testBtn}>
                <Zap size={20} fill="currentColor" />
              </button>
            )} */}
            {totalMistakes > 0 && (
              <button onClick={handleTestClick} className={styles.testBtn}>
                <Zap size={20} fill="currentColor" />
              </button>
            )}
            {/* 🛠️ Banner 调试按钮 (调试完记得注销) */}
            {/* <button
              onClick={debugTriggerBanner}
              style={{
                fontSize: 12,
                marginRight: 8,
                border: '1px solid red',
                color: 'red',
                background: 'none',
              }}
            >
              Debug
            </button> */}
          </div>
        </div>

        {/* 🔥 Tab 栏：把 counts 显示在 label 里 */}
        <div className={styles.tabBar}>
          <CategoryTabs
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as any)}
            options={[
              {
                id: 'hiragana',
                // 显示格式：平假名 (12)
                label: `${t('kana_dictionary.tabs.hiragana')} ${counts.h > 0 ? `(${counts.h})` : ''}`,
              },
              {
                id: 'katakana',
                label: `${t('kana_dictionary.tabs.katakana')} ${counts.k > 0 ? `(${counts.k})` : ''}`,
              },
            ]}
          />
        </div>
      </div>

      {/* ========================================================= */}

      <div className={styles.listArea}>
        <AnimatePresence>
          {bannerData && (
            <SpecialReportCard
              key="report-card" // 必须有 key
              data={bannerData}
              onDismiss={() => setBannerData(null)}
            />
          )}
        </AnimatePresence>
        <motion.div layout="position" className={styles.listWrapper}>
          {displayItems.length === 0 ? (
            <div className={styles.emptyState}>
              <span style={{ fontSize: 48 }}>🎉</span>
              <p>{t('mistake_notebook.empty')}</p>
            </div>
          ) : (
            <MistakeRowCard
              items={displayItems}
              onPlaySound={speak}
              onBadgeClick={() => setIsHelpOpen(true)}
            />
          )}
        </motion.div>
      </div>

      <QuizConfirmSheet
        isOpen={isQuizConfirmOpen}
        onClose={() => setIsQuizConfirmOpen(false)}
        onConfirm={handleRealStart}
        hMistakeIds={mistakeIds.hIds}
        kMistakeIds={mistakeIds.kIds}
        defaultTab={activeTab}
      />

      <RulesHelpSheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default MistakeNotebook;
