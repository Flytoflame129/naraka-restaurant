---
name: dish-schema-keeper
description: Use when creating, editing, or reviewing NARAKA Restaurant dish Markdown frontmatter, Astro Content Collection fields, schema validity, publish status, and empty field checks.
---

# dish-schema-keeper

## source_claim_audit_update

- 每条 `sources` 不只是链接，必须包含 `title`、`url` 或 `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
- `sourceType` 只能使用 `official`、`guide`、`community`、`video`、`forum`、`unknown`。
- `reliability` 只能使用 `high`、`medium`、`low`。
- `supports` 必须写清楚该来源具体支撑页面中的哪些说法；不允许只写“相关资料”。
- 如果页面句子超出来源能证明的范围，必须改写为“本站二创”、标注“待考证”，或把 `status` / `publishStatus` 降级。
- `verified` 内容不得依赖 `low` 可信度来源。

## when_to_use

Use this skill when a Dish markdown file, frontmatter block, or Astro Content Collection schema needs to be created, reviewed, normalized, or blocked from publication.

Use it for:

- 新增菜品 Markdown。
- 审核 PR 中的菜品字段。
- 设计 Astro Content Collection schema。
- 检查 Dish 是否能从 `pending` 升到 `verified`。
- 发现页面字段为空、类型不一致或来源缺失。

## workflow

1. Locate the dish file or proposed frontmatter.
2. Parse frontmatter as structured data. Do not rely on visual formatting alone.
3. Check required fields:
   - `title`
   - `slug`
   - `map`
   - `category`
   - `relatedCharacter`
   - `relatedWeapon`
   - `relatedOperation`
   - `memeType`
   - `credibility`
   - `image`
   - `tags`
   - `sources`
   - `status`
   - `publishStatus`
   - `curator`
4. Validate field rules:
   - `title`: non-empty Chinese display name.
   - `slug`: stable lowercase hyphen-case identifier.
   - `map`: one known MapTheme display name, such as `聚窟洲`、`火罗国`、`龙隐洞天`.
   - `category`: one of `主食`、`小吃`、`饮品`、`招牌菜`、`怪菜`、`套餐`.
   - `relatedCharacter`: array; use empty array only when genuinely unrelated.
   - `relatedWeapon`: array; use empty array only when genuinely unrelated.
   - `relatedOperation`: array; use empty array only when genuinely unrelated.
   - `memeType`: one of `谐音梗`、`角色梗`、`武器梗`、`地图梗`、`操作梗`、`社区梗`、`赛事梗`、`二创梗`、`其他`.
   - `credibility`: one of `高`、`中`、`低`、`待考证`.
   - `image`: path or object with source / license note; empty image is allowed only for draft.
   - `tags`: non-empty array for published content.
   - `sources`: non-empty array for `verified` or `mixed`; each source keeps a URL or explicit no-public-link reason.
   - `status`: source verification state, one of `verified`、`pending`、`mixed`、`rejected`.
   - `publishStatus`: publication control state, one of `draft`、`published`、`needs-review`.
   - `curator`: maintainer or editor who organized this dish.
5. Check body content for dish setting, meme explanation, source status, and non-official wording.
6. Produce a publish decision: `可发布`、`需修改`、`不得发布`.

## output_format

Use this report:

```markdown
## Dish Schema 检查报告

- 文件:
- 结论: 可发布 / 需修改 / 不得发布
- 状态字段:
- 来源状态:

### 字段检查

| 字段 | 结果 | 说明 |
| --- | --- | --- |
| title | pass/fail |  |
| slug | pass/fail |  |
| map | pass/fail |  |
| category | pass/fail |  |
| relatedCharacter | pass/fail |  |
| relatedWeapon | pass/fail |  |
| relatedOperation | pass/fail |  |
| memeType | pass/fail |  |
| credibility | pass/fail |  |
| image | pass/fail |  |
| tags | pass/fail |  |
| sources | pass/fail |  |
| status | pass/fail |  |
| publishStatus | pass/fail |  |
| curator | pass/fail |  |

### 阻塞项

- [列出必须修复的问题]

### 建议修改

- [列出非阻塞优化]
```

## guardrails

- 不符合 schema 的内容不得直接发布。
- `sources` 为空时不得标为 `verified`。
- 图片没有授权说明或来源说明时不得作为正式内容发布。
- `status` 不得用自然语言替代枚举值。
- `publishStatus` 不得用来源可信度替代。
- 不为了页面效果硬编码 Dish 内容到组件里。
- 不把 `pending`、`mixed`、`needs-review` 或 “待考证” 内容展示成已核验。
- 结构争议无法解决时，优先参考 `docs/domain-model.md` 和 `AGENTS.md`。
