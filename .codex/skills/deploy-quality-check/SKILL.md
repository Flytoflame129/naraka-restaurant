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
2. Run the available verification commands:
   - If `package.json` exists, run `npm run build`.
   - If Astro check is configured, run `npx astro check` or the project script.
   - If no build system exists yet, state that build verification is not applicable and run file/content checks instead.
3. Check image paths:
   - Local asset paths resolve.
   - Gallery images have source and permission notes.
   - Images have alt text when used in pages.
4. Check links:
   - Internal navigation points to existing routes.
   - Source links are preserved.
   - GitHub contribution links are present on 投稿页 when that page exists.
5. Check mobile basics:
   - Layout has responsive constraints.
   - Text does not obviously overflow.
   - Navigation remains usable.
6. Check content fields:
   - No required Dish fields are empty.
   - `sources` exists for verified content.
   - `status` values are valid.
   - “待考证” is visible for uncertain content.
7. Check legal and community safety:
   - Non-official statement exists.
   - Copyright / rights-holder note exists.
   - No 低俗、歧视、攻击、引战、隐私泄露内容.
8. Output a release decision: `可以上线`、`修复后上线`、`不得上线`.

## output_format

Use this checklist:

```markdown
## 上线前质量检查

- 检查范围:
- 结论: 可以上线 / 修复后上线 / 不得上线
- 构建命令:
- 构建结果:

### Checklist

| 项目 | 状态 | 证据 / 问题 |
| --- | --- | --- |
| npm build | pass/fail/not-applicable |  |
| 图片路径 | pass/fail/not-applicable |  |
| 链接 | pass/fail/not-applicable |  |
| 移动端基本可用性 | pass/fail/not-applicable |  |
| 空字段 | pass/fail/not-applicable |  |
| 版权声明 | pass/fail/not-applicable |  |
| 来源说明 | pass/fail/not-applicable |  |
| 非官方声明 | pass/fail/not-applicable |  |

### 必须修复

-

### 可后续优化

-
```

## guardrails

- 构建失败时不得声明可以上线。
- 关键页面不可访问时不得声明可以上线。
- 缺少非官方声明、版权说明或来源说明时不得声明可以上线。
- 已核验内容缺少来源时不得声明可以上线。
- 图片无路径、无授权说明或无来源说明时不得作为正式画廊内容上线。
- 不把未执行的检查写成 pass；无法检查时写 `not-applicable` 或 `待确认` 并说明原因。
- 发布结论必须基于刚运行的验证输出，不依赖上一次结果。
