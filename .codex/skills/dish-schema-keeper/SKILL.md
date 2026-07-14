---
name: dish-schema-keeper
description: Use when creating, editing, or reviewing NARAKA Restaurant dish Markdown frontmatter, Astro Content Collection fields, schema validity, publish status, and empty field checks.
---

# dish-schema-keeper

## when_to_use

Use this skill when a Dish markdown file, frontmatter block, or Astro Content Collection schema needs to be created, reviewed, normalized, or blocked from publication.

Use it for:

- 新增菜品 Markdown。
- 审核 PR 中的菜品字段。
- 设计 Astro Content Collection schema。
- 检查 Dish 是否能从 `pending` 升到 `verified`。
- 发现页面字段为空、类型不一致或来源缺失。

## workflow

1. 第一步先读并解析 `src/content.config.ts` 与 `scripts/validate-content.mjs`。这两个文件才是字段、枚举、细化校验和发布门的实现真相；不要相信旧 skill 或旧模板里的手抄字段表。
2. 从实现中提取当前需要检查的字段、受控词汇和自定义规则，再去定位 dish 文件或提议的 frontmatter。
3. 以结构化数据解析 frontmatter，不依赖视觉排版。报告里的字段检查表也应基于当前实现动态列出，而不是照抄历史枚举。
4. 逐条核对 `sources`：
   - 每条都要检查 `title`、`url` 或 `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
   - `supports` 必须写清楚来源具体支撑哪些页面说法，不能只写“相关资料”。
   - 如果页面句子超出来源能证明的范围，必须改写为“本站二创”、标注“待考证”，或把 `status` / `publishStatus` 降级。
   - `verified` 不得依赖 `low` 可信度来源。
5. 应用当前实现里的发布门，至少阻止这些情况：
   - schema 解析失败。
   - `verified` 或 `mixed` 缺少来源。
   - 图片缺少说明、授权或发布所需备注。
   - `pending` / `mixed` / “待考证” 被伪装成已核验或已发布。
   - `published` 与 `rejected` 等状态组合冲突。
6. 检查正文是否保留非官方定位、梗来源说明、待考证提示和必要的图片说明。
7. 输出发布结论：`可发布`、`需修改`、`不得发布`，并说明结论是基于当前实现文件得出的。

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
| [从当前实现提取的字段名] | pass/fail |  |

### 来源逐条检查

| 来源 | sourceType | supports | reliability | checkedAt | 结果 | 说明 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  | pass/fail |  |

### 阻塞项

- [列出必须修复的问题]

### 建议修改

- [列出非阻塞优化]
```

## guardrails

- 不符合 schema 的内容不得直接发布。
- `sources` 为空时不得标为 `verified` 或 `mixed`。
- 图片没有授权说明或来源说明时不得作为正式内容发布。
- `status` 不得用自然语言替代枚举值。
- `publishStatus` 不得用来源可信度替代。
- 不为了页面效果硬编码 Dish 内容到组件里。
- 不把 `pending`、`mixed`、`needs-review` 或 “待考证” 内容展示成已核验。
- 不得用 skill 自己的历史字段列表覆盖 `src/content.config.ts` 与 `scripts/validate-content.mjs` 的当前实现。
- 结构争议无法解决时，优先参考 `docs/domain-model.md` 和 `AGENTS.md`。
