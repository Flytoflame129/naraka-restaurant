---
name: meme-to-dish-writer
description: Use when turning sourced NARAKA: BLADEPOINT player memes into virtual restaurant dish copy, menu descriptions, meme explanations, playful player comments, and pairing suggestions.
---

# meme-to-dish-writer

## when_to_use

Use this skill when a researched Meme needs to become a NARAKA Restaurant Dish, menu item, set meal, limited special, or themed copy block.

Use it after `naraka-meme-research` when possible. If the meme source is incomplete, write the dish as a `待考证` or `pending` item and keep that uncertainty visible.

## workflow

1. Read the meme card, source links, credibility, meme type, and any related Character / MapTheme.
2. Decide whether the dish can be written as:
   - `正式菜品`: source is sufficiently reliable.
   - `待考证菜品`: source exists but is weak or incomplete.
   - `暂不发布`: meme is unsafe, attacking, infringing, or too unclear.
3. Choose a dish name that sounds like a restaurant menu item but stays clearly fictional.
4. Write the dish setting in a concise menu voice: flavor, texture, serving scene, and map-theme atmosphere.
5. Explain the meme plainly so new players can understand it.
6. Add light “玩家吐槽” that jokes about the situation, not about real people or player groups.
7. Add recommended pairing with another fictional dish, drink, theme, or gallery item.
8. Keep source status visible. If uncertain, include “待考证” in the status and explanation.

## output_format

Use this structure:

```markdown
## 菜品文案

- 菜品名:
- 所属地图主题:
- 梗类型:
- 来源状态: verified / pending / mixed / rejected
- 可信度: 高 / 中 / 低 / 待考证

### 菜品设定

[2-4 句，像餐厅菜单，但不暗示真实售卖。]

### 梗解释

[说明梗来自什么语境。来源不确定时写“待考证”。]

### 玩家吐槽

[轻松幽默，不攻击玩家、主播、角色玩家群体或现实个人。]

### 推荐搭配

- 搭配菜品:
- 搭配理由:

### 来源提示

- 来源链接:
- 待考证点:
```

If the input is unsafe, output `暂不发布` and list the blocking reason instead of trying to make it funny.

## guardrails

- 不得冒充官方口吻，不写成官方公告、官方设定或官方菜单。
- 不得低俗、歧视、攻击玩家、攻击主播、攻击角色玩家群体或引战。
- 不得把现实食品售卖、下单、支付、门店营业写成真实承诺。
- 不得无来源扩写梗来源；来源不确定必须写“待考证”。
- 不得使用未授权图片、游戏客户端提取素材或社区作品。
- 不得为了押韵、谐音或幽默牺牲来源准确性。
- 若文案涉及授权、投稿者权益、图片、争议人物或攻击性内容，先交给 `copyright-source-review`。
