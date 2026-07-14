---
name: deploy-quality-check
description: Use when preparing NARAKA Restaurant for deployment or release, checking npm build, links, images, mobile usability, empty content fields, source notes, and copyright notices.
---

# deploy-quality-check

## when_to_use

Use this skill before publishing, merging a release PR, enabling GitHub Pages deployment, or claiming the site is ready to go live.

Use it after major changes to:

- Astro pages or components.
- Dish / Meme / Source / GalleryItem content.
- Image paths or public assets.
- GitHub Pages configuration.
- Copyright, source, or non-official notice copy.

## workflow

1. Identify the target release scope: code, content, assets, or deployment config.
2. Run and record the actual verification commands:
   - `npm run validate:content`
   - `npm run build`
   - If an additional project check exists, note it separately; do not substitute it for the two required commands above.
3. Check image paths and asset records:
   - Local asset paths resolve.
   - Images have alt text and stable dimensions when used in pages.
   - Gallery or hero images have source / permission notes.
   - `docs/visual-asset-register.md` covers AI / original visual assets with usage, alt, and rights notes.
4. Check links:
   - Internal navigation points to existing routes.
   - Source links are preserved.
   - GitHub contribution links are present on 投稿页 when that page exists.
5. Check responsive and interaction quality on these pages when they exist: 首页、菜单、公开详情页、投稿页.
   - Inspect 375px, 768px, and 1440px viewports.
   - No horizontal scrolling, text overflow, or nav overlap.
   - Keyboard focus remains visible.
   - Interactive controls that need tapping stay at or above 44px.
6. Check theme behavior:
   - 聚窟洲 / 火罗国 / 龙隐洞天 have visible differences, not just renamed labels.
   - Theme choice persists after refresh if the app supports persistence.
   - Theme toggle exposes exactly one `aria-pressed=true` active state at a time when applicable.
   - `prefers-reduced-motion` is respected.
7. Check content fields:
   - No required Dish fields are empty.
   - `sources` exists for verified content.
   - `status` values are valid.
   - “待考证” is visible for uncertain content.
8. Check legal and community safety:
   - Non-official statement exists.
   - Copyright / rights-holder note exists.
   - Image source / authorization notes exist where required.
   - No 低俗、歧视、攻击、引战、隐私泄露内容.
9. Output a release decision: `可以上线`、`修复后上线`、`不得上线`, and tie it to the command output and page checks you actually performed.

## output_format

Use this checklist:

```markdown
## 上线前质量检查

- 检查范围:
- 结论: 可以上线 / 修复后上线 / 不得上线
- `npm run validate:content`:
- `npm run build`:

### Checklist

| 项目 | 状态 | 证据 / 问题 |
| --- | --- | --- |
| validate:content | pass/fail/not-applicable |  |
| npm build | pass/fail/not-applicable |  |
| 图片路径 | pass/fail/not-applicable |  |
| 链接 | pass/fail/not-applicable |  |
| 375px / 768px / 1440px | pass/fail/not-applicable |  |
| 三主题差异与持久化 | pass/fail/not-applicable |  |
| 键盘焦点 / 44px / reduced-motion | pass/fail/not-applicable |  |
| 空字段 | pass/fail/not-applicable |  |
| AI / 图片资产登记 | pass/fail/not-applicable |  |
| 版权声明 | pass/fail/not-applicable |  |
| 来源说明 | pass/fail/not-applicable |  |
| 非官方声明 | pass/fail/not-applicable |  |

### 必须修复

-

### 可后续优化

-
```

## guardrails

- `npm run validate:content` 或 `npm run build` 失败时不得声明可以上线。
- 构建失败时不得声明可以上线。
- 关键页面不可访问时不得声明可以上线。
- 缺少非官方声明、版权说明或来源说明时不得声明可以上线。
- 已核验内容缺少来源时不得声明可以上线。
- 图片无路径、无授权说明或无来源说明时不得作为正式画廊内容上线。
- 三主题没有差异、刷新后状态错乱、`aria-pressed` 异常、键盘焦点缺失、44px 不达标或 reduced-motion 失效时，不得写成 pass。
- 不把未执行的检查写成 pass；无法检查时写 `not-applicable` 或 `待确认` 并说明原因。
- 发布结论必须基于刚运行的验证输出，不依赖上一次结果。
