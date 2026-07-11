---
name: astro-site-builder
description: Use when building or modifying the NARAKA Restaurant Astro static site, GitHub Pages deployment shape, pages, layouts, components, CSS variables, and content-driven UI.
---

# astro-site-builder

## when_to_use

Use this skill when implementing or changing the Astro website for NARAKA Restaurant.

Use it for:

- 初始化 Astro + Markdown / MDX + GitHub Pages 项目。
- 开发首页、菜单页、菜品详情页、画廊页、投稿页、关于页。
- 设计布局、导航、卡片、非官方声明块、来源状态组件。
- 使用 CSS Variables 实现红色主视觉和地图主题。
- 把 Dish、Meme、Source、MapTheme、GalleryItem 接入内容集合。

## workflow

1. 先读 `AGENTS.md`、`docs/PRD.md`、`docs/domain-model.md`、`docs/tech-decision.md` 再做架构判断；如果任务涉及视觉、布局、主题或组件风格，再读 `docs/design-direction.md`。
2. 视觉任务调用 `ui-ux-pro-max` 产出设计系统建议，但项目自己的金 / 红 / 黑主题、三地图语义、非官方定位和版权边界优先于自动建议。
3. Keep the site static-first and GitHub Pages friendly. Do not add a backend, database, auth, comments, payments, or heavy CMS unless the user explicitly changes scope.
4. Use content-driven pages:
   - Content lives in Markdown / MDX or Astro Content Collections.
   - Components consume validated content.
   - Reuse existing `mapThemes`, `sitePath()`, and Content Collections where applicable.
   - Dish, Meme, Source, MapTheme, GalleryItem are not hard-coded inside page templates.
5. Build these pages for MVP:
   - 首页
   - 菜单页
   - 菜品详情页
   - 画廊页
   - 投稿页
   - 关于页
6. Use reusable components for:
   - Layout
   - Navigation
   - Dish card
   - Source badge
   - Non-official notice
   - Map theme section
   - Gallery item
7. Use CSS Variables for theming:
   - Global gold / red / black visual language guided by `docs/design-direction.md`.
   - Theme differentiation for 聚窟洲、火罗国、龙隐洞天.
   - Keep contrast and mobile readability.
8. Add only minimal client JavaScript for clear user value, such as filtering, search, or theme persistence.
9. Before finishing, verify at least:
   - 375px, 768px, 1440px layouts.
   - Keyboard focus visibility.
   - 44px minimum tap targets where interactive controls need it.
   - No obvious text overflow or layout breakage.
   - Three map themes are visually distinct.
   - `prefers-reduced-motion` behavior is respected.
   - `npm run build` passes.

## output_format

For planning or implementation summaries, use:

```markdown
## Astro Site Builder 输出

- 任务:
- 涉及页面:
- 涉及组件:
- 内容模型:
- 样式策略:
- GitHub Pages 注意事项:
- 验证命令:

### 变更摘要

-

### 后续风险

-
```

When writing code, keep file changes scoped and report the actual verification output.

## guardrails

- 不过度引入依赖；优先 Astro、Markdown、原生 CSS 和少量 JavaScript。
- 不跳过 `docs/design-direction.md`、`ui-ux-pro-max` 建议和项目版权边界之间的冲突检查。
- 不创建真实餐厅下单、支付、门店营业或官方资料站体验。
- 不硬编码菜品、梗、来源和画廊内容到模板中。
- 不绕过现有 `mapThemes`、`sitePath()` 或 Content Collections 去手搓重复映射。
- 不省略非官方声明。
- 不把 `pending` / “待考证” 内容显示成 `verified`。
- 不使用未授权图片或客户端提取素材。
- 不忽略 375 / 768 / 1440 视口、键盘焦点、44px、文字溢出或 reduced-motion。
- 不牺牲移动端可读性、语义化 HTML、键盘可访问性和图片替代文本。
