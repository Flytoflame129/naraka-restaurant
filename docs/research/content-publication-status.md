# 内容发布状态报告

更新日期：2026-07-07

本报告只使用仓库相对路径，避免在项目文档中写入本地绝对路径、沙箱路径或临时路径。

## 公开规则

当前站点通过 `src/lib/site.ts` 中的 `isPublicDishStatus(status, publishStatus)` 判断菜品是否生成公开详情页：

- `publishStatus` 必须是 `published`。
- `status` 不能是 `rejected`。

因此，`needs-review` 与 `draft` 菜品不会生成公开详情页。

## 当前公开菜品

| 菜品文件 | slug | publishStatus | status | 公开详情页 |
| --- | --- | --- | --- | --- |
| `src/content/dishes/zhendao-crisps.md` | `zhendao-crisps` | `published` | `verified` | `/dishes/zhendao-crisps/` |

## 当前 needs-review 菜品

| 菜品文件 | slug | publishStatus | status | 是否生成公开详情页 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `src/content/dishes/soul-flower-broth.md` | `soul-flower-broth` | `needs-review` | `mixed` | 否 | 返魂花魄、返魂机制、返魂幡、返魂花主题外观需要继续区分；社区简称“吃花”还需补充更稳来源。 |
| `src/content/dishes/doujiang-huimian.md` | `doujiang-huimian` | `needs-review` | `pending` | 否 | 官方原句、天海技能语境、最早出处和传播范围仍待考证。 |
| `src/content/dishes/soy-milk-noodle.md` | `soy-milk-noodle` | `needs-review` | `pending` | 否 | 早期占位示例，正式研究已迁移到 `src/content/dishes/doujiang-huimian.md`。 |
| `src/content/dishes/desert-dry-pot.md` | `desert-dry-pot` | `needs-review` | `pending` | 否 | 火罗国主题占位示例，尚未绑定真实玩家梗来源。 |
| `src/content/dishes/cavern-night-tea.md` | `cavern-night-tea` | `needs-review` | `pending` | 否 | 龙隐洞天主题占位示例，尚未绑定真实玩家梗来源。 |

## 当前 draft 菜品

暂无。

## 按 status 汇总

### `verified`

- `src/content/dishes/zhendao-crisps.md`

### `mixed`

- `src/content/dishes/soul-flower-broth.md`

### `pending`

- `src/content/dishes/doujiang-huimian.md`
- `src/content/dishes/soy-milk-noodle.md`
- `src/content/dishes/desert-dry-pot.md`
- `src/content/dishes/cavern-night-tea.md`

### `rejected`

暂无。

## 为什么只有 `zhendao-crisps` 被公开

`src/content/dishes/zhendao-crisps.md` 同时满足两个公开条件：

- `publishStatus: published`
- `status: verified`

它的来源中包含官方新手技巧页面、官方更新公告、公开攻略和社区术语汇总。来源可以支撑“振刀是游戏相关机制 / 技巧内容”“振刀与战斗博弈有关”“振刀存在社区黑话语境”等具体说法。页面中的菜品名、口味、摆盘和玩家吐槽已明确标注为本站菜品化二创，没有写成来源原文或官方说法。

其他菜品目前不公开，原因是：

- `soul-flower-broth.md`：需要继续人工确认“返魂花魄”和“吃花”的边界，避免把返魂机制、返魂幡和外观主题混用。
- `doujiang-huimian.md`：公开来源只支撑“短语出现”和“社区二手解释”，不能证明官方原句、天海技能语境、最早出处或主要传播范围。
- `soy-milk-noodle.md`：早期占位示例，不应与正式草稿重复公开。
- `desert-dry-pot.md`：占位示例，没有真实玩家梗来源。
- `cavern-night-tea.md`：占位示例，没有真实玩家梗来源。

## 需要补来源后才能公开的菜品

- `src/content/dishes/soul-flower-broth.md`
  - 需要补充更可靠的社区来源，确认“吃花”常见语境。
  - 需要继续避免混用返魂花魄、返魂幡、返魂机制整体和返魂花主题外观。

- `src/content/dishes/doujiang-huimian.md`
  - 需要确认官方原句或可核验字幕。
  - 需要确认天海相关技能语境。
  - 需要确认更早出处和主要传播路径。
  - 需要确认谐音解释是否存在误读或地区听感差异。

- `src/content/dishes/desert-dry-pot.md`
  - 需要绑定真实玩家梗、公开来源或投稿记录，否则应继续作为占位或归档。

- `src/content/dishes/cavern-night-tea.md`
  - 需要绑定真实玩家梗、公开来源或投稿记录，否则应继续作为占位或归档。

`src/content/dishes/soy-milk-noodle.md` 建议后续归档或删除，因为它已经被 `src/content/dishes/doujiang-huimian.md` 取代。
