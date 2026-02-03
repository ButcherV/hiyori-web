# Hiyori - 日语学习应用

> **项目定位**: 一款专注于日语入门学习的交互式 Web/App 应用，主打假名（平假名/片假名）学习与趣味测验，同时包含数字、日期等实用日语模块。

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
│   └── AppRouter.tsx          # 路由配置 + 页面转场动画
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
│   ├── QuizActionButtons.tsx  # 测验操作按钮
│   ├── CompletionScreen.tsx   # 完成页面
│   ├── StatsHeatmap/          # 学习热力图
│   ├── AppSettingsMenu/       # 设置菜单
│   ├── CategoryTabs/          # 分类标签
│   ├── Switch/                # 开关组件
│   ├── Toast/                 # 轻提示
│   └── ...
├── pages/                     # 页面组件
│   ├── HomePage/              # 首页 + Hero 滚动
│   ├── Onboarding/            # 新用户引导
│   ├── KanaDictAndQuiz/       # 假名学习核心模块
│   │   ├── KanaDictionaryPage.tsx
│   │   ├── KanaQuizSelectionPage.tsx
│   │   ├── PageQuizSession.tsx
│   │   ├── PageMistakeNotebook/
│   │   └── quizLogic.ts
│   ├── TestStudySession/      # 学习会话 (Tinder 卡片)
│   ├── Numbers/               # 数字学习模块
│   │   ├── PageNumbers.tsx
│   │   ├── Translator/        # 数字翻译机
│   │   └── Levels/            # 分级学习 (Level 1-4)
│   ├── DatesPage.tsx          # 日期学习
│   ├── DicePage.tsx           # 3D 骰子
│   └── Clock/Clock.tsx        # 时钟学习
└── datas/                     # 静态数据
    ├── kanaData/              # 假名数据结构
    ├── kanaPaths.ts           # SVG 描红路径
    └── datesData.ts           # 日期数据
```

---

## 3. 核心功能模块

### 3.1 假名学习 (Kana)

**数据模型** (`types.ts`):
```typescript
interface Vocabulary {
  id: string;
  tags: string[];
  kanji: string;      // 显示文字（可能是汉字或假名）
  kana: string;       // 假名读音
  romaji: string;     // 罗马音
  meaning: { zh: string; en: string };
  visual?: {          // 视觉增强 (可选)
    type: 'EMOJI' | 'CSS_COLOR' | 'BRAND_COLOR';
    value: string;
  };
  widget?: {          // 交互组件 (可选)
    type: 'CLOCK' | 'AUDIO';
    value: string;
  };
}
```

**测验模式** (`QuizMode`):
- `KANA_FILL_BLANK`: 挖空填空（核心玩法）
- `WORD_TO_MEANING`: 单词翻译
- `WORD_TO_EMOJI` / `EMOJI_TO_WORD`: 图文匹配
- `WORD_TO_COLOR` / `BRAND_TO_NAME`: 颜色/品牌识别
- `CLOCK_INTERACT`: 时钟交互

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

### 3.3 错题本 (Mistake Notebook)

**移出机制**: 连续答对 2 轮次才能从错题本移出
- 首次答对：显示绿色半环标记
- 第二次连续答对：彻底移出

### 3.4 3D 骰子

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
  uiLanguage: 'en' | 'zh' | 'zh-Hant';
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
| `/study/clock` | 时钟学习 | 2 |
| `/dice` | 3D 骰子 | - |

**转场动画**: 使用 Framer Motion `AnimatePresence`，根据路由深度判断前进/后退方向

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
npm run build     # 生产构建	npm run preview   # 预览构建结果
npm run lint      # ESLint 检查
```

### Capacitor iOS 构建
```bash
npm run build
npx cap sync ios
npx cap open ios
```

### 关键配置
- **vite.config.ts**: 使用 `@vitejs/plugin-react`
- **capacitor.config.ts**: `webDir: 'dist'`, iOS 平台配置
- **tsconfig.json**: 项目引用配置 (`tsconfig.app.json` + `tsconfig.node.json`)

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

### TTS (语音合成)
- 使用浏览器原生 `speechSynthesis` API
- 自动筛选日语语音 (`ja-JP`)
- 支持性别偏好选择 (尽力匹配)

### Capacitor 插件
- `@capacitor/app`: App 生命周期
- `@capacitor/dialog`: 原生对话框
- `@capacitor/haptics`: 触觉反馈
- `@capacitor/toast`: 原生 Toast

---

## 11. 注意事项

1. **移动端优先**: 设计以 iOS 应用为主，Web 为辅
2. **触觉反馈**: 使用 Capacitor Haptics API，注意检查 `Capacitor.isNativePlatform()`
3. **TTS 限制**: Web Speech API 在不同浏览器/设备上支持度不一
4. **3D 性能**: 骰子页面在低端设备上可能性能不佳
5. **深色模式**: CSS 变量已预留 dark mode 接口，但未完全实现
