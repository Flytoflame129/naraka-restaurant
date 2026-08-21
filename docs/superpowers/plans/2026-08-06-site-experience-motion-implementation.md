# 全站基础体验与强氛围动效实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变现有页面、内容 schema 与视觉方向的前提下，完成桌面和移动端导航加固、强氛围动态、响应式统一与可访问降级。

**Architecture:** 保留 Astro 静态优先架构，由 `Navbar.astro` 提供可无脚本降级的导航结构，由单一 `site-experience.ts` 控制移动菜单、顶栏滚动状态和滚动入场。全局 CSS 负责全部视觉状态与动画，组件仅通过稳定的 class 和 `data-*` 属性声明动效意图。

**Tech Stack:** Astro 7、TypeScript、原生 CSS、原生 DOM API、Astro ClientRouter、Node.js 24、npm 10。

## Global Constraints

- 手机端和桌面端同等标准验收，关键宽度为 375px、768px、1024px 和 1440px。
- 不改变现有公开 URL、内容 schema、GitHub Pages 部署方式和中文界面文案原则。
- 不引入动画库、重型 UI 框架、后端、数据库、登录或 CMS。
- 持续动态仅用于 Hero 与主题背景；正文只使用一次性入场和有意义的交互反馈。
- 动画只使用 `transform`、`opacity` 和合成层友好效果，不动画布局尺寸。
- `prefers-reduced-motion: reduce` 必须停用持续动态、错峰入场和明显位移。
- JavaScript 失败时内容默认可见，导航链接仍然可达。
- 所有可操作目标至少 44×44px，保持键盘焦点和 `aria-current` 状态。
- 所有提交保持本地，不推送远端。

## 文件结构

- Create: `src/scripts/site-experience.ts` — 统一管理移动菜单、焦点、背景滚动、顶栏滚动状态与滚动入场。
- Create: `scripts/validate-site-experience.mjs` — 对导航语义、动效钩子和减少动态效果规则做无依赖静态回归检查。
- Modify: `src/components/Navbar.astro` — 添加无脚本可用的移动导航结构、菜单按钮、遮罩和控制分组。
- Modify: `src/layouts/BaseLayout.astro` — 加载体验控制器，提供页面级动效根节点与脚本能力标记。
- Modify: `src/components/PageHero.astro` — 添加 Hero 分层入场钩子。
- Modify: `src/pages/index.astro` — 为首页 Hero 和主要章节声明动效分组。
- Modify: `src/pages/menu.astro` — 为筛选面板、主题介绍和菜单网格声明动效分组。
- Modify: `src/styles/global.css` — 实现导航响应式、强氛围动画、滚动入场、交互状态及降级规则。
- Modify: `package.json` — 把体验静态检查纳入验证命令。

---

### Task 1: 建立无依赖的体验回归检查

**Files:**
- Create: `scripts/validate-site-experience.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `Navbar.astro`、`BaseLayout.astro`、`global.css` 的稳定标记。
- Produces: `npm run validate:experience`，成功时输出 `Site experience validation passed.`，失败时以非零状态退出。

- [ ] **Step 1: 写入会失败的静态检查脚本**

```js
import { readFile } from "node:fs/promises";

const files = {
  navbar: await readFile(new URL("../src/components/Navbar.astro", import.meta.url), "utf8"),
  layout: await readFile(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8"),
  css: await readFile(new URL("../src/styles/global.css", import.meta.url), "utf8"),
};

const requirements = [
  ["mobile menu button", files.navbar.includes('data-menu-toggle')],
  ["mobile menu panel", files.navbar.includes('id="site-navigation"')],
  ["expanded state", files.navbar.includes('aria-expanded="false"')],
  ["menu close control", files.navbar.includes('data-menu-close')],
  ["experience controller", files.layout.includes('site-experience')],
  ["reveal hook", files.css.includes('[data-reveal]')],
  ["reduced motion", files.css.includes('@media (prefers-reduced-motion: reduce)')],
  ["no script fallback", files.css.includes('html:not(.js)')],
];

const failures = requirements.filter(([, passed]) => !passed);
if (failures.length) {
  for (const [name] of failures) console.error(`Missing requirement: ${name}`);
  process.exit(1);
}

console.log("Site experience validation passed.");
```

- [ ] **Step 2: 在 `package.json` 注册命令并验证红灯**

```json
"validate:experience": "node scripts/validate-site-experience.mjs"
```

Run: `npm.cmd run validate:experience`

Expected: FAIL，至少报告 `Missing requirement: mobile menu button` 和 `Missing requirement: experience controller`。

- [ ] **Step 3: 提交测试检查点**

```powershell
git add scripts/validate-site-experience.mjs package.json
git commit -m "test: add site experience regression checks"
```

---

### Task 2: 实现渐进增强的响应式导航

**Files:**
- Modify: `src/components/Navbar.astro`
- Create: `src/scripts/site-experience.ts`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `navItems`、`ThemeSwitcher`、`ThemeModeToggle`、Astro 的 `astro:page-load` 事件。
- Produces: `[data-site-header]`、`[data-menu-toggle]`、`#site-navigation`、`[data-menu-close]`、`[data-menu-overlay]` 与 `initSiteExperience(): void`。

- [ ] **Step 1: 把 `Navbar.astro` 改造成单数据源、无脚本可用的菜单结构**

```astro
<header class="site-header" data-site-header>
  <div class="container nav">
    <a class="brand" href={sitePath("/")}>
      <span class="brand-mark" aria-hidden="true">N</span>
      <span>{siteTitle}</span>
    </a>
    <button class="nav-menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-toggle>
      <span class="sr-only">打开主导航</span>
      <span class="nav-menu-icon" aria-hidden="true"></span>
    </button>
    <div class="nav-panel" id="site-navigation" data-menu-panel>
      <div class="nav-panel-heading">
        <span class="eyebrow">食肆导航</span>
        <button class="nav-menu-close" type="button" data-menu-close><span class="sr-only">关闭主导航</span><span aria-hidden="true">×</span></button>
      </div>
      <nav class="nav-links" aria-label="主导航">
        {navItems.map((item) => {
          const href = sitePath(item.href);
          const isCurrent = currentPath === href || currentPath === item.href;
          return <a href={href} aria-current={isCurrent ? "page" : undefined}>{item.label}</a>;
        })}
      </nav>
      <div class="nav-preferences" aria-label="显示偏好">
        <ThemeSwitcher />
        <ThemeModeToggle />
      </div>
    </div>
  </div>
  <button class="nav-overlay" type="button" aria-label="关闭主导航" data-menu-overlay></button>
</header>
```

- [ ] **Step 2: 在 `site-experience.ts` 实现可重复初始化的菜单行为**

```ts
const SELECTORS = {
  header: "[data-site-header]",
  toggle: "[data-menu-toggle]",
  panel: "[data-menu-panel]",
  close: "[data-menu-close]",
  overlay: "[data-menu-overlay]",
};

let cleanup: (() => void) | undefined;

export function initSiteExperience() {
  cleanup?.();
  const header = document.querySelector<HTMLElement>(SELECTORS.header);
  const toggle = document.querySelector<HTMLButtonElement>(SELECTORS.toggle);
  const panel = document.querySelector<HTMLElement>(SELECTORS.panel);
  if (!header || !toggle || !panel) return;

  const controller = new AbortController();
  const { signal } = controller;
  const closeButton = header.querySelector<HTMLButtonElement>(SELECTORS.close);
  const overlay = header.querySelector<HTMLButtonElement>(SELECTORS.overlay);

  const setOpen = (open: boolean, restoreFocus = false) => {
    header.dataset.menuOpen = String(open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".sr-only")!.textContent = open ? "关闭主导航" : "打开主导航";
    document.documentElement.classList.toggle("menu-open", open);
    if (open) panel.querySelector<HTMLElement>("a, button")?.focus();
    else if (restoreFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"), { signal });
  closeButton?.addEventListener("click", () => setOpen(false, true), { signal });
  overlay?.addEventListener("click", () => setOpen(false, true), { signal });
  panel.addEventListener("click", (event) => {
    if ((event.target as Element).closest("a")) setOpen(false);
  }, { signal });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, true);
  }, { signal });

  setOpen(false);
  cleanup = () => controller.abort();
}

document.addEventListener("astro:page-load", initSiteExperience);
```

- [ ] **Step 3: 在 `BaseLayout.astro` 加载控制器并尽早标记脚本能力**

在 `<head>` 的内联脚本开头加入：

```js
document.documentElement.classList.add("js");
```

在现有组件脚本区域加入：

```astro
<script>
  import "../scripts/site-experience";
</script>
```

- [ ] **Step 4: 运行静态检查与构建**

Run: `npm.cmd run validate:experience`

Expected: 仍 FAIL，仅报告尚未实现的 `reveal hook` 或 `no script fallback`。

Run: `npm.cmd run build`

Expected: PASS，Astro 构建所有现有页面。

- [ ] **Step 5: 提交导航实现**

```powershell
git add src/components/Navbar.astro src/scripts/site-experience.ts src/layouts/BaseLayout.astro
git commit -m "feat: add accessible responsive navigation"
```

---

### Task 3: 建立强氛围动态与静态降级规则

**Files:**
- Modify: `src/styles/global.css`
- Modify: `src/scripts/site-experience.ts`

**Interfaces:**
- Consumes: Task 2 的导航标记与 `initSiteExperience()`。
- Produces: `[data-reveal]`、`.is-revealed`、`.has-scrolled`、Hero 环境层和完整 reduced-motion/no-script 回退。

- [ ] **Step 1: 在 `global.css` 添加导航、可见性与屏幕阅读器基础规则**

```css
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.nav-menu-toggle,.nav-menu-close,.nav-overlay,.nav-panel-heading{display:none}
.nav-preferences{display:flex;align-items:center;gap:.5rem}
html.menu-open{overflow:hidden}

[data-reveal]{opacity:0;transform:translate3d(0,2.75rem,0) scale(.985);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
[data-reveal].is-revealed{opacity:1;transform:none}
html:not(.js) [data-reveal]{opacity:1;transform:none}
```

- [ ] **Step 2: 添加 C 档 Hero 环境动效与卡片反馈**

```css
.hero-theme-media::before,.page-hero--media::after{position:absolute;inset:-18%;content:"";pointer-events:none;background:radial-gradient(ellipse at 30% 40%,var(--theme-glow),transparent 58%);animation:mist-drift 9s ease-in-out infinite alternate;will-change:transform,opacity}
.hero-theme-media::after{position:absolute;inset:0;content:"";pointer-events:none;background:linear-gradient(105deg,transparent 38%,rgba(212,176,106,.16) 49%,transparent 60%);animation:hero-sheen 5.5s ease-in-out infinite;will-change:transform,opacity}
.dish-card,.theme-card,.map-theme-card,.daily-special-card,.menu-item-card{transition:transform .38s cubic-bezier(.2,.8,.2,1),border-color .25s ease,box-shadow .38s ease,filter .38s ease}
@media (hover:hover) and (pointer:fine){.dish-card:hover,.theme-card:hover,.map-theme-card:hover,.daily-special-card:hover,.menu-item-card:hover{transform:translateY(-8px) scale(1.012)}}
@keyframes mist-drift{to{transform:translate3d(12%,4%,0) scale(1.08);opacity:.78}}
@keyframes hero-sheen{0%,32%{transform:translate3d(-45%,0,0);opacity:0}65%{opacity:.8}100%{transform:translate3d(45%,0,0);opacity:0}}
```

- [ ] **Step 3: 在控制器中加入顶栏状态和 IntersectionObserver**

在 `initSiteExperience()` 内、`cleanup` 赋值前加入：

```ts
const updateHeader = () => header.classList.toggle("has-scrolled", window.scrollY > 24);
window.addEventListener("scroll", updateHeader, { passive: true, signal });
updateHeader();

for (const item of document.querySelectorAll<HTMLElement>(".section > .container, .section-tight > .container")) {
  item.setAttribute("data-reveal", "");
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll<HTMLElement>("[data-reveal]");
const observer = reduceMotion ? null : new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("is-revealed");
    observer?.unobserve(entry.target);
  }
}, { rootMargin: "0px 0px -8%", threshold: 0.12 });

for (const item of revealItems) {
  if (reduceMotion) item.classList.add("is-revealed");
  else observer?.observe(item);
}
cleanup = () => { controller.abort(); observer?.disconnect(); };
```

- [ ] **Step 4: 添加移动导航和 reduced-motion 完整规则**

```css
@media(max-width:900px){
  .nav{min-height:4.25rem;flex-direction:row;align-items:center;padding:0}
  .nav-menu-toggle,.nav-menu-close,.nav-panel-heading{display:flex}
  .nav-menu-toggle,.nav-menu-close{width:44px;height:44px;align-items:center;justify-content:center}
  .nav-panel{position:fixed;top:0;right:0;z-index:32;width:min(88vw,24rem);height:100dvh;padding:1rem;background:var(--color-surface-solid);transform:translate3d(105%,0,0);transition:transform .45s cubic-bezier(.2,.8,.2,1)}
  .site-header[data-menu-open="true"] .nav-panel{transform:none}
  .nav-panel-heading{align-items:center;justify-content:space-between}
  .nav-links,.nav-preferences{display:grid;width:100%;gap:.65rem}
  .nav-links a{justify-content:flex-start;font-size:1.05rem}
  .theme-switcher{margin:0;padding:.75rem 0;border:0;border-top:1px solid var(--color-line)}
  .nav-overlay{position:fixed;inset:0;z-index:31;border:0;background:rgba(0,0,0,.68);opacity:0;pointer-events:none;transition:opacity .3s ease}
  .site-header[data-menu-open="true"] .nav-overlay{display:block;opacity:1;pointer-events:auto}
  html:not(.js) .nav-menu-toggle,html:not(.js) .nav-menu-close,html:not(.js) .nav-overlay{display:none}
  html:not(.js) .nav-panel{position:static;width:100%;height:auto;padding:0;transform:none;background:transparent}
}
@media(max-width:560px){.hero-theme-media::before{animation-duration:13s}.hero-theme-media::after{opacity:.55}}
@media(prefers-reduced-motion:reduce){
  [data-reveal]{opacity:1!important;transform:none!important}
  .hero-theme-media::before,.hero-theme-media::after,.page-hero--media::after{animation:none!important}
  .nav-panel{transition-duration:.01ms!important}
}
```

- [ ] **Step 5: 运行体验检查和构建**

Run: `npm.cmd run validate:experience`

Expected: PASS with `Site experience validation passed.`

Run: `npm.cmd run build`

Expected: PASS。

- [ ] **Step 6: 提交动态系统**

```powershell
git add src/styles/global.css src/scripts/site-experience.ts
git commit -m "feat: add cinematic motion system"
```

---

### Task 4: 把页面内容接入统一入场系统

**Files:**
- Modify: `src/components/PageHero.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/menu.astro`

**Interfaces:**
- Consumes: Task 3 的 `[data-reveal]` 与 `.is-revealed`。
- Produces: Hero、首页主要章节、菜单筛选与菜单分组的稳定入场标记。

- [ ] **Step 1: 为 `PageHero.astro` 的文本层添加入场钩子**

```astro
<div class="container" data-reveal data-reveal-group="hero-copy">
  <p class="eyebrow">{eyebrow}</p>
  <h1 transition:name="page-title">{title}</h1>
  <p class="lead">{lead}</p>
  {hasDefaultSlot ? <div class="button-row"><slot /></div> : null}
</div>
```

- [ ] **Step 2: 为首页 Hero 两列与主要章节添加分组标记**

```astro
<div class="hero-copy" data-reveal data-reveal-group="hero-copy">
  <!-- 保留现有内容 -->
</div>
<article class="info-card" aria-label="今日席位" data-reveal data-reveal-group="hero-aside">
  <!-- 保留现有内容 -->
</article>
```

首页其余 `.section > .container` 由 Task 3 的控制器自动添加 `data-reveal`。不要给内部每张卡重复添加 observer，卡片错峰由父级 `.is-revealed` 配合 CSS 选择器完成。这个自动规则同样覆盖画廊、投稿、关于与详情页面的标准内容区。

- [ ] **Step 3: 为菜单筛选和每个主题分组添加标记**

```astro
<div class="filter-panel" aria-label="菜单主题切换" data-reveal>
```

```astro
<section
  class:list={["section-tight", "theme-section", { "is-hidden": theme.key !== "juku" }]}
  data-theme-section={theme.key}
  data-theme-card={theme.key}
  data-reveal
>
```

- [ ] **Step 4: 添加父级驱动的错峰规则**

```css
[data-reveal-group="hero-copy"]>*{opacity:0;transform:translate3d(0,1.5rem,0);transition:opacity .65s ease,transform .65s cubic-bezier(.2,.8,.2,1)}
[data-reveal-group="hero-copy"].is-revealed>*{opacity:1;transform:none}
[data-reveal-group="hero-copy"].is-revealed>*:nth-child(2){transition-delay:.1s}
[data-reveal-group="hero-copy"].is-revealed>*:nth-child(3){transition-delay:.18s}
[data-reveal-group="hero-copy"].is-revealed>*:nth-child(4){transition-delay:.26s}
[data-reveal].is-revealed :is(.theme-card,.daily-special-card,.info-card,.menu-item-card){animation:card-arrive .65s cubic-bezier(.2,.8,.2,1) both}
[data-reveal].is-revealed :is(.theme-card,.daily-special-card,.info-card,.menu-item-card):nth-child(2){animation-delay:.08s}
[data-reveal].is-revealed :is(.theme-card,.daily-special-card,.info-card,.menu-item-card):nth-child(3){animation-delay:.16s}
@keyframes card-arrive{from{opacity:0;transform:translate3d(0,2rem,0) scale(.98)}}
@media(prefers-reduced-motion:reduce){[data-reveal-group="hero-copy"]>*,[data-reveal].is-revealed :is(.theme-card,.daily-special-card,.info-card,.menu-item-card){opacity:1!important;transform:none!important;animation:none!important;transition-delay:0s!important}}
```

- [ ] **Step 5: 验证主题切换后隐藏区不会意外拦截交互**

Run: `npm.cmd run validate:experience`

Expected: PASS。

Run: `npm.cmd run build`

Expected: PASS，菜单三个主题区均生成，默认仅聚窟洲可见。

- [ ] **Step 6: 提交页面接入**

```powershell
git add src/components/PageHero.astro src/pages/index.astro src/pages/menu.astro src/styles/global.css
git commit -m "feat: animate page content entrances"
```

---

### Task 5: 完成响应式、可访问性与全站验收

**Files:**
- Modify: `package.json`
- Modify: `src/styles/global.css`（只修复验收中发现的样式问题）
- Modify: `src/scripts/site-experience.ts`（只修复验收中发现的交互问题）

**Interfaces:**
- Consumes: Tasks 1–4 的全部实现。
- Produces: 通过内容、体验与静态构建验证的可交付网站。

- [ ] **Step 1: 把体验检查纳入正式构建前置验证**

```json
"build": "npm run validate:content && npm run validate:experience && astro build"
```

- [ ] **Step 2: 运行全部自动验证**

Run: `npm.cmd run validate:content`

Expected: PASS，无空字段、schema 或来源状态错误。

Run: `npm.cmd run validate:experience`

Expected: PASS with `Site experience validation passed.`

Run: `npm.cmd run build`

Expected: PASS，Astro 完成全部静态页面构建。

- [ ] **Step 3: 核对图片加载与布局稳定性**

确认 `ThemeHeroPicture.astro` 保持首个聚窟洲 Hero 的 `loading="eager"` 与 `fetchpriority="high"`，其余主题图保持 `loading="lazy"`；确认 `DishCard.astro`、`MapThemeCard.astro` 与 `DailySpecialCard.astro` 继续提供明确宽高、宽高比或 Astro `Picture`/`Image` 尺寸。若这些属性仍在，则不修改图片组件。

- [ ] **Step 4: 启动预览并逐宽度检查**

Run: `npm.cmd run preview -- --host 127.0.0.1`

Expected: 本地预览服务启动。依次检查 375px、768px、1024px 和 1440px：无横向滚动、导航不遮挡内容、网格列数自然变化、标题和按钮不溢出。

- [ ] **Step 5: 完成键盘与降级验收**

按以下顺序检查并记录结果：

1. 仅用 Tab/Shift+Tab 打开和遍历移动菜单。
2. 用 Escape 关闭菜单，并确认焦点回到触发按钮。
3. 切换地图主题和明暗模式，确认状态文本与 `aria-pressed` 同步。
4. 开启系统减少动态效果，确认持续雾层、扫光、错峰和明显位移停止。
5. 禁用 JavaScript，确认全部导航链接与正文仍可见。
6. 在页面转场后重复 1–3，确认事件没有重复绑定。

- [ ] **Step 6: 检查最终差异和工作树**

Run: `git diff --check`

Expected: 无输出。

Run: `git status --short`

Expected: 只显示本计划范围内尚未提交的文件。

- [ ] **Step 7: 提交最终验证接线**

```powershell
git add package.json src/styles/global.css src/scripts/site-experience.ts
git commit -m "chore: verify responsive site experience"
```

## 最终交付检查

- [ ] `npm.cmd run validate:content` 通过。
- [ ] `npm.cmd run validate:experience` 通过。
- [ ] `npm.cmd run build` 通过。
- [ ] 375px、768px、1024px、1440px 均无横向滚动或遮挡。
- [ ] 键盘、Escape、焦点恢复和当前页状态工作正常。
- [ ] reduced-motion 与无 JavaScript 降级可用。
- [ ] 只保留本地提交，不执行 push。
