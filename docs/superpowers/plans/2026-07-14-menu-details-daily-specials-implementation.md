# 正式菜单详情与每日推荐 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 15 道正式菜单菜品补齐来源约束下的视觉研究、完整内容、独立 AI 图片、详情页与首页每日三主题推荐。

**Architecture:** `menuItems` 保持为正式菜单的唯一数据源，扩展 schema 后同时供菜单页、详情页和首页推荐消费。首页只渲染三个推荐卡槽，通过本地日期和嵌入的候选 JSON 更新卡片，不加载 15 张隐藏图片；考据型 `dishes` 集合保持不变。

**Tech Stack:** Astro 7、Content Collections、Markdown、原生 CSS/JavaScript、现有 `sharp`、GitHub Pages、项目研究与版权审核 skills、AI image generation

## Global Constraints

- 菜名、地图和排序保持用户确认的 `8 / 4 / 3` 清单。
- 不把 15 道原创菜单菜品写成已考证的游戏事实。
- 搜索必须保留公开来源链接；证据不足写“待考证”，不得补造对应关系。
- 不抓取需要登录或明显不适合抓取的平台。
- 不提交官方图片、Logo、截图、角色图、UI 或宣传素材。
- 15 张成图均为 AI 生成原创视觉，菜品主体清晰，比例统一为 `1600 × 900` WebP。
- 首页不显示档案号、可信度、发布状态或审核提示。
- 不新增后端、定时任务、搜索、登录或评论系统。

---

### Task 1: 逐道研究菜名对应的游戏形象

**Files:**
- Create: `docs/research/menu-visual-references.md`

**Interfaces:**
- Consumes: `src/content/menu-items/*.md` 中的 15 个菜名、地图归属和用户确认语境。
- Produces: 每道菜的来源链接、对应元素、视觉摘要、可信度、排除项和 AI 提示方向。

- [ ] **Step 1: 建立 15 道菜研究表**

文档按聚窟洲 8 道、火罗国 4 道、龙隐洞天 3 道排序，每张资料卡使用固定字段：

```markdown
### 菜名

- 所属主题：
- 检索关键词：
- 可能对应元素：
- 来源链接：
- 证据摘要：
- 可观察视觉特征：
- 可信度：高 / 中 / 低 / 待考证
- AI 二创方向：
- 禁止复制内容：官方角色 / Logo / UI / 截图构图 / 其他
- 待人工确认点：
```

- [ ] **Step 2: 使用公开网页逐道检索**

对每道菜至少组合以下查询：

```text
永劫无间 + 完整菜名
永劫无间 + 菜名中的角色/地点/道具词
NARAKA BLADEPOINT + 对应英文或拼音关键词
```

优先调用 `naraka-meme-research`、`anysearch`、`firecrawl-search`；只对无需登录、允许公开读取且确有价值的结果调用 `firecrawl-scrape`。每条结论必须紧邻来源链接，不大量复制原文。

- [ ] **Step 3: 执行来源与版权审查**

调用 `copyright-source-review` 检查：

- 来源是否真的支持所记录的形象或场景。
- 是否把同名搜索结果误当成游戏事实。
- 是否存在主播、投稿者或社区作者权益风险。
- AI 提示是否要求复刻官方角色、武器造型或宣传构图。

Expected: 15 张资料卡全部有可信度；没有证据的条目标为“待考证”，但仍可按用户确认菜名制作纯虚拟菜品。

- [ ] **Step 4: 检查研究文档完整性**

Run:

```bash
rg -n "^### " docs/research/menu-visual-references.md
rg -n "来源链接|可信度|AI 二创方向|禁止复制内容|待人工确认点" docs/research/menu-visual-references.md
```

Expected: 恰好 15 个三级标题，每张资料卡都包含所有固定字段。

---

### Task 2: 扩展正式菜单 schema 与验证器

**Files:**
- Modify: `src/content.config.ts`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Consumes: 现有 `menuItems` 基础字段。
- Produces: 完整菜单条目 schema 与前置内容校验规则。

- [ ] **Step 1: 先扩展自定义验证器并观察失败**

将 `requiredMenuItemFields` 改为：

```js
const requiredMenuItemFields = [
  "title",
  "slug",
  "map",
  "category",
  "description",
  "order",
  "dishIntro",
  "dishSetting",
  "playerComment",
  "recommendedPairing",
  "relatedElements",
  "image",
];
```

在菜单循环中增加：

```js
if (!hasArrayItem(parsed.raw, "relatedElements")) {
  fail(`${file}: relatedElements needs at least one item`);
}

for (const child of ["src", "alt", "credit", "license"]) {
  if (!hasObjectField(parsed.raw, "image", child)) {
    fail(`${file}: image missing required field ${child}`);
  }
}
```

Run:

```bash
npm.cmd run validate:content
```

Expected: FAIL，15 个菜单文件报告缺少新字段。

- [ ] **Step 2: 扩展 Astro schema**

将 `menuItems` schema 改为：

```ts
schema: z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  map: z.enum(mapThemeNames),
  category: z.enum(dishCategories),
  description: z.string().min(1).max(120),
  order: z.number().int().positive(),
  dishIntro: z.string().min(1),
  dishSetting: z.string().min(1),
  playerComment: z.string().min(1),
  recommendedPairing: z.string().min(1),
  relatedElements: z.array(z.string().min(1)).min(1),
  image: z.object({
    src: z.string().regex(/^\/assets\/dishes\/menu\/[a-z0-9-]+\.webp$/),
    alt: z.string().min(1),
    credit: z.literal("AI 生成原创视觉，由项目维护者整理"),
    license: z.literal("项目原创生成图，仅供本站非商业展示"),
  }),
}),
```

---

### Task 3: 扩写 15 道正式菜单内容

**Files:**
- Modify: `src/content/menu-items/guaranteed-red-four-platter.md`
- Modify: `src/content/menu-items/fireman-wok-toss.md`
- Modify: `src/content/menu-items/buzhou-shiban-fish.md`
- Modify: `src/content/menu-items/wolf-rib-platter.md`
- Modify: `src/content/menu-items/gaoshou-peach-crisps.md`
- Modify: `src/content/menu-items/purple-herb-seven-peaches.md`
- Modify: `src/content/menu-items/currency-jade-greens.md`
- Modify: `src/content/menu-items/fire-cage-barbecue.md`
- Modify: `src/content/menu-items/spicy-sand-konjac.md`
- Modify: `src/content/menu-items/kunlun-snow-lotus.md`
- Modify: `src/content/menu-items/divine-fire-red-armor-bun.md`
- Modify: `src/content/menu-items/feather-arrow-golden-crow-char-siu.md`
- Modify: `src/content/menu-items/zhang-forbidden-mushroom-sea-firefly-soup.md`
- Modify: `src/content/menu-items/jidi-city-red-sausage.md`
- Modify: `src/content/menu-items/zifu-palace-red-egg.md`

**Interfaces:**
- Consumes: Task 1 研究文档和 Task 2 schema。
- Produces: 15 个可供卡片、详情页和每日推荐共同消费的完整条目。

- [ ] **Step 1: 为每个文件补齐固定字段**

每个 frontmatter 使用以下结构，路径中的 slug 必须与本文件现有 `slug` 完全一致：

```yaml
dishIntro: "两句以内的菜品介绍，只描述虚拟菜品和席面感受。"
dishSetting: "描述食材、摆盘、烹饪方式和对应主题氛围，不补造游戏事实。"
playerComment: "一句本站原创席间趣评，不冒充玩家、主播或官方原话。"
recommendedPairing: "一道现有菜单菜品或主题饮品，并说明口味搭配。"
relatedElements:
  - "只使用菜名明确表达或研究资料支持的元素"
image:
  src: "/assets/dishes/menu/guaranteed-red-four-platter.webp"
  alt: "客观描述菜品主体、容器和主题背景"
  credit: "AI 生成原创视觉，由项目维护者整理"
  license: "项目原创生成图，仅供本站非商业展示"
```

- [ ] **Step 2: 按主题控制文案方向**

- 聚窟洲：雾林、暖灯、古木、江湖初席；口味以鲜、炖、炭香、桃酥和围炉为主。
- 火罗国：沙海、古城、烈宴、焦香；口味以麻辣、爆炒、红油、雪莲清饮和金红烤味为主。
- 龙隐洞天：地宫、紫色星盘、辉煌宫阙、冷青幽光；口味以菌汤、红肠、卤蛋和奇味夜席为主。

`playerComment` 必须明确是本站原创语气，不写“玩家都说”“社区公认”等无法证明的集合性表述。

- [ ] **Step 3: 验证内容通过 schema**

Run:

```bash
npm.cmd run validate:content
npm.cmd run build
```

Expected: 内容校验通过 15 个菜单条目；构建此时仍可完成，即使图片文件尚未生成。

---

### Task 4: 生成、转换并审核 15 张 AI 菜品图

**Files:**
- Create: `public/assets/dishes/menu/guaranteed-red-four-platter.webp`
- Create: `public/assets/dishes/menu/fireman-wok-toss.webp`
- Create: `public/assets/dishes/menu/buzhou-shiban-fish.webp`
- Create: `public/assets/dishes/menu/wolf-rib-platter.webp`
- Create: `public/assets/dishes/menu/gaoshou-peach-crisps.webp`
- Create: `public/assets/dishes/menu/purple-herb-seven-peaches.webp`
- Create: `public/assets/dishes/menu/currency-jade-greens.webp`
- Create: `public/assets/dishes/menu/fire-cage-barbecue.webp`
- Create: `public/assets/dishes/menu/spicy-sand-konjac.webp`
- Create: `public/assets/dishes/menu/kunlun-snow-lotus.webp`
- Create: `public/assets/dishes/menu/divine-fire-red-armor-bun.webp`
- Create: `public/assets/dishes/menu/feather-arrow-golden-crow-char-siu.webp`
- Create: `public/assets/dishes/menu/zhang-forbidden-mushroom-sea-firefly-soup.webp`
- Create: `public/assets/dishes/menu/jidi-city-red-sausage.webp`
- Create: `public/assets/dishes/menu/zifu-palace-red-egg.webp`
- Create: `docs/research/menu-image-review.md`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Consumes: Task 1 的视觉研究、Task 3 的菜品设定与固定 slug。
- Produces: 15 张可发布 WebP 和逐图审核记录。

- [ ] **Step 1: 为每道菜生成独立图片**

调用 `imagegen` 逐张生成，不使用官方图片作为输入。每个提示词必须包含：

```text
16:9 横向东方幻想宴席概念图；菜品主体占画面主要区域，食材清晰可辨；使用该地图主题的抽象环境、色彩和材质；结合研究资料中可信的高层视觉提示；无人物、无文字、无 Logo、无 UI、无官方截图构图、无水印；不模仿具体在世艺术家。
```

再追加该菜的 `dishSetting`、地图氛围和研究文档中的“AI 二创方向”。对“待考证”条目只使用菜名与地图氛围，不加入未经确认的游戏形象。

- [ ] **Step 2: 使用现有 sharp 统一输出**

确认工具存在：

```bash
node -e "console.log(require.resolve('sharp'))"
```

将生成结果裁切到 `1600 × 900`，质量 `86`，输出到对应 slug：

```js
await sharp(inputPath)
  .resize(1600, 900, { fit: "cover", position: "attention" })
  .webp({ quality: 86 })
  .toFile(outputPath);
```

不提交原始生成文件，只提交最终 WebP。

- [ ] **Step 3: 制作联系表并逐图审核**

`docs/research/menu-image-review.md` 对每张图记录：

- 菜名、文件路径、主题。
- 菜品是否清晰可辨。
- 是否符合研究摘要和主题色。
- 是否存在文字伪影、人物、Logo、UI、官方素材或高度相似构图。
- 是否通过；不通过则重新生成。

联系表只用于本地审核，不提交到仓库。

- [ ] **Step 4: 增加图片存在性验证**

在菜单验证循环中从 `image.src` 解析仓库路径，并使用 `existsSync` 检查文件存在；路径必须保持在 `public/assets/dishes/menu/` 内，扩展名必须是 `.webp`。

Run:

```bash
npm.cmd run validate:content
```

Expected: 15 个图片路径全部存在，图片授权字段固定且内容校验通过。

---

### Task 5: 新增 15 个正式菜单详情页

**Files:**
- Create: `src/pages/menu/[slug].astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: 完整 `menuItems` 条目和 `getMapTheme()`。
- Produces: 15 个 `/menu/<slug>/` 静态页面。

- [ ] **Step 1: 实现静态路径**

页面 frontmatter 使用：

```astro
---
import { getCollection } from "astro:content";
import BaseLayout from "../../layouts/BaseLayout.astro";
import { getMapTheme } from "../../data/mapThemes";
import { sitePath } from "../../lib/site";

export async function getStaticPaths() {
  const items = await getCollection("menuItems");
  return items.map((item) => ({ params: { slug: item.data.slug }, props: { item } }));
}

const { item } = Astro.props;
const data = item.data;
const theme = getMapTheme(data.map);
---
```

- [ ] **Step 2: 实现详情页面结构**

复用现有 `.detail-hero`、`.detail-hero-grid`、`.detail-layout` 和 `.detail-section`，页面必须依次渲染：

- 地图席位、菜名、分类、短描述和 AI 图片。
- 菜品介绍：`dishIntro`。
- 菜品设定：`dishSetting`。
- 席间趣评：`playerComment`。
- 推荐搭配：`recommendedPairing`。
- 相关江湖元素：`relatedElements` 列表。
- 侧栏：地图、分类、AI 图片来源与授权说明。
- 固定说明：“本页为无间食肆虚拟菜品二创，不代表游戏官方设定或现实售卖。”

不渲染档案号、可信度、来源考据、发布状态或审核提示。

- [ ] **Step 3: 添加最小详情页样式**

只补充正式菜单详情需要的列表、主题签牌和 AI 说明样式；继续复用现有布局变量，不创建第二套详情页设计。

- [ ] **Step 4: 验证路由数量**

Run:

```bash
npm.cmd run build
```

Expected: 构建日志包含 15 个 `/menu/<slug>/index.html`，并保留 `/menu/index.html`。

---

### Task 6: 连接菜单卡并实现首页每日推荐

**Files:**
- Modify: `src/components/MenuItemCard.astro`
- Create: `src/components/DailySpecialCard.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `menuItems` 的完整字段和 `sitePath()`。
- Produces: 菜单详情入口、三个每日推荐卡槽和本地日期轮换。

- [ ] **Step 1: 为菜单卡增加唯一详情链接**

`MenuItemCard` 导入 `sitePath`，为菜名增加：

```astro
<h3 class:list={{ "is-long-title": isLongTitle }}>
  <a href={sitePath(`/menu/${data.slug}/`)}>{data.title}</a>
</h3>
```

卡片本体仍是 `article`，不嵌套多个链接；标题链接必须有清晰焦点样式。

- [ ] **Step 2: 创建每日推荐卡槽组件**

`DailySpecialCard.astro` 接收 `{ theme, items }`，按 `order` 排序，以第一项作为无 JavaScript 回退。组件渲染：

- `article[data-daily-slot][data-offset]`
- 一个详情链接。
- `img[data-daily-image]`
- 地图、菜名、分类、短描述对应的数据标记。
- `<script type="application/json" data-daily-options>`，其中每个候选只包含 `title`、`map`、`category`、`description`、已经经过 `sitePath()` 的 `href` 和 `image`。

- [ ] **Step 3: 替换首页当前考据型推荐区**

删除首页的 `DishGrid`、`isPublicDishStatus`、`dishes` 和 `featuredDishes`。改为：

```astro
const menuItems = await getCollection("menuItems");
const dailyGroups = mapThemes.map((theme, offset) => ({
  theme,
  offset,
  items: menuItems
    .filter((item) => item.data.map === theme.name)
    .sort((a, b) => a.data.order - b.data.order),
}));
```

首页标题使用“今日三席推荐”，说明“聚窟洲、火罗国、龙隐洞天各上一道；今日不变，明日换席”。渲染三个 `DailySpecialCard`。

- [ ] **Step 4: 实现本地日期算法**

首页脚本读取每个卡槽 JSON，并使用：

```js
const now = new Date();
const dayNumber = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
const index = (dayNumber + Number(slot.dataset.offset)) % options.length;
```

只更新现有三个卡槽的链接、图片和文本，不创建额外 DOM，不使用随机数、定时器或自动轮播。

- [ ] **Step 5: 添加推荐卡响应式样式**

- 桌面三列，`max-width: 1180px`。
- 图片固定 `aspect-ratio: 16 / 9`。
- 标题、描述和分类签牌不截断。
- `900px` 以下两列，`560px` 以下单列。
- 三主题继续使用 `data-theme-card` 变量，边框和强调色保持明显差异。

---

### Task 7: 最终版权、内容和视觉验证

**Files:**
- Modify if findings require: `docs/research/menu-visual-references.md`
- Modify if findings require: `docs/research/menu-image-review.md`
- Modify if findings require: `src/content/menu-items/*.md`
- Modify if findings require: `src/components/DailySpecialCard.astro`
- Modify if findings require: `src/pages/menu/[slug].astro`
- Modify if findings require: `src/styles/global.css`

**Interfaces:**
- Consumes: Tasks 1–6 的完整结果。
- Produces: 可供用户本地审核的构建与截图证据。

- [ ] **Step 1: 执行版权与来源复审**

调用 `copyright-source-review`，确认：

- 研究链接与结论一一对应。
- 15 张图无官方素材、Logo、截图、UI 或角色复刻。
- 详情页明确为本站虚拟菜品二创。
- 所有 AI 图片都有固定来源与授权说明。

- [ ] **Step 2: 执行内容与构建验证**

Run:

```bash
npm.cmd run validate:content
npm.cmd run build
git diff --check
```

Expected:

```text
content validation passed: 6 dish file(s), 15 menu item file(s) checked
```

Astro 构建成功，并生成 15 个正式菜单详情页。

- [ ] **Step 3: 验证每日推荐算法**

在浏览器中固定两个连续本地日期，确认：

- 每次正好显示三张推荐卡。
- 每个主题正好一张。
- 同一天结果稳定。
- 下一天每个主题按自身列表轮换。
- 禁用 JavaScript 时仍显示每主题排序第一的菜品。

- [ ] **Step 4: 响应式截图检查**

在约 `1280 × 900` 与 `390 × 844` 检查：

- 首页三张推荐卡。
- 菜单页三主题筛选状态。
- “货币赌玉一片绿时蔬”详情页。
- “张家禁地鲜蘑菇海萤汤”详情页。

确认图片非空、文字不溢出、长菜名不裁切、卡片无嵌套交互、页脚非官方声明存在。
