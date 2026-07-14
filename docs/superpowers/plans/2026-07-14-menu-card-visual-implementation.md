# 菜单主题席签卡 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不增加图片、依赖或点击行为的前提下，让 15 道菜单卡具有清晰的三主题差异、紧凑层级与可靠的长标题排版。

**Architecture:** `MenuItemCard.astro` 只负责从现有内容数据派生主题 key 和长标题状态；`global.css` 负责全部视觉表现。主题样式通过 CSS Variables 隔离，卡片仍是语义化 `article`，不增加链接或按钮。

**Tech Stack:** Astro、TypeScript 表达式、原生 CSS、CSS Variables

## Global Constraints

- 不新增图片资源或第三方依赖。
- 不修改菜单内容、schema、排序或主题归属。
- 不增加档案号、可信度、审核提示或点击行为。
- 描述必须完整显示，不使用截断。
- 保持桌面双列和手机单列可读。

---

### Task 1: 为菜单卡派生主题与长标题状态

**Files:**
- Modify: `src/components/MenuItemCard.astro`

**Interfaces:**
- Consumes: `item.data.map: string`、`item.data.title: string`、`getMapTheme(id: string)`。
- Produces: `data-theme-card="juku|huoluo|longyin"` 与条件类 `is-long-title`。

- [x] **Step 1: 记录当前结构检查结果**

Run:

```bash
rg -n "<article|<h3|href=|button" src/components/MenuItemCard.astro
```

Expected: 找到 `article` 与 `h3`，不包含 `href` 或 `button`。

- [x] **Step 2: 增加主题和长标题派生逻辑**

将组件脚本和相关标签调整为：

```astro
---
import { getMapTheme } from "../data/mapThemes";

const { item, sequence } = Astro.props;
const data = item.data;
const theme = getMapTheme(data.map);
const isLongTitle = Array.from(data.title).length >= 9;
---

<article class="menu-item-card" data-theme-card={theme?.key}>
  <div class="card-kicker">
    <span>席位 {String(sequence).padStart(2, "0")}</span>
    <span>{data.map}</span>
  </div>
  <h3 class:list={{ "is-long-title": isLongTitle }}>{data.title}</h3>
  <p>{data.description}</p>
  <span class="menu-item-category">{data.category}</span>
</article>
```

- [x] **Step 3: 验证组件仍不可点击且状态存在**

Run:

```bash
rg -n "data-theme-card|is-long-title|href=|button" src/components/MenuItemCard.astro
```

Expected: 找到 `data-theme-card` 与 `is-long-title`，不找到 `href=` 或 `button`。

---

### Task 2: 实现三主题席签卡样式并验证

**Files:**
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: Task 1 输出的 `data-theme-card` 和 `is-long-title`。
- Produces: 三组 `--menu-card-*` 变量、紧凑卡片排版、分类签牌和响应式长标题规则。

- [x] **Step 1: 在主题作用域中定义卡片变量**

在现有三个 `[data-theme-card]` 规则中分别增加：

```css
[data-theme-card="juku"] {
  --menu-card-border: rgba(185, 154, 88, 0.7);
  --menu-card-surface: rgba(15, 24, 18, 0.94);
  --menu-card-pattern: repeating-linear-gradient(115deg, rgba(157, 178, 132, 0.07) 0 1px, transparent 1px 18px);
  --menu-card-sign: #d6bd7d;
}

[data-theme-card="huoluo"] {
  --menu-card-border: rgba(217, 137, 49, 0.78);
  --menu-card-surface: rgba(38, 18, 10, 0.95);
  --menu-card-pattern: repeating-linear-gradient(135deg, rgba(225, 106, 43, 0.09) 0 2px, transparent 2px 20px);
  --menu-card-sign: #e6a24f;
}

[data-theme-card="longyin"] {
  --menu-card-border: rgba(76, 162, 174, 0.72);
  --menu-card-surface: rgba(21, 15, 31, 0.96);
  --menu-card-pattern: radial-gradient(circle at 82% 18%, rgba(112, 82, 160, 0.18) 0 2px, transparent 3px), repeating-radial-gradient(circle at 82% 18%, transparent 0 22px, rgba(72, 155, 166, 0.06) 23px 24px);
  --menu-card-sign: #86c5c8;
}
```

- [x] **Step 2: 收紧卡片并强化主题层级**

更新菜单卡规则，使其包含：

```css
.menu-item-card {
  gap: 0.55rem;
  min-height: 10.5rem;
  padding: 0.9rem 1rem;
  border-color: var(--menu-card-border, var(--color-line));
  background: var(--menu-card-pattern, none), var(--menu-card-surface, var(--color-surface-raised));
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.025), var(--shadow-card);
}

.menu-item-card .card-kicker {
  padding-bottom: 0.4rem;
  border-bottom: 1px solid color-mix(in srgb, var(--menu-card-border, var(--color-line)) 55%, transparent);
}

.menu-item-card h3 {
  font-size: clamp(1.12rem, 1.75vw, 1.38rem);
  line-height: 1.35;
  text-wrap: balance;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

.menu-item-card h3.is-long-title {
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.4;
}

.menu-item-card p {
  font-size: 0.96rem;
  line-height: 1.6;
}
```

- [x] **Step 3: 将分类改成不可点击的席面签牌**

更新分类样式：

```css
.menu-item-category {
  position: relative;
  justify-self: start;
  margin-top: 0.15rem;
  padding: 0.24rem 0.75rem;
  border: 1px solid var(--menu-card-border, rgba(212, 176, 106, 0.34));
  border-left-width: 3px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--menu-card-sign, var(--color-gold)) 12%, transparent);
  color: var(--menu-card-sign, var(--color-gold));
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0;
}
```

- [x] **Step 4: 增加手机端长标题规则**

在 `@media (max-width: 560px)` 中增加：

```css
.menu-item-card h3.is-long-title {
  font-size: 1.08rem;
}
```

- [x] **Step 5: 执行静态检查与构建**

Run:

```bash
rg -n "档案号|可信度|审核|href=|button" src/components/MenuItemCard.astro
git diff --check
npm.cmd run build
```

Expected: 组件中不出现禁用信息和交互元素；`git diff --check` 无错误；内容校验检查 15 个菜单条目且 Astro 构建成功。

- [x] **Step 6: 浏览器检查**

检查 `/menu/` 的聚窟洲、火罗国、龙隐洞天三种筛选状态，并在约 1280px 与 390px 宽度确认：

- 三主题边框、底纹和签牌颜色明显不同。
- “张家禁地鲜蘑菇海萤汤”“货币赌玉一片绿时蔬”完整显示。
- 卡片没有大块无效留白。
- 卡片没有可点击暗示。
