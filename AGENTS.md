# Hiyori - 日语学习应用

> **项目定位**: 一款专注于日语入门学习的交互式 Web/App 应用，主打假名（平假名/片假名）学习与趣味测验，同时包含数字、日期、时钟等实用日语模块。

---

## 1. 技术栈概览

| 层级 | 技术 |
|------|------|
| **框架** | React 19 + TypeScript |
| **构建工具** | Vite (rolldown-vite@7.2.5) |
| **移动端** | Capacitor 8 (iOS App) |
| **路由** | React Router DOM 7 |
| **动画** | Framer Motion |
| **3D 渲染** | Three.js + @react-three/fiber + @react-three/drei |
| **国际化** | i18next + react-i18next |
| **状态管理** | React Context (Settings/Progress/Mistake) |
| **样式** | CSS Modules + CSS Variables |
| **图标** | Lucide React |
| **日期处理** | date-fns |
| **物理引擎** | cannon-es (骰子物理) |
| **节日数据** | japanese-holidays |

---

## 2. 项目结构

```
src/
├── App.tsx                    # 根组件，处理引导页逻辑
├── main.tsx                   # 入口，注入 Context Providers
├── types.ts                   # 核心类型定义 (Vocabulary, QuizMode, QuizQuestion)
├── data.ts                    # 词汇数据 (RAW_DATA)
├── engine.ts                  # 测验题目生成引擎
├── router/
│   └── AppRouter.tsx          # 路由配置 + 页面转场动画 + App状态监听
├── i18n/
│   ├── index.ts               # i18n 配置
│   └── locales/               # 语言文件
│       ├── en.json
│       ├── zh.json            # 简体中文
│       └── zh-Hant.json       # 繁体中文
├── context/
│   ├── SettingsContext.tsx    # 应用设置 (主题、语言、学习偏好)
│   ├── ProgressContext.tsx    # 学习进度 + 活动热力图
│   └── MistakeContext.tsx     # 错题本管理
├── hooks/
│   ├── useTTS.ts              # 日语语音合成 (Web Speech API)
│   ├── useSound.ts            # 音效播放
│   └── useScrollShadow.ts     # 滚动阴影效果
├── utils/
│   ├── dateHelper.ts          # 日期处理工具
│   └── generalTools.ts        # 通用工具函数
├── styles/
│   ├── variables.css          # CSS 变量 (颜色、字体、间距)
│   ├── global.css             # 全局样式 + 工具类
│   ├── reset.css              # 样式重置
│   └── ios.css                # iOS 特定样式
├── components/                # 通用组件
│   ├── BottomSheet/           # 底部抽屉
│   ├── LessonMenu/            # 课程选择菜单
│   ├── TinderCard/            # 卡片学习组件 (Tinder 滑动)
│   ├── TraceCard/             # 描红练习组件
│   ├── QuizSession.tsx        # 测验会话管理
│   ├── QuizHeader.tsx         # 测验头部
│   ├── QuizActionButtons/     # 测验操作按钮
│   ├── CompletionScreen/      # 完成页面
│   ├── StatsHeatmap/          # 学习热力图
│   ├── AppSettingsMenu/       # 设置菜单
│   ├── CategoryTabs/          # 分类标签
│   ├── Switch/                # 开关组件
│   ├── Toast/                 # 轻提示
│   ├── Dice/                  # 3D 骰子组件
│   ├── LevelNav/              # 关卡导航
│   ├── OriginBadge/           # 来源标签
│   ├── PageHeader/            # 页面头部
│   └── MistakeModal.tsx       # 错题弹窗
├── pages/                     # 页面组件
│   ├── HomePage/              # 首页 + Hero 滚动
│   ├── Onboarding/            # 新用户引导
│   ├── KanaDictAndQuiz/       # 假名学习核心模块
│   │   ├── PageKanaDictionary/  # 假名字典 + 描红
│   │   ├── PageKanaQuiz/        # 测验选择与会话
│   │   ├── PageMistakeNotebook/ # 错题本
│   │   ├── KanaBoard.tsx        # 假名棋盘组件
│   │   └── KanaTable.tsx        # 假名表格组件
│   ├── TestStudySession/      # 学习会话 (Tinder 卡片)
│   ├── Numbers/               # 数字学习模块
│   │   ├── PageNumbers.tsx    # 数字学习主页
│   │   ├── Translator/        # 数字翻译机
│   │   └── Levels/            # 分级学习 (Level 1-4)
│   │       ├── Level1/        # 基础数字 (0-10)
│   │       ├── Level2/        # 十位组合
│   │       ├── Level3/        # 百位 + 音便规则
│   │       ├── Level4/        # 千位 + 音便规则
│   │       ├── NumberKeypad.tsx    # 数字键盘
│   │       ├── SplitNumberLearn.tsx # 分屏学习组件
│   │       └── ModeToggleFAB.tsx   # 模式切换按钮
│   ├── Dates/                 # 日期学习模块
│   │   ├── PageDates.tsx      # 日期学习主页
│   │   ├── components/        # 子组件
│   │   │   ├── DateDetailPanel/   # 日期详情面板
│   │   │   ├── DateHelp/          # 日期帮助
│   │   │   ├── DayLearning/       # 日期学习
│   │   │   ├── HolidayLearning/   # 节日学习
│   │   │   ├── MonthLearning/     # 月份学习
│   │   │   ├── RelativeTimeLearning/ # 相对时间学习
│   │   │   ├── SmartCalendar/     # 智能日历
│   │   │   ├── WeekLearning/      # 周学习
│   │   │   └── YearLearning/      # 年学习
│   │   └── Datas/             # 日期数据
│   │       ├── DateDetailData.ts
│   │       ├── DayData.tsx
│   │       ├── EraData.ts
│   │       ├── holidayData.ts
│   │       ├── MonthData.ts
│   │       ├── RelativeTimeData.ts
│   │       └── YearData.tsx
│   ├── Clock/                 # 时钟学习模块
│   │   ├── PageClock.tsx      # 时钟学习主页
│   │   ├── TimeDrumPicker.tsx # 滚筒时间选择器
│   │   ├── Drum.tsx           # 滚筒组件
│   │   ├── TimeDisplay.tsx    # 时间显示
│   │   ├── TimeFormatToggle.tsx # 12/24小时切换
│   │   └── SpecialTimeShortcuts.tsx # 特殊时间快捷键
│   └── DicePage.tsx           # 3D 骰子
└── datas/                     # 静态数据
    ├── kanaData/              # 假名数据结构
    ├── kanaDataCategory.ts    # 假名分类数据
    └── kanaPaths.ts           # SVG 描红路径
```

---

## 3. 核心功能模块

### 3.1 假名学习 (Kana)

**数据模型** (`types.ts`):
```typescript
interface Vocabulary {
  id: string;
  tags: string[];        // ['n5', 'brand', 'color']
  kanji: string;         // 显示文字（可能是汉字或假名）
  kana: string;          // 假名读音
  romaji: string;        // 罗马音
  meaning: { zh: string; en: string };
  visual?: {             // 视觉增强 (可选)
    type: 'EMOJI' | 'CSS_COLOR' | 'BRAND_COLOR';
    value: string;
  };
  widget?: {             // 交互组件 (可选)
    type: 'CLOCK' | 'AUDIO';
    value: string;
  };
}
```

**测验模式** (`QuizMode`):
- `KANA_FILL_BLANK`: 挖空填空（核心玩法）
- `KANA_TO_ROMAJI`: 假名认读
- `ROMAJI_TO_KANA`: 罗马音拼写
- `WORD_TO_MEANING`: 单词翻译
- `MEANING_TO_WORD`: 反向翻译
- `KANJI_TO_KANA` / `KANA_TO_KANJI`: 汉字假名互认
- `WORD_TO_EMOJI` / `EMOJI_TO_WORD`: 图文匹配
- `WORD_TO_COLOR` / `BRAND_TO_NAME`: 颜色/品牌识别
- `CLOCK_INTERACT`: 时钟交互
- `AUDIO_TO_WORD`: 听写

**学习流程**:
1. 首页选择平假名/片假名 → 弹出课程菜单
2. 进入学习会话 (`TestStudySession`) → Tinder 卡片滑动学习
3. 学习完成 → 测验 (`PageQuizSession`)
4. 测验通过 → 标记完成 (`markLessonComplete`)

### 3.2 数字学习 (Numbers)

- **数字翻译机**: 输入任意数字，实时显示日语读法 + TTS 播放
- **分级学习**: 
  - Level 1: 基础数字 (0-10)
  - Level 2: 十位组合
  - Level 3: 百位 + 音便规则
  - Level 4: 千位 + 音便规则
- **关卡解锁**: 线性解锁机制，完成上一关才能进入下一关
- **组件架构**: 每个关卡包含 Learn/Test 模式，支持 `SplitNumberLearn` 分屏学习

### 3.3 日期学习 (Dates)

- **智能日历**: 显示当前月份，支持日期选择
- **分级学习模块**:
  - `DayLearning`: 日期读法 (1日-31日)
  - `MonthLearning`: 月份读法
  - `WeekLearning`: 星期读法
  - `YearLearning`: 年份读法
  - `RelativeTimeLearning`: 相对时间 (今天、明天等)
  - `HolidayLearning`: 日本节日学习
- **年号系统**: 支持昭和、平成、令和等日本年号

### 3.4 时钟学习 (Clock)

- **滚筒时间选择器** (`TimeDrumPicker`): 类似 iOS 滚轮的交互方式
- **时间格式切换**: 支持 12/24 小时制
- **特殊发音快捷键**: 快速跳转到特殊发音时间点 (4時、7時、9時、9時半)
- **日语时间显示**: 实时显示日语时间读法

### 3.5 错题本 (Mistake Notebook)

**移出机制**: 连续答对 2 轮次才能从错题本移出
- 首次答对：显示绿色半环标记
- 第二次连续答对：彻底移出

### 3.6 3D 骰子

- 使用 Three.js + cannon-es 物理引擎
- 支持双击重置、触觉反馈

---

## 4. 状态管理

### SettingsContext
```typescript
interface AppSettings {
  autoAudio: boolean;           // 自动播放音频
  soundEffect: boolean;         // 音效开关
  hapticFeedback: boolean;      // 触觉反馈
  showRomaji: boolean;          // 显示罗马音
  theme: 'light' | 'dark';
  uiLanguage: UILang;           // 'en' | 'zh' | 'zh-Hant'
  kanjiBackground: boolean;     // 结合汉字学习
  hasFinishedOnboarding: boolean;
  lastActiveCourseId: string;   // 上次学习的课程
  lastHiraganaTab: string;      // 平假名上次标签
  lastKatakanaTab: string;      // 片假名上次标签
  lastNumberLevel: string;      // 数字学习进度
  viewedNumberIntros: string[]; // 已看过的关卡说明
}
```

### ProgressContext
- `completedLessons`: 已完成的课程列表
- `activityLog`: 每日学习次数记录 `{ "2024-01-01": 5 }`

### MistakeContext
- 按平假名/片假名分别记录错题
- 支持错题突击测验

---

## 5. 路由与导航

| 路径 | 页面 | 深度 |
|------|------|------|
| `/` | 首页 | 1 |
| `/study/kana/:courseId` | 假名学习 | 2 |
| `/kana-dictionary` | 假名字典 | 2 |
| `/quiz/selection` | 测验选题 | 2 |
| `/quiz/session` | 测验会话 | 3 |
| `/mistake-book` | 错题本 | 2 |
| `/study/numbers` | 数字学习 | 2 |
| `/study/numbers/translator` | 数字翻译机 | 3 |
| `/study/dates` | 日期学习 | 2 |
| `/study/clock/drum` | 时钟学习 | 2 |
| `/dice` | 3D 骰子 | 2 |

**转场动画**: 使用 Framer Motion `AnimatePresence`，根据路由深度判断前进/后退方向

**App 状态管理**: 后台超过 3 分钟返回时自动跳转首页

---

## 6. 样式规范

### CSS 变量 (`variables.css`)
```css
/* 主色调 */
--color-primary: #ff4500;       /* 鸟居红 */
--color-bg: #f9f9f7;            /* 和纸白 */
--color-card-bg: #ffffff;
--color-text-main: #2d2d2d;     /* 墨黑 */
--color-success: #34c759;       /* 抹茶绿 */
--color-error: #ff3b30;

/* 圆角与阴影 */
--radius-card: 16px;
--radius-button: 99px;
--shadow-card: 0 8px 24px rgba(0, 0, 0, 0.08);

/* 字体 */
--font-family-ui: -apple-system, 'Noto Sans SC', 'PingFang SC', sans-serif;
--font-family-ja: 'Hiragino Kaku Gothic ProN', 'Meiryo', 'Noto Sans JP', sans-serif;
```

### 熟练度状态色
- **生疏 (Weak)**: 红色系 `--color-weak-*`
- **已掌握 (Mastered)**: 绿色系 `--color-mastered-*`
- **精通 (Perfect)**: 金色系 `--color-perfect-*`

### 日期学习专用色
- **周六**: 冰蓝 `--color-date-sat-bg`
- **周日**: 玫瑰红 `--color-date-sun-bg`
- **节日**: 警示红 `--color-date-holiday`
- **选中态**: 深邃皇家蓝 `--color-date-selected-bg`

### 音便类型色
- **规则 (Regular)**: 浅灰底深灰字
- **陷阱 (Trap)**: 警示黄
- **变异 (Mutant)**: 活力橙/红
- **符文 (Rune)**: 核心紫

---

## 7. 国际化 (i18n)

支持语言:
- `en`: 英语
- `zh`: 简体中文
- `zh-Hant`: 繁体中文

使用方式:
```typescript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
t('home.greeting.morning'); // "早上好！"
```

切换语言时自动同步到 `i18n.changeLanguage()`。

---

## 8. 构建与开发

### 命令
```bash
npm run dev       # 开发服务器 (host 模式)
npm run build     # 生产构建 (tsc + vite build)
npm run preview   # 预览构建结果
npm run lint      # ESLint 检查
```

### Capacitor iOS 构建
```bash
npm run build
npx cap sync ios
npx cap open ios
```

### 关键配置
- **vite.config.ts**: 使用 `@vitejs/plugin-react`，配置代码分割策略
- **capacitor.config.ts**: `webDir: 'dist'`，启动屏配置
- **tsconfig.json**: 项目引用配置 (`tsconfig.app.json` + `tsconfig.node.json`)

### 代码分割策略
```typescript
// vite.config.ts - manualChunks 配置
'three' / '@react-three' → 'chunk-three'
'framer-motion' → 'chunk-motion'
'react' / 'react-dom' / 'react-router' → 'chunk-react'
```

---

## 9. 开发约定

### 组件结构
```typescript
// 1. 组件文件使用 PascalCase
// 2. 样式文件使用 CSS Modules: ComponentName.module.css
// 3. 导出方式
export const ComponentName = () => { ... }

// 4. 类型定义放在 types.ts
```

### 状态管理原则
- 全局状态用 Context (Settings/Progress/Mistake)
- 本地状态用 `useState`
- 复杂逻辑抽离为 custom hooks (`useTTS`, `useSound`)

### 样式原则
- 优先使用 CSS Variables
- 组件 scoped 样式用 CSS Modules
- 全局工具类放在 `global.css`
- 日语文字使用 `.jaFont` 类启用 `font-feature-settings: 'palt'`

### 新增页面的检查清单
- [ ] 在 `AppRouter.tsx` 添加路由
- [ ] 确定路由深度（影响转场动画方向）
- [ ] 使用 `PageTransition` 包装页面
- [ ] 如需，在 i18n 语言文件中添加翻译 key

---

## 10. 第三方服务/依赖

### 字体
- Google Fonts: Klee One, Noto Serif JP, Yuji Syuku
- 本地字体: 衡山毛笔草书 (HengShanMaoBiCaoShu-2.ttf)
- @fontsource/noto-sans-sc

### TTS (语音合成)
- 使用浏览器原生 `speechSynthesis` API
- 自动筛选日语语音 (`ja-JP`)
- 支持性别偏好选择 (尽力匹配)

### Capacitor 插件
- `@capacitor/app`: App 生命周期
- `@capacitor/dialog`: 原生对话框
- `@capacitor/haptics`: 触觉反馈
- `@capacitor/toast`: 原生 Toast
- `@capacitor/splash-screen`: 启动屏

### 其他依赖
- `canvas-confetti`: 庆祝动画
- `react-activity-calendar`: 活动热力图
- `lodash`: 工具函数
- `japanese-holidays`: 日本节日数据

---

## 11. 注意事项

1. **移动端优先**: 设计以 iOS 应用为主，Web 为辅
2. **触觉反馈**: 使用 Capacitor Haptics API，注意检查 `Capacitor.isNativePlatform()`
3. **TTS 限制**: Web Speech API 在不同浏览器/设备上支持度不一
4. **3D 性能**: 骰子页面在低端设备上可能性能不佳
5. **深色模式**: CSS 变量已预留 dark mode 接口，但未完全实现
6. **懒加载**: 页面组件使用 React.lazy 懒加载，首页除外