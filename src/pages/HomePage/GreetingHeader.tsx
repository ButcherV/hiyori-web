import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FlipText } from './FlipText'; // 引入上面的组件
import styles from './GreetingHeader.module.css';
import { App } from '@capacitor/app';

import {
  getJapaneseGreeting,
  getJapaneseDateStr,
  getJapaneseWeekday,
  getJapaneseHoliday,
  isRedDay,
} from '../../utils/dateHelper';

export function GreetingHeader() {
  const { t, i18n } = useTranslation();

  // 状态：'jp' = 日语, 'local' = 本地语言
  const [mode, setMode] = useState<'jp' | 'local'>('jp');

  // 定时器：每 x 秒切换一次
  // 新增两个状态：控制重置动画(resetKey) 和 记录App前后台状态(isActive)
  const [resetKey, setResetKey] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // 2. 新增监听：专门处理 IOS 切后台的逻辑
  useEffect(() => {
    const handle = App.addListener('appStateChange', ({ isActive }) => {
      setIsActive(isActive); // 更新状态

      // 如果回到了前台，让 resetKey + 1
      // 这会强制 React 销毁并重建整个组件，彻底消除卡顿
      if (isActive) {
        setResetKey((prev) => prev + 1);
      }
    });

    return () => {
      handle.then((h) => h.remove());
    };
  }, []);

  // 3. 修改定时器：增加 (!isActive) 判断
  useEffect(() => {
    // ⚠️ 如果 App 在后台，直接 return，不执行任何切换逻辑
    if (!isActive) return;

    const timer = setInterval(() => {
      setMode((prev) => (prev === 'jp' ? 'local' : 'jp'));
    }, 10000);
    return () => clearInterval(timer);
  }, [isActive]);

  // 数据计算核心逻辑
  // 数据计算核心逻辑
  const content = useMemo(() => {
    const now = new Date();

    // 🛠️ 定义一个处理函数：给数字两边加上“窄空格”
    // \u2009 是 Thin Space，比普通空格窄很多，非常精致
    const formatWithSpacing = (str: string) => {
      const thinSpace = '\u2009';
      return str.replace(/(\d+)/g, `${thinSpace}$1${thinSpace}`).trim();
    };

    if (mode === 'jp') {
      // --- 🇯🇵 日语模式 ---
      const isRed = isRedDay(now);
      const holiday = getJapaneseHoliday(now);

      // 1. 获取原始日期串 (如 "1月8日")
      const rawDate = getJapaneseDateStr(now);
      // 2. 加窄空格 (如 "1 月 8 日")
      const formattedDate = formatWithSpacing(rawDate);

      const weekday = getJapaneseWeekday(now);

      // 3. 拼接：日期 + 窄空格 + 星期
      let fullDateText = `${formattedDate} ${weekday}`;

      // 如果有节日，也拼上去
      if (holiday) fullDateText += ` · ${holiday}`;

      return {
        greeting: getJapaneseGreeting(now),
        date: fullDateText,
        isRed,
        isJapanese: true,
      };
    } else {
      // --- 🇨🇳/🇺🇸 本地模式 ---
      const h = now.getHours();
      let timeKey = 'morning';
      if (h >= 12) timeKey = 'afternoon';
      if (h >= 18) timeKey = 'evening';

      const greeting = t(`home.greeting.${timeKey}`);

      // 1. 获取日期 (如 "1月8日" 或 "Jan 8")
      const rawDate = new Intl.DateTimeFormat(i18n.language, {
        month: 'short',
        day: 'numeric',
      }).format(now);

      // 2. 加窄空格 (如 "1 月 8 日")
      // 如果是英文 "Jan 8"，变成 "Jan 8" (只会稍微宽一点点，看不出问题)
      const datePart = formatWithSpacing(rawDate);

      // 3. 获取星期
      const weekdayPart = new Intl.DateTimeFormat(i18n.language, {
        weekday: 'short',
      }).format(now);

      // 4. 拼接
      const localDate = `${datePart} ${weekdayPart}`;

      return {
        greeting,
        date: localDate,
        isRed: false,
        isJapanese: false,
      };
    }
  }, [mode, t, i18n.language]);

  const getFontClass = () => {
    // 1. 如果是日语模式，直接返回日语字体
    if (content.isJapanese) {
      return styles.jpFont;
    }

    // 2. 如果是本地模式，检查具体语言代码
    // i18n.language 可能是 'zh-CN', 'zh-TW', 'en-US', 'en' 等
    const lang = i18n.language || 'en';

    if (lang.startsWith('zh')) {
      return styles.zhFont; // 中文：用描边方案
    }

    // 3. 默认当成英文处理
    return styles.enFont; // 英文：用 Arial Black
  };

  return (
    <div className={styles.container} key={resetKey}>
      {/* 1. 问候语区域 (3D 翻转) */}
      <div className={styles.greetingBox}>
        <FlipText text={content.greeting} className={getFontClass()} />
      </div>

      {/* 2. 日期区域 (淡入淡出) */}
      <div className={styles.dateBox}>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode} // key 变化触发切换动画
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
            className={`
              ${styles.dateText} 
              ${content.isRed ? styles.holiday : ''}
              ${content.isJapanese ? styles.jpFontSmall : ''}
            `}
          >
            {content.date}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
