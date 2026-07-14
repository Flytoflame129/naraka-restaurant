---
name: naraka-content-pipeline
description: Use when researching a NARAKA: BLADEPOINT player meme, building source evidence, judging credibility, or turning verified findings into a NARAKA Restaurant dish draft.
---

# naraka-content-pipeline

## when_to_use

用于新增或复核玩家梗资料，以及把资料卡转成虚拟餐厅菜品草稿。流程覆盖研究和写作，但不负责最终 schema、版权或发布批准。

## workflow

1. 阅读 `AGENTS.md`、`src/content.config.ts`、`docs/content-research-template.md` 和 `docs/dish-writing-template.md`。
2. 明确研究对象：梗名、可能原句、角色、武器、地图、操作和社区语境。
3. 检索公开且无需登录的来源。优先原始内容、官方机制说明和可追溯的一手社区材料。
4. 为每条来源记录 `title`、`url` 或 `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
5. 逐条核对 `supports`。官方来源只证明官方机制或术语；社区来源只证明社区叫法或传播语境；本站菜名、设定和吐槽属于本站二创。
6. 给出可信度 `高 / 中 / 低 / 待考证`，并建议 `status: verified / mixed / pending / rejected`。证据不足时不得补全事实。
7. 只有资料足以菜品化时才继续写作；否则输出资料卡和阻塞点并停止。
8. 生成菜品草稿，正文按“菜品介绍、梗的来源、菜品设定、玩家吐槽、推荐搭配、来源链接、待考证说明”组织。
9. 菜名若由本站创造，明确标注“本站菜品化命名”；设定、吐槽和搭配明确标注“本站二创”。
10. 草稿默认 `publishStatus: needs-review`。交由 `dish-schema-keeper` 和 `copyright-source-review` 审核后，才能建议公开。

## output_format

```markdown
## 梗资料卡

- 梗名：
- 可能原句：
- 相关角色 / 武器 / 地图 / 操作：
- 梗类型：
- 流行平台：
- 可信度：高 / 中 / 低 / 待考证
- status：verified / mixed / pending / rejected
- 证据摘要：
- 待人工确认点：
- 是否适合菜品化：是 / 仅可作为待考证示例 / 否

### 来源证据

sources:
  - title:
    url:
    noPublicLinkReason:
    platform:
    sourceType:
    supports:
      - 该来源直接支撑的具体说法
    reliability:
    checkedAt:
    notes:

## 菜品草稿

- 菜品名：
- 本站命名说明：
- status：
- publishStatus: needs-review
- 可信度：

### 菜品介绍
### 梗的来源
### 菜品设定（本站二创）
### 玩家吐槽（本站二创）
### 推荐搭配（本站二创）
### 来源链接
### 待考证说明

## 后续审核

- dish-schema-keeper：待执行
- copyright-source-review：待执行
```

若不适合菜品化，省略“菜品草稿”，输出阻塞原因。

## guardrails

- 不允许无来源编造梗、原句、起源、传播路径或玩家共识。
- 不大量复制原文，不抓取需登录或明显不适合抓取的页面。
- 不混淆官方机制、社区叫法和本站二创。
- 不得因 `status: verified` 直接设置 `publishStatus: published`。
- 文案不得低俗、歧视、攻击玩家或主播、泄露隐私或引战。
- 不冒充官方口吻，不暗示真实售卖。
- 不使用官方图片、Logo、截图、角色图或未经授权的社区作品。
- 来源不足时必须写“待考证”或“资料整理中”。

