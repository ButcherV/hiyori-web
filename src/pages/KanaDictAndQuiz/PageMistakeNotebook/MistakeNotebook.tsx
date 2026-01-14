import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Zap,
  PartyPopper,
  AlertTriangle,
  X,
  HelpCircle,
} from 'lucide-react';
import { useMistakes } from '../../../context/MistakeContext';
import { KANA_DB } from '../../../datas/kanaData';
import { CategoryTabs } from '../../../components/CategoryTabs';
import { useTTS } from '../../../hooks/useTTS';
import { MistakeRowCard, type MistakeItem } from './MistakeRowCard';
import styles from './MistakeNotebook.module.css';
import { QuizConfirmSheet } from './QuizConfirmSheet';
import { RulesHelpSheet } from './RulesHelpSheet';

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

        // ⏲️ 倒计时：6 秒后自动关闭
        const timer = setTimeout(() => setBannerData(null), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.state, mistakeRecords]); // 依赖 location.state

  const counts = useMemo(() => {
    let hCount = 0;
    let kCount = 0;

    if (mistakeRecords) {
      Object.values(mistakeRecords).forEach((record) => {
        // ✅ 修正：只有“犯过错” 且 “连对次数不足 2 次”的才算有效错题
        if (record.mistakeCount > 0 && record.streak < 2) {
          if (record.id.startsWith('h-')) hCount++;
          else if (record.id.startsWith('k-')) kCount++;
        }
      });
    }
    return { h: hCount, k: kCount };
  }, [mistakeRecords]);

  const allItems = useMemo(() => {
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

    // 排序：错误次数高 -> 低
    list.sort((a, b) => b.mistakeCount - a.mistakeCount);

    return list;
  }, [mistakeRecords, activeTab]);

  const handleTestAll = () => {
    if (allItems.length === 0) return;
    navigate('/quiz/session', {
      state: { mode: 'mistake_review', targetIds: allItems.map((i) => i.id) },
    });
  };

  // const debugTriggerBanner = () => {
  //   setBannerData({
  //     fixed: ['あ', 'い', 'う'], // 假装修好了这几个
  //     failed: ['か', 'き'], // 假装这几个又错了
  //   });
  // };
  // 🟢 点击闪电：不再直接跳转，而是打开确认面板
  const handleTestClick = () => {
    if (allItems.length === 0) return;
    setIsQuizConfirmOpen(true);
  };

  // 🟢 确认面板中的“开始”：这才是真正的跳转
  const handleRealStart = () => {
    setIsQuizConfirmOpen(false);
    navigate('/quiz/session', {
      state: { mode: 'mistake_review', targetIds: allItems.map((i) => i.id) },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <div className={styles.navBar}>
          <div className={styles.headerLeft}>
            <button onClick={() => navigate(-1)} className={styles.iconBtn}>
              <ChevronLeft size={24} color="#007AFF" />
            </button>
            <div className={styles.title}>{t('mistake_notebook.title')}</div>
            <button
              onClick={() => setIsHelpOpen(true)}
              className={styles.iconBtn}
              style={{ marginRight: 8, color: '#8E8E93' }}
            >
              <HelpCircle size={20} />
            </button>
          </div>
          {/* 标题 */}

          <div className={styles.headerRight}>
            {/* {allItems.length > 0 && (
              <button onClick={handleTestAll} className={styles.testBtn}>
                <Zap size={20} fill="currentColor" />
              </button>
            )} */}
            {allItems.length > 0 && (
              <button onClick={handleTestClick} className={styles.testBtn}>
                <Zap size={20} fill="currentColor" />
              </button>
            )}
            {/* 🛠️ 调试按钮 (调试完记得删掉) */}
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

        {/* 🔥 3. Tab 栏：把 counts 显示在 label 里 */}
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
      {/* 结算反馈横幅 (Banner) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {bannerData && (
          <motion.div
            className={styles.banner}
            // 进场动画
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            // 离场动画
            exit={{ height: 0, opacity: 0 }}
            // 过渡效果
            transition={{ duration: 0.3 }}
            // 防止布局溢出，内容裁剪
            style={{ overflow: 'hidden' }}
          >
            <div className={styles.bannerContent}>
              {/* 移出提示 */}
              {bannerData.fixed.length > 0 && (
                <div className={`${styles.bannerRow} ${styles.fixedRow}`}>
                  <PartyPopper size={16} />
                  <span>
                    {t('mistake_notebook.banner_fixed', '移出')}:{' '}
                    <span className={`jaFont`}>
                      {bannerData.fixed.join(', ')}
                    </span>
                  </span>
                </div>
              )}
              {/* 加重提示 */}
              {bannerData.failed.length > 0 && (
                <div className={`${styles.bannerRow} ${styles.failedRow}`}>
                  <AlertTriangle size={16} />
                  <span>
                    {t('mistake_notebook.banner_failed', '加重')}:{' '}
                    <span className={`jaFont`}>
                      {bannerData.failed.join(', ')}
                    </span>
                  </span>
                </div>
              )}
            </div>
            {/* 关闭按钮 */}
            <button
              className={styles.closeBannerBtn}
              onClick={() => setBannerData(null)}
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ========================================================= */}

      <div className={styles.listArea}>
        {allItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span style={{ fontSize: 48 }}>🎉</span>
            <p>{t('mistake_notebook.empty', '暂无错题！')}</p>
          </div>
        ) : (
          <MistakeRowCard
            items={allItems}
            onPlaySound={speak}
            onBadgeClick={() => setIsHelpOpen(true)}
          />
        )}
      </div>

      <QuizConfirmSheet
        isOpen={isQuizConfirmOpen}
        onClose={() => setIsQuizConfirmOpen(false)}
        onConfirm={handleRealStart}
        count={allItems.length}
      />

      <RulesHelpSheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
};

export default MistakeNotebook;
