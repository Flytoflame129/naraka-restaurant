---
name: naraka-meme-research
description: Use when researching, checking, or summarizing NARAKA: BLADEPOINT player memes, community slang, meme origins, source links, credibility, and meme types for NARAKA Restaurant content.
---

# naraka-meme-research

## when_to_use

Use this skill when the task is to collect, verify, or organize 《永劫无间 / NARAKA: BLADEPOINT》玩家梗资料 for NARAKA Restaurant.

Use it for:

- 新增 Meme 资料卡。
- 给 Dish 文案补充梗来源。
- 判断某个梗是否可写成“已核验”。
- 汇总一个梗在多个平台上的传播证据。
- 把零散链接整理成可进入 Markdown / Astro Content Collection 的结构化资料。

Do not use it to invent missing origin stories. If a source is weak or missing, keep the status as “待考证”。

## workflow

1. 先读 `AGENTS.md` 和 `src/content.config.ts`，确认当前项目对地图名、梗类型、来源对象、`status` 与 `publishStatus` 的真实约束；不要在输出里复写过时枚举。
2. 识别本次研究的精确对象：梗名、别名、可能原句、相关角色、武器、地图、操作或社区叫法。
3. 只搜索到足以建立证据链的程度。优先原始视频、原帖、官方材料、作者投稿、维护者备注；能用一手来源时不要拿二手转述充数。
4. 为每条可用来源建立独立 evidence 对象，逐条填写 `title`、`url` 或 `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
5. 写 `supports` 时只写该来源能直接支撑的具体说法，例如“玩家把某操作称为某梗”或“官方公告出现某机制名”。官方机制、社区叫法、本站二创菜品设定必须分开列证，不能混证。
6. 依据 `src/content.config.ts` 的当前受控词汇给出梗类型，并用 `高 / 中 / 低 / 待考证` 评估整体可信度：`高` 代表一手或多条相互印证的可靠来源，`中` 代表上下文可信但一手缺失，`低` 代表单条弱来源或转述，`待考证` 代表无可靠来源或说法冲突。
7. 用自己的话做证据摘要，必要时只保留极短引文。把无法确认的地方单列为 `待人工确认点`，不要抹平不确定性。
8. 给出菜品化方向和公开使用建议：`可使用`、`仅可作为待考证示例`、`暂不建议使用`。

## output_format

Output one or more structured cards:

```markdown
## 梗资料卡

- 梗名:
- 别名:
- 可能原句:
- 梗类型:
- 流行平台:
- 可信度: 高 / 中 / 低 / 待考证
- 状态建议: verified / pending / rejected
- 一句话摘要:
- 证据摘要:
- 相关角色:
- 相关武器:
- 相关地图:
- 相关操作:
- 可转菜品方向:
- 内容风险:
- 待人工确认点:

### 来源证据

```yaml
sources:
  - title:
    url:
    noPublicLinkReason:
    platform:
    sourceType:
    supports:
      - 具体说法
    reliability:
    checkedAt:
    notes:
```

`supports` 必须逐条对应上方摘要里的具体说法，并明确这是在证明官方机制、社区叫法，还是仅为本站二创提供语境。
```

For multiple memes, repeat the card. Keep each evidence object traceable enough for a maintainer to re-check.

## guardrails

- 不允许无来源编造《永劫无间》梗、起源、人物关系、传播路径或玩家共识。
- 不把二手转述写成一手事实。
- 不把“听说”“大家都知道”当作来源。
- 不把官方机制、社区叫法、本站原创菜名或本站菜品设定写成同一层事实。
- 不大量复制原文；只做摘要、归纳和短引。
- 不收集现实玩家隐私，不记录开盒、网暴或攻击性材料。
- 不把待考证内容写成已核验事实。
- 不冒充官方资料站；输出中保留“非官方玩家同好创作站”的定位。
- 如果资料涉及版权、授权、争议或人身攻击，交给 `copyright-source-review` 继续审核。
