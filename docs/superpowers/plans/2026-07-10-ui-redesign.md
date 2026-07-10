# NARAKA Restaurant UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用原创东方幻想视觉、电影感 Hero 和江湖情报板式内容层级重做现有 Astro 页面，并让 6 个项目 skills 与当前内容、版权和视觉验收规则一致。

**Architecture:** 保留 Astro 静态优先架构、Content Collections、`sitePath()` 和现有发布过滤。视觉资产位于 `public/assets/visuals/`，三地图元数据继续由 `src/data/mapThemes.ts` 提供，组件只消费数据；全局设计 tokens 和响应式规则集中在 `src/styles/global.css`。

**Tech Stack:** Astro 7、TypeScript、Markdown、原生 CSS、少量原生 JavaScript、GitHub Pages。

## Global Constraints

- 本站始终明确为《永劫无间》非官方玩家同好创作站。
- 不复制或生成官方 Logo、角色、武器、截图、宣传图、官方 UI 或官方文案。
- 地图名称只使用聚窟洲、火罗国、龙隐洞天；主题 key 只使用 `juku`、`huoluo`、`longyin`。
- 不新增搜索、评论、登录、支付、购物车、后端、复杂 API、GSAP、Tailwind 或 UI 框架。
- 不新增菜品，不改变现有菜品 `status`、`publishStatus` 和来源证据结论。
- 所有页面底部保留完整非官方声明。
- 移动端正文不低于 16px，交互目标至少 44px，支持键盘焦点和 `prefers-reduced-motion`。
- 当前目录没有 `.git`，本计划中的任务验收不包含 commit；仓库初始化 Git 后再按任务边界提交。

---

### Task 1: 原创视觉资产与来源登记

**Files:**
- Create: `public/assets/visuals/hero-main.webp`
- Create: `public/assets/visuals/theme-juku.webp`
- Create: `public/assets/visuals/theme-huoluo.webp`
- Create: `public/assets/visuals/theme-longyin.webp`
- Create: `docs/visual-asset-register.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-10-ui-redesign-design.md` 的原创资产边界。
- Produces: 四个固定 public 路径和每张图片的中文 alt/生成说明，供 `mapThemes` 与首页使用。

- [ ] **Step 1: 生成四张无文字宽幅原创图片**

使用 `imagegen`，每张图明确写入“无文字、无 Logo、无人物、无游戏截图、无可识别官方角色或武器”。主体提示分别为：

```text
hero-main: 夜色东方幻想食肆，远景山雾，黑金红灯火，宴席与建筑形成电影感纵深，21:9。
theme-juku: 雾林、古树、岛屿栈道、远处食肆暖灯，深墨绿暗金温红雾白，16:9。
theme-huoluo: 沙海、古城机关、赤红落日与异域宴席，沙金赤红焦橙深褐，16:9。
theme-longyin: 地宫矿洞、抽象龙纹机关、冷青幽光与古铜后厨，曜黑熔岩红冷青古铜，16:9。
```

- [ ] **Step 2: 将生成结果保存为稳定网页资产**

四张图片分别保存到本任务列出的路径；保持首屏图宽度至少 1920px，地图图宽度至少 1280px。若生成结果不是 WebP，保留工具输出格式并同步修改后续引用路径，不使用额外图片依赖。

- [ ] **Step 3: 写入资产登记**

`docs/visual-asset-register.md` 必须逐项记录：相对路径、用途、生成方式、提示摘要、生成日期 `2026-07-10`、权利备注“本站原创 AI 辅助氛围素材，不含官方素材，不代表官方概念设计”。

- [ ] **Step 4: 验证路径和禁用元素说明**

Run:

```powershell
rg --files public/assets/visuals
rg -n "官方素材|不代表官方|hero-main|theme-juku|theme-huoluo|theme-longyin" docs/visual-asset-register.md
```

Expected: 四个图片文件均列出；登记文档覆盖四个路径和非官方说明。

### Task 2: 地图视觉数据与共享页面组件

**Files:**
- Modify: `src/data/mapThemes.ts`
- Create: `src/components/PageHero.astro`
- Create: `src/components/MapThemeCard.astro`
- Modify: `src/components/Navbar.astro`
- Modify: `src/components/ThemeSwitcher.astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: Task 1 的图片路径、现有 `sitePath()`、`MapThemeKey`。
- Produces: `mapThemes[].image`、`mapThemes[].alt`；`PageHero` props `{ eyebrow, title, lead, image?, themeKey?, compact? }`；`MapThemeCard` props `{ theme }`。

- [ ] **Step 1: 建立失败基线**

Run:

```powershell
rg -n "image:|alt:" src/data/mapThemes.ts
```

Expected before change: 不存在三地图视觉路径字段。

- [ ] **Step 2: 为三地图增加视觉字段**

每项增加：

```ts
image: "/assets/visuals/theme-juku.webp",
alt: "雾林、古树与远处暖灯食肆构成的聚窟洲主题原创氛围图",
```

火罗国和龙隐洞天使用对应路径与准确中文 alt，不改变现有 key、name、description、heroDescription、accent、tone。

- [ ] **Step 3: 创建通用 PageHero**

组件输出语义化 `<section class:list={["page-hero", { "page-hero--compact": compact }]}>`，背景图片通过内联 CSS 自定义属性 `--page-hero-image` 传入；标题只有一个 `<h1>`，说明使用 `.lead`，行动区通过 `<slot />` 提供。

- [ ] **Step 4: 创建 MapThemeCard**

组件使用 `sitePath(theme.image)` 输出有固定 `aspect-ratio` 的 `<img loading="lazy">`，正文显示 `label`、`name`、`description`、`tone`，并以 `data-theme-card={theme.key}` 暴露主题样式入口。

- [ ] **Step 5: 校准导航与主题切换可访问性**

Navbar 保留现有 5 个目的地；ThemeSwitcher 继续由 `mapThemes` 生成，按钮增加 `title={`${theme.name}主题`}`，CSS 负责 44px 最小高度。BaseLayout 在 `<main>` 增加 `id="main-content"`，Header 前增加跳转到 `#main-content` 的 skip link。

- [ ] **Step 6: 运行构建验证组件接口**

Run: `npm run build`

Expected: content validation 通过，Astro build exit code 0，公开详情页数量不变。

### Task 3: 全局设计系统与响应式样式

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: Task 2 的 class 和 data attributes。
- Produces: 页面、Hero、地图卡、菜品卡、来源档案、导航和三主题共用的 CSS tokens。

- [ ] **Step 1: 记录现有关键回归点**

Run:

```powershell
rg -n "hero-title|dish-card|theme-card|prefers-reduced-motion|focus-visible|44px" src/styles/global.css
```

Expected before change: 存在旧 Hero/卡片规则，但缺少完整 reduced-motion 与统一最小触控规则。

- [ ] **Step 2: 重组语义 tokens**

在 `:root` 中保留现有品牌变量并增加 `--color-surface-raised`、`--color-on-accent`、`--space-*`、`--motion-fast: 180ms`、`--motion-base: 260ms`、`--focus-ring`、`--hero-image`。三个 `html[data-theme]` 分别覆盖 `--theme-glow`、`--theme-overlay`、`--hero-image`。

- [ ] **Step 3: 实现电影感 Hero 和情报板结构**

`.hero` 与 `.page-hero` 使用真实背景图、暗色 scrim、固定最小高度和稳定内容宽度；`.hero-title` 使用 `font-size: clamp(2.5rem, 7vw, 5.75rem)`，不使用 `white-space: nowrap`。标题层级、印章、编号和斜切装饰仅通过伪元素实现，装饰元素设置 `pointer-events: none`。

- [ ] **Step 4: 重做地图卡和菜品卡**

地图卡使用 16:9 图像、底部渐暗和清晰正文区；菜品卡保持整个卡片可点击，图像固定 16:9，正文使用编号、状态、标题、摘要和关联线索层级。hover/focus 只使用 `transform: translateY(-2px)`、border-color 和 brightness，不改变尺寸。

- [ ] **Step 5: 完成可访问性与响应式规则**

为 `a:focus-visible, button:focus-visible` 添加 3px outline；所有按钮和导航链接 `min-height: 44px`。在 900px 与 560px 调整导航、Hero、详情布局和卡片网格；增加：

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

- [ ] **Step 6: 静态规则检查**

Run:

```powershell
rg -n "prefers-reduced-motion|focus-visible|min-height: 44px|clamp\(" src/styles/global.css
rg -n "white-space: nowrap" src/styles/global.css
```

Expected: 第一条覆盖四项；第二条不再命中 Hero 标题规则。

### Task 4: 六个页面的信息层级返工

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/menu.astro`
- Modify: `src/pages/dishes/[slug].astro`
- Modify: `src/pages/gallery.astro`
- Modify: `src/pages/submit.astro`
- Modify: `src/pages/about.astro`
- Modify: `src/components/DishCard.astro`
- Modify: `src/components/SourceList.astro`

**Interfaces:**
- Consumes: Task 2 的 `PageHero`、`MapThemeCard` 和现有内容字段。
- Produces: 六个静态页面；不改变路由、collection schema 或公开内容过滤。

- [ ] **Step 1: 首页接入电影感 Hero 与地图入口**

首页 Hero 使用 `/assets/visuals/hero-main.webp`，保留标题、副标题、菜单和投稿 CTA。将旧 `.hero-visual` 替换为“今日席位”档案块；地图入口改为 `mapThemes.map(theme => <MapThemeCard theme={theme} />)`。今日招牌菜继续只读取公开菜品。

- [ ] **Step 2: 菜单页改为悬赏菜单**

使用紧凑 `PageHero`；筛选逻辑和 `aria-pressed` 保持不变。每个地图分区显示对应氛围图和菜品计数，空状态文案不得虚构内容。

- [ ] **Step 3: 菜品卡改为游戏情报卡**

从 `dish.id` 或数组位置生成纯展示编号时不得写回内容；优先使用 slug 的大写短标识。保留地图、标题、摘要、可信度、分类、梗类型、角色/武器/操作，并删除任何看似真实售价的视觉强调，`priceLabel` 只作为虚拟菜单设定的小字。

- [ ] **Step 4: 详情页改为档案式页面**

保留 `getStaticPaths()` 与发布过滤。Hero 中同时显示地图、可信度、状态和原创菜品图；正文分区名称不变，侧栏“情报牌”改为“菜品档案”。`SourceList` 把 `supports` 放在显著位置，链接增加 `rel="noreferrer"`，外部链接文案不伪装成站内导航。

- [ ] **Step 5: 投稿、画廊、关于页使用 PageHero**

投稿页使用“后厨委托书”层级和唯一主 CTA；画廊保持真实空状态；关于页首先展示非官方立场。三页均不新增数据或功能。

- [ ] **Step 6: 内容与路由回归检查**

Run:

```powershell
rg -n "isPublicDishStatus" src/pages/index.astro src/pages/menu.astro 'src/pages/dishes/[slug].astro'
rg -n "非官方|不代表官方" src/components/Footer.astro src/pages/about.astro src/pages/index.astro
npm run build
```

Expected: 三处页面继续使用公开过滤；非官方说明可检索；build exit code 0。

### Task 5: 逐个优化项目 Skills

**Files:**
- Modify: `.codex/skills/naraka-meme-research/SKILL.md`
- Modify: `.codex/skills/meme-to-dish-writer/SKILL.md`
- Modify: `.codex/skills/dish-schema-keeper/SKILL.md`
- Modify: `.codex/skills/copyright-source-review/SKILL.md`
- Modify: `.codex/skills/astro-site-builder/SKILL.md`
- Modify: `.codex/skills/deploy-quality-check/SKILL.md`

**Interfaces:**
- Consumes: `AGENTS.md`、`src/content.config.ts`、`scripts/validate-content.mjs`、`docs/design-direction.md`、Task 1 的资产登记。
- Produces: 6 个保持原名称和触发语义、正文中文、规则无漂移的项目 skills。

- [ ] **Step 1: 为每个 skill 单独建立基线场景**

依次给新上下文 agent 一个容易失败的任务，并记录未优化 skill 的缺口：研究来源是否缺 `supports`；菜品写作是否混淆二创与事实；schema 是否复制过期枚举；版权审核是否漏 AI 图片说明；Astro 构建是否漏设计系统与可访问性；上线检查是否漏三视口和三主题。每个 skill 完成基线、修改、复测后才进入下一个。

- [ ] **Step 2: 统一结构但保留职责边界**

每个文件必须保留 YAML `name`、以 `Use when` 开头的第三人称 `description`，以及 `when_to_use`、`workflow`、`output_format`、`guardrails`。删除与 `AGENTS.md` 完全重复的背景叙述，保留会改变执行行为的项目规则。

- [ ] **Step 3: 指向单一实现真相**

`dish-schema-keeper` 明确先读取 `src/content.config.ts` 和 `scripts/validate-content.mjs`，文档中的字段表只作检查合同；`astro-site-builder` 先读 `docs/design-direction.md` 并调用 `ui-ux-pro-max` 生成设计系统；`deploy-quality-check` 使用实际 build 和视口检查证据。

- [ ] **Step 4: 加入 AI 视觉审核边界**

`copyright-source-review` 要求核查生成记录、禁止官方角色/Logo/截图、alt 和用途；`astro-site-builder` 要求使用登记后的项目资产；内容类 skills 不得把视觉氛围图当作梗来源证据。

- [ ] **Step 5: 每个 skill 修改后立即验证**

Run for each directory:

```powershell
rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/<skill-name>/SKILL.md
```

Expected: 6 个必需入口全部存在。随后用相同场景复测，输出必须补齐对应缺口；验证完成后再修改下一个 skill。

- [ ] **Step 6: 全量 skills 静态检查**

Run:

```powershell
rg -l "^## when_to_use" .codex/skills/*/SKILL.md
rg -n "龙影洞天|山谷|沙漠王国|地下洞天" .codex/skills
rg -n "supports|publishStatus|非官方|版权|ui-ux-pro-max|375px|1440px" .codex/skills
```

Expected: 第一条列出 6 个项目 skills；第二条无命中；第三条覆盖职责对应文件。

### Task 6: 构建与视觉验收

**Files:**
- Modify only if verification finds a defect in files already listed above.

**Interfaces:**
- Consumes: Tasks 1-5 的完整结果。
- Produces: 可构建、可访问、三主题可区分的 GitHub Pages 静态站。

- [ ] **Step 1: 运行内容验证**

Run: `npm run validate:content`

Expected: `content validation passed: 6 dish file(s) checked`。

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: exit code 0；生成 `/`、`/menu/`、`/gallery/`、`/submit/`、`/about/` 和允许公开的菜品详情页。

- [ ] **Step 3: 启动本地开发服务**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Astro 输出可访问的 localhost URL，进程保持运行直到视觉检查结束。

- [ ] **Step 4: 检查 375px、768px、1440px**

逐页检查首页、菜单、公开菜品详情、投稿页：无横向滚动；标题不截断；导航不遮挡；按钮至少 44px；卡片文字不溢出；图片具有稳定占位空间。

- [ ] **Step 5: 检查三主题与交互状态**

依次点击聚窟洲、火罗国、龙隐洞天，确认 Hero 图/覆盖色/说明同步变化，`aria-pressed` 唯一为 true，刷新后主题保持。键盘 Tab 检查导航、筛选、菜品卡和投稿 CTA 的焦点可见。

- [ ] **Step 6: 检查 reduced motion 和版权边界**

启用 reduced-motion 后确认位移动效被禁用；人工查看四张原创图，确认无官方 Logo、角色、截图、宣传文案或可识别官方 UI。

- [ ] **Step 7: 关闭开发服务并汇总证据**

停止 dev server；报告 build exit code、生成页面、视口检查结果、主题检查结果、skills 验证结果，以及仍需人工判断的图片版权/审美问题。
