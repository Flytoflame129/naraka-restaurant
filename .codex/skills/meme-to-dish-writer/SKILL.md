---
name: meme-to-dish-writer
description: Use when turning sourced NARAKA: BLADEPOINT player memes into virtual restaurant dish copy, menu descriptions, meme explanations, playful player comments, and pairing suggestions.
---

# meme-to-dish-writer

## when_to_use

Use this skill when a researched Meme needs to become a NARAKA Restaurant Dish, menu item, set meal, limited special, or themed copy block.

Use it after `naraka-meme-research` when possible. If the meme source is incomplete, write the dish as a `待考证` or `pending` item and keep that uncertainty visible.

## workflow

1. 先读 `AGENTS.md`、`src/content.config.ts` 和 `docs/dish-writing-template.md`，确认当前 dish schema、七分区正文结构、非官方声明和“待考证”展示要求；不要在 skill 里重抄整份 schema。
2. 读取 `naraka-meme-research` 产出的梗资料卡，区分三层内容：
   - 来源事实：只能写来源真正支持的梗来源、平台语境、角色/武器/地图/操作关联。
   - 本站二创：菜品名、菜品设定、推荐搭配、玩家吐槽。
   - 不可用内容：攻击性、侵权、无来源硬扩写或冒充官方的表达。
3. 分别判断两个状态，不得互相替代：
   - `status`: `verified` / `pending` / `mixed` / `rejected`，表示来源证据质量。
   - `publishStatus`: `draft` / `published` / `needs-review`，表示当前内容是否经过 schema、版权和发布审核。
4. 来源不确定时，把 `status` 设为 `pending` 或 `mixed`，并在标题、摘要、`梗的来源` 或 `待考证说明` 中明确写出“资料整理中”或“待考证”。
5. 选择一个像虚拟菜单、但不伪装成官方或真实售卖的菜名；如果菜名是本站原创命名，要直接标注为“本站菜品化命名”。
6. 按 `docs/dish-writing-template.md` 的七分区写正文：`菜品介绍`、`梗的来源`、`菜品设定`、`玩家吐槽`、`推荐搭配`、`来源链接`、`待考证说明`。其中 `梗的来源` 只写来源事实，`菜品设定` / `玩家吐槽` / `推荐搭配` 明确属于本站二创。
7. 保留逐条 `sources` 合同，只传递必要字段给下一步，不伪造完整发布态 frontmatter。
8. 结尾明确写出“下一步交给 `dish-schema-keeper` 补全并审核 schema / 发布字段”。

## output_format

Use this structure:

```markdown
## 菜品文案

- 菜品名:
- 所属地图主题:
- 梗类型:
- status: verified / pending / mixed / rejected
- publishStatus: draft / published / needs-review
- 可信度: 高 / 中 / 低 / 待考证
- 一句话摘要:
- 本站命名说明: 本站菜品化命名 / 沿用社区叫法 / 待确认

### 来源事实

- 已证实信息:
- 仍待考证:

### 菜品介绍

[说明为什么适合本站菜单；如来源不足，显式写“资料整理中”或“待考证”。]

### 梗的来源

[只写来源支持的梗语境、平台和证据强弱；不把本站原创设定混进来源。]

### 菜品设定

[2-4 句，明确标注为本站二创设定，像餐厅菜单，但不暗示真实售卖。]

### 玩家吐槽

[轻松幽默，明确属于本站二创，不攻击玩家、主播、角色玩家群体或现实个人。]

### 推荐搭配

- 搭配菜品:
- 搭配理由: [本站二创]

### 来源链接

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

### 待考证说明

- 待考证:
- 下一步: 交给 `dish-schema-keeper` 补全并审核 schema / 发布字段。
```

If the input is unsafe, output `暂不发布` and list the blocking reason instead of trying to make it funny.

## guardrails

- 不得冒充官方口吻，不写成官方公告、官方设定或官方菜单。
- 不得把 `status` 当成 `publishStatus`，也不得把 `publishStatus` 当成来源可信度。
- 不得把来源事实、本站原创菜名、本站二创菜品设定、玩家吐槽混写成同一层证据。
- 不得低俗、歧视、攻击玩家、攻击主播、攻击角色玩家群体或引战。
- 不得把现实食品售卖、下单、支付、门店营业写成真实承诺。
- 不得无来源扩写梗来源；来源不确定必须写“待考证”或“资料整理中”。
- 不得使用未授权图片、游戏客户端提取素材或社区作品。
- 不得为了押韵、谐音或幽默牺牲来源准确性。
- 未经过 schema 与版权审核前，不得因为 `status=verified` 就写成可直接 `published`。
- 若文案涉及授权、投稿者权益、图片、争议人物或攻击性内容，先交给 `copyright-source-review`。
