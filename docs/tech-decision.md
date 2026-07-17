# 技术方案决策

## 背景

NARAKA Restaurant 需要长期维护大量轻量内容：菜品、来源、地图主题、投稿说明和社区作品。项目已采用 Astro + Markdown Content Collections，并通过 GitHub Actions 构建后部署到 GitHub Pages；本文档保留方案比较和当前技术决策依据。

## 比较维度

- 对 HTML/CSS 初学者是否友好。
- 是否适合 Markdown 内容维护。
- 是否适合 GitHub 协作和 Pull Request 审核。
- 是否容易部署到 GitHub Pages。
- 是否方便后续扩展筛选、搜索、主题页和画廊。
- 是否避免过重运行时和后端依赖。

## 方案一：纯 HTML/CSS/JS

**优点**：

- 学习门槛最低，适合立即开始。
- 不需要构建工具，部署简单。
- 对少量页面非常直观。

**缺点**：

- 内容会逐渐散落在 HTML 文件里，长期维护成本高。
- 菜品、梗、来源、画廊作品之间的关系难以结构化。
- 重复布局、导航、页脚和非官方声明容易复制出错。
- 后续筛选、详情页生成和来源状态检查会变得脆弱。

**适用情况**：

- 只做一次性展示页或极小型原型。

## 方案二：Jekyll

**优点**：

- GitHub Pages 原生支持历史久。
- Markdown 内容维护成熟。
- 对静态博客和文档站友好。

**缺点**：

- Ruby 生态对当前项目学习路径不一定友好。
- 组件化体验和现代前端开发体验弱于 Astro。
- 如果后续需要更丰富的交互和内容集合校验，会比较受限。

**适用情况**：

- 以文章、博客、简单集合为主，且希望尽量贴近 GitHub Pages 默认能力。

## 方案三：Astro

**优点**：

- 原生适合内容驱动站点，Markdown/MDX 支持好。
- 默认输出静态页面，适合 GitHub Pages。
- 可以用组件复用首页、菜单卡片、详情页、声明块和主题布局。
- Astro Content Collections 适合为 Dish、Meme、Source、MapTheme 建立 schema。
- 第一版可以几乎不写客户端 JavaScript，后续也能按需加入交互。
- 对会 HTML/CSS、会一点 JavaScript 的维护者比较友好。

**缺点**：

- 需要 Node.js、npm 和构建流程。
- 初始概念比纯 HTML 多，例如 layout、collection、frontmatter、build。
- GitHub Pages 部署需要配置 Actions 或 Pages 构建流程。

**适用情况**：

- 内容会持续更新，页面结构可复用，未来需要筛选、搜索或画廊扩展。

## 推荐方案

推荐使用 **Astro + Markdown + GitHub Pages**。

理由：

- 项目本质是内容驱动站点，而不是复杂 Web App。
- 梗、菜品、来源和画廊作品需要结构化维护，Astro Content Collections 能把内容 schema 变成稳定接口。
- GitHub 协作可以围绕 Markdown 内容和 Issue/PR 模板展开，适合社区维护。
- Astro 静态输出性能好，部署到 GitHub Pages 成本低。
- 对当前技术背景友好：可以从 HTML/CSS 开始，再逐步学习组件、Markdown 数据和少量 JavaScript。

## 决策

第一版正式建站时采用：

- Astro
- Markdown 或 MDX 内容文件
- Astro Content Collections
- 原生 CSS
- GitHub Pages
- GitHub Actions 自动构建部署

暂不采用：

- 后端数据库
- 用户登录系统
- 重型前端 UI 框架
- 复杂 CMS

## 何时重新评估

如果未来出现以下情况，可以重新评估技术方案：

- 投稿量大到 GitHub Issue/PR 审核无法承载。
- 需要用户账号、评论、点赞、收藏等动态功能。
- 需要非技术维护者在可视化后台频繁编辑内容。
- 需要复杂搜索、推荐或多媒体资产管理。
