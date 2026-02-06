import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play, X, Dices, RotateCcw, Lock } from 'lucide-react';

import { KanaBoard } from '../KanaBoard';
import { KANA_DB } from '../../../datas/kanaData';
import styles from './KanaQuizSelectionPage.module.css';
import { useMistakes } from '../../../context/MistakeContext';
import { Toast } from '../../../components/Toast/Toast';

export const KanaQuizSelectionPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { proficiencyMap, mistakes } = useMistakes();

  const [activeTab, setActiveTab] = useState<'hiragana' | 'katakana'>(
    'hiragana'
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const MIN_SELECTION = 5;
  const MAX_SELECTION = 12;
  const MISTAKE_LIMIT = 20;

  // Toast 状态管理
  const [showLimitToast, setShowLimitToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

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

  // =========================================================
  // 实时计算两边的错题数
  // =========================================================
  const mistakeCounts = useMemo(() => {
    let h = 0,
      k = 0;
    if (mistakes) {
      Object.values(mistakes).forEach((r) => {
        // 有效错题：错误次数 > 0 且 未被移出 (streak < 2)
        if (r.mistakeCount > 0 && r.streak < 2) {
          if (r.id.startsWith('h-')) h++;
          else if (r.id.startsWith('k-')) k++;
        }
      });
    }
    return { h, k };
  }, [mistakes]);

  // =========================================================
  // 生成黑名单 (disabledIds)
  // =========================================================
  const disabledIds = useMemo(() => {
    const ids = new Set<string>();

    const hLocked = mistakeCounts.h >= MISTAKE_LIMIT;
    const kLocked = mistakeCounts.k >= MISTAKE_LIMIT;

    // 如果都没锁，直接返回空，性能最优
    if (!hLocked && !kLocked) return ids;

    // 遍历数据库，找出需要封杀的 ID
    // @ts-ignore
    Object.values(KANA_DB).forEach((item: any) => {
      const id = item.id;
      // 检查是否是“有效错题”(红点)
      const record = mistakes?.[id];
      const isMistake = record && record.mistakeCount > 0 && record.streak < 2;

      // 逻辑A: 平假名爆仓 且 该ID是平假名 且 不是错题 -> 封杀
      if (hLocked && id.startsWith('h-') && !isMistake) {
        ids.add(id);
      }
      // 逻辑B: 片假名爆仓 且 该ID是片假名 且 不是错题 -> 封杀
      else if (kLocked && id.startsWith('k-') && !isMistake) {
        ids.add(id);
      }
    });

    return ids;
  }, [mistakeCounts, mistakes]);

  // =========================================================
  // Toast 触发逻辑
  // =========================================================
  const triggerToast = useCallback(() => {
    setShowLimitToast(true);

    // 使用 ref.current 读取和清除定时器
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    // 设置新定时器
    toastTimerRef.current = setTimeout(() => {
      setShowLimitToast(false);
    }, 4000);
  }, []);

  const isLocked = useMemo(() => {
    return activeTab === 'hiragana'
      ? mistakeCounts.h >= MISTAKE_LIMIT
      : mistakeCounts.k >= MISTAKE_LIMIT;
  }, [activeTab, mistakeCounts]);

  useEffect(() => {
    if (isLocked) {
      triggerToast();
    } else {
      setShowLimitToast(false);
    }
  }, [isLocked, triggerToast, activeTab]);

  // =========================================================
  // 🔥 核心修正：基于 Context 状态统计当前 Tab 数量
  // =========================================================
  const currentTabStats = useMemo(() => {
    // 初始化计数器
    const stats = { new: 0, weak: 0, mastered: 0, perfect: 0 };
    const prefix = activeTab === 'hiragana' ? 'h-' : 'k-';

    // 遍历数据库中的所有假名
    // @ts-ignore
    Object.values(KANA_DB).forEach((item: any) => {
      // 1. 过滤：只统计当前 Tab 的假名
      if (!item?.id || !item.id.startsWith(prefix)) return;

      // 2. 直接读取 Context 里的状态 ('perfect', 'mastered', 'weak' 或 undefined)
      const status = proficiencyMap[item.id];

      // 3. 根据状态归类
      switch (status) {
        case 'perfect':
          stats.perfect++;
          break;
        case 'mastered':
          stats.mastered++;
          break;
        case 'weak':
          stats.weak++;
          break;
        default:
          // Context 中没有记录 (undefined)，或者逻辑上不算上述三种的，都算 New
          stats.new++;
          break;
      }
    });

    return stats;
  }, [activeTab, proficiencyMap]); // 依赖项：切换 Tab 或 Context 变动时重算

  const tabOptions = useMemo(() => {
    const hLocked = mistakeCounts.h >= MISTAKE_LIMIT;
    const kLocked = mistakeCounts.k >= MISTAKE_LIMIT;

    return [
      {
        id: 'hiragana',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {t('kana_dictionary.tabs.hiragana')}
            {hLocked && <Lock size={14} color="#FF9500" strokeWidth={2.5} />}
          </div>
        ),
      },
      {
        id: 'katakana',
        label: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {t('kana_dictionary.tabs.katakana')}
            {kLocked && <Lock size={14} color="#FF9500" strokeWidth={2.5} />}
          </div>
        ),
      },
    ];
  }, [t, mistakeCounts]);

  const handleItemClick = (data: any) => {
    const id = data.id;
    if (disabledIds.has(id)) return;
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
    if (isLocked) {
      triggerToast();
      return;
    }
    // A. 确定当前的 ID 前缀 (h- 或 k-)，只在当前 Tab 内随机
    const prefix = activeTab === 'hiragana' ? 'h-' : 'k-';

    // B. 从 KANA_DB 中筛选出所有符合当前 Tab 的 ID
    // @ts-ignore
    const validIds = Object.values(KANA_DB)
      .filter((item: any) => item?.id && item.id.startsWith(prefix))
      .map((item: any) => item.id);

    if (validIds.length === 0) return;

    // C. 随机决定要选多少个 (5 到 12 之间)
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

  // 暂时留空，不做 Toast
  const handleDisabledClick = () => {
    triggerToast();
  };

  // 图例数据
  const legendConfig = useMemo(
    () => [
      {
        key: 'new',
        label: t('kana_quiz.legend.new') || 'New',
        count: currentTabStats.new,
        dotClass: styles.dotNew,
      },
      {
        key: 'weak',
        label: t('kana_quiz.legend.weak') || 'Weak',
        count: currentTabStats.weak,
        dotClass: styles.dotWeak,
      },
      {
        key: 'mastered',
        label: t('kana_quiz.legend.mastered') || 'Mastered',
        count: currentTabStats.mastered,
        dotClass: styles.dotMastered,
      },
      {
        key: 'perfect',
        label: t('kana_quiz.legend.perfect') || 'Perfect',
        count: currentTabStats.perfect,
        dotClass: styles.dotPerfect,
      },
    ],
    [t, currentTabStats]
  ); // 依赖翻译和统计数据

  // 是否显示图例？
  // 逻辑：只要有 "非 New" 的数据 (即 Weak, Mastered, Perfect 任意一个大于 0)，就代表用户开始学了，显示图例。
  const showLegend = useMemo(() => {
    return (
      currentTabStats.weak > 0 ||
      currentTabStats.mastered > 0 ||
      currentTabStats.perfect > 0
    );
  }, [currentTabStats]);

  const toastMessage = t('kana_quiz.limit_toast.title', {
    tab:
      activeTab === 'hiragana'
        ? t('kana_dictionary.tabs.hiragana')
        : t('kana_dictionary.tabs.katakana'),
  });

  // 描述里还需要 limit
  const toastDesc = t('kana_quiz.limit_toast.desc', { limit: MISTAKE_LIMIT });

  return (
    <div style={{ height: '100%' }}>
      <Toast
        isVisible={showLimitToast}
        message={toastMessage}
        description={toastDesc}
      />
      <KanaBoard
        activeTab={activeTab}
        tabOptions={tabOptions}
        title={t('kana_quiz.selection_title')}
        seionTitle={t('kana_dictionary.sections.seion')}
        dakuonTitle={t('kana_dictionary.sections.dakuon')}
        yoonTitle={t('kana_dictionary.sections.yoon')}
        onBackClick={() => navigate('/')}
        onTabChange={setActiveTab}
        onItemClick={handleItemClick}
        isSelectionMode={true}
        selectedIds={selectedIds}
        showRomaji={true}
        proficiencyMap={proficiencyMap}
        disabledIds={disabledIds}
        onDisabledItemClick={handleDisabledClick}
        headerRight={
          <div className={styles.iconGroup}>
            {!isLocked && (
              <div
                className={styles.iconBtn}
                onClick={handleRandomSelection}
                aria-label={t('kana_quiz.aria.random')}
              >
                <Dices size={22} />
              </div>
            )}

            {/* 重置按钮：仅当有选中项时显示 (或者也可以设为 disabled) */}
            {selectedIds.size > 0 && (
              <div
                className={styles.iconBtn}
                onClick={() => setSelectedIds(new Set())}
                aria-label={t('kana_quiz.aria.reset')}
              >
                <RotateCcw size={22} />
              </div>
            )}
          </div>
        }
        footer={
          <div className={styles.footer}>
            {/* 选中项预览条 (存在时显示) */}
            {selectedItems.length > 0 && (
              <div className={styles.previewBar}>
                <div className={styles.previewScroll}>
                  {selectedItems.map((item) => {
                    const status = proficiencyMap?.[item.id];
                    return (
                      <div
                        key={item.id}
                        className={styles.previewTag}
                        onClick={() => handleItemClick(item)}
                      >
                        {/* 🔥 3. 将样式应用在 span 上 */}
                        {status === 'weak' && (
                          <div
                            className={`${styles.statusDot} ${styles.dotWeak}`}
                          />
                        )}
                        {status === 'mastered' && (
                          <div
                            className={`${styles.statusDot} ${styles.dotMastered}`}
                          />
                        )}
                        {status === 'perfect' && (
                          <div
                            className={`${styles.statusDot} ${styles.dotPerfect}`}
                          />
                        )}
                        <span className={`${styles.previewChar} jaFont`}>
                          {item.kana}
                        </span>
                        <X size={12} className={styles.removeIcon} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/*  图例横条 (Legend Bar) */}
            {showLegend && (
              <div className={styles.legendBar}>
                {legendConfig.map((item) => (
                  <div
                    key={item.key}
                    className={styles.legendItem}
                    title={item.label}
                  >
                    <div className={`${styles.legendDot} ${item.dotClass}`} />
                    <span className={styles.legendCount}>{item.count}</span>
                    <span className={styles.legendLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 底部操作内容 (Start 按钮等) */}
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
                className={`${styles.startBtn} btn-base btn-primary`}
                disabled={selectedIds.size < MIN_SELECTION}
                onClick={handleStartQuiz}
              >
                <Play size={18} fill="currentColor" />
                <span style={{ marginLeft: 4 }}>
                  {t('kana_quiz.start_btn')}
                </span>
              </button>
            </div>
          </div>
        }
      />
    </div>
  );
};
