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

1. Read the request and identify the exact meme, alias, character, weapon, map, operation, or community phrase being researched.
2. Search only as much as needed to find source candidates. Prefer primary sources: original video, original post, official material, author submission, or maintainer note.
3. Record every usable source link with platform, author or publisher, title, publication date if visible, and access date if relevant.
4. Assign a meme type from this controlled set: `谐音梗`、`角色梗`、`武器梗`、`地图梗`、`操作梗`、`社区梗`、`赛事梗`、`二创梗`、`其他`。
5. Assign credibility:
   - `高`: primary source or multiple mutually consistent reliable sources.
   - `中`: credible secondary source plus context, but primary source not found.
   - `低`: weak source, unclear origin, or single unverified repost.
   - `待考证`: no reliable source, conflicting claims, or only user memory.
6. Summarize in your own words. Use short quotes only when needed and never copy large blocks of source text.
7. Mark any unresolved facts as `待考证点` instead of smoothing them over.
8. End with whether this meme is safe to use in public site content: `可使用`、`仅可作为待考证示例`、`暂不建议使用`。

## output_format

Output one or more structured cards:

```markdown
## 梗资料卡

- 梗名:
- 别名:
- 梗类型:
- 可信度: 高 / 中 / 低 / 待考证
- 状态建议: verified / pending / rejected
- 一句话摘要:
- 梗来源说明:
- 待考证点:
- 相关角色:
- 相关武器 / 地图 / 操作:
- 可转菜品方向:
- 内容风险:

### 来源

| 可信度 | 类型 | 平台 | 标题 | 作者/发布者 | 日期 | 链接 | 备注 |
| --- | --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |  |
```

For multiple memes, repeat the card. Keep each source row traceable enough for a maintainer to re-check.

## guardrails

- 不允许无来源编造《永劫无间》梗、起源、人物关系、传播路径或玩家共识。
- 不把二手转述写成一手事实。
- 不把“听说”“大家都知道”当作来源。
- 不大量复制原文；只做摘要、归纳和短引。
- 不收集现实玩家隐私，不记录开盒、网暴或攻击性材料。
- 不把待考证内容写成已核验事实。
- 不冒充官方资料站；输出中保留“非官方玩家同好创作站”的定位。
- 如果资料涉及版权、授权、争议或人身攻击，交给 `copyright-source-review` 继续审核。
