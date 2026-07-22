# NARAKA Restaurant

NARAKA Restaurant（无间食肆）是一个《永劫无间 / NARAKA: BLADEPOINT》玩家同好创作站，以“虚拟游戏主题餐厅”的形式呈现玩家共创菜品、江湖趣谈、来源档案和社区投稿。

本站不是官方网站，不销售真实餐品，也不代表游戏官方立场。未经核验的具体说法不得写成已确认事实。

## 当前内容

- 15 道正式虚拟菜单：聚窟洲 8 道、火罗国 4 道、龙隐洞天 3 道。
- 每道正式菜单均有独立详情页、原创 AI 辅助菜品图和图片权利说明。
- 考据型菜品档案与正式虚拟菜单分开维护，只有通过来源审核的档案才生成公开页面。
- 首页、菜单、画廊、投稿、关于、正式菜单详情和考据菜品详情均为静态页面。

## 技术栈

- Astro 7
- Astro Content Collections + Markdown
- 原生 CSS、CSS Variables 和少量原生 JavaScript
- GitHub Actions + GitHub Pages

## 本地运行

需要 Node.js 24 和 npm 10 或更高版本。

```bash
npm ci
npm run dev
```

常用命令：

```bash
npm run validate:content
npm run build
npm run preview
```

`npm run build` 会先运行内容校验，再生成 `dist/` 静态站点。

## 项目结构

```text
src/
  assets/               由 astro:assets 优化的本地内容图片
  components/           Astro 展示组件
  content/menu-items/   15 道正式虚拟菜单及详情内容
  content/dishes/       带来源、可信度和发布状态的考据档案
  data/                 地图主题和画廊占位数据
  layouts/              全站布局
  pages/                静态路由
  styles/               全站 CSS
public/assets/          favicon、社交分享图等无需处理的静态资源
scripts/                无额外依赖的内容校验脚本
docs/                   产品、领域、研究和视觉资产登记
.codex/skills/          项目专用 Codex 工作流
.github/                投稿、PR 和部署配置
```

## 内容边界

`src/content/menu-items/` 是虚拟餐厅正式菜单的唯一数据源，同时驱动菜单卡片、首页推荐和 `/menu/[slug]/` 详情页。每个条目包含菜品介绍、菜品设定、席间趣评、推荐搭配、相关江湖元素和图片说明。

`src/content/dishes/` 保存需要来源证据的考据档案。只有同时满足 `publishStatus: published` 与 `status: verified` 的档案才生成 `/dishes/[slug]/` 公开页面。来源不足时必须使用 `pending`、`mixed` 或 `needs-review`，并保留“待考证”说明。

所有 AI 辅助图片必须登记在 `docs/visual-asset-register.md`，不得使用官方 Logo、游戏截图、客户端提取素材或未获授权的社区作品。

## GitHub 协作

1. 从 `main` 创建功能分支，Codex 分支使用 `codex/` 前缀。
2. 修改后运行 `npm run validate:content` 和 `npm run build`。
3. 提交 Pull Request，并完成仓库 PR 检查清单。
4. PR 会由 `.github/workflows/ci.yml` 自动执行静态构建。

详细规则见 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [AGENTS.md](AGENTS.md)。菜品投稿可使用 GitHub Issue Form。

## GitHub Pages 部署

仓库 Pages 的 Source 需要设置为 **GitHub Actions**。合并到 `main` 后，`.github/workflows/deploy.yml` 会：

1. 使用 Node.js 24 执行 `npm ci`。
2. 根据仓库名设置 Astro 的 `SITE` 与 `BASE_PATH`。
3. 运行 `npm run build`。
4. 上传 `dist/` 并发布到 GitHub Pages。


## 非官方声明

本站为《永劫无间》玩家同好创作项目，非官方网站，与游戏官方无隶属关系。站内内容主要用于玩家交流、文化整理与非商业展示。若内容涉及权益问题，请联系维护者处理。
