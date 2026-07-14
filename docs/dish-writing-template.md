# 菜品写作模板

> 用途：把已研究的《永劫无间》玩家梗写成 NARAKA Restaurant 菜品 Markdown。本站是非官方玩家同好创作站，不得冒充官方。

## Frontmatter 示例

```yaml
---
title: "菜品名（资料整理中）"
slug: "stable-hyphen-slug"
map: "聚窟洲"
category: "招牌菜"
relatedCharacter:
  - "角色名"
relatedWeapon:
  - "武器名"
relatedOperation:
  - "操作或场景"
memeType: "操作梗"
credibility: "中"
image:
  src: "/assets/dishes/abstract-placeholder.svg"
  alt: "原创抽象占位图说明"
  credit: "NARAKA Restaurant 项目原创抽象占位图"
  license: "仅用于本站非商业展示，不含官方游戏素材、角色图、Logo、截图或宣传图"
tags:
  - "资料整理中"
  - "操作梗"
sources:
  - title: "来源标题"
    url: "https://example.com/source"
    platform: "平台"
    sourceType: "official"
    supports:
      - "这个来源具体支撑的说法一"
      - "这个来源具体支撑的说法二"
    reliability: "high"
    checkedAt: "2026-07-07"
    notes: "说明这个来源不能证明什么，避免结论外推。"
status: "mixed"
publishStatus: "needs-review"
curator: "NARAKA Restaurant 维护者"
summary: "一句话摘要。"
dishIntro: "菜品介绍。"
memeOrigin: "梗的来源说明；来源不足必须写待考证。"
dishSetting: "虚拟菜品设定。"
playerComment: "玩家吐槽。"
pairingNote: "推荐搭配说明。"
verificationNote: "待考证或资料整理说明。"
priceLabel: "虚拟菜单价：一枚魂玉"
spiceLevel: 2
recommendedPairing: "搭配项"
updatedAt: "2026-07-07"
---
```

## Source 字段规范

每条 `sources` 必须说明“来源能证明哪些具体说法”，不能只放相关链接。

- `title`：来源标题。
- `url`：公开可访问链接；如没有公开链接，必须写 `noPublicLinkReason`。
- `platform`：来源平台。
- `sourceType`：`official` / `guide` / `community` / `video` / `forum` / `unknown`。
- `supports`：这个来源具体支撑的页面说法，至少一条。
- `reliability`：`high` / `medium` / `low`。
- `checkedAt`：最近核查日期，格式 `YYYY-MM-DD`。
- `notes`：说明来源限制，例如“只支撑机制术语，不支撑玩家梗称呼”。

## 正文结构

```markdown
## 菜品介绍

说明这道菜为什么适合本站菜单，以及它不是现实售卖餐品。

## 梗的来源

概括来源、平台、证据强弱。不要大量复制原文；不确定处写“待考证”。

## 菜品设定

用虚拟餐厅口吻写味型、摆盘、地图主题氛围。

## 玩家吐槽

轻松吐槽游戏场景或梗的反差，不攻击现实玩家、主播或群体。

## 推荐搭配

给出虚拟搭配和理由。

## 来源链接

- [来源标题](https://example.com/source)

## 待考证说明

- 待考证：
```

## 文案风格要求

- 可以幽默，但笑点应落在游戏场景、操作反差或菜品设定上。
- 保留非官方同好站语气，不写成官方公告、官方设定或官方菜谱。
- 来源不足时，在标题、摘要、正文或状态说明中显示“待考证”或“资料整理中”。
- 菜名要像虚拟餐厅菜单，但不能暗示真实售卖、下单、支付或门店服务。
- 菜品名、玩家吐槽、口味和摆盘如果是本站原创，必须标注为“本站二创”或“本站菜品化命名”。

## 禁止事项

- 不能低俗、歧视、攻击玩家、攻击主播或引战。
- 不能冒充官方，不能声称得到官方认可。
- 不能无来源编造梗来源、传播路径、玩家共识或角色关系。
- 不能把社区传闻写成确定事实。
- 不能使用官方图片、角色图、Logo、游戏截图、宣传图或未授权社区二创。
- 不能大段复制来源原文、评论或视频文案。
