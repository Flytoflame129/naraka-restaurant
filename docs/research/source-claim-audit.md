# 来源—结论对应审查报告

审查日期：2026-07-07

审查原则：每条来源必须说明它能支撑哪些具体说法。不能因为链接与主题相关，就把页面中的菜品名、玩家吐槽、社区共识或机制细节写成已验证事实。

## 总体结论

- `zhendao-crisps.md`：继续公开发布，`publishStatus: published`，`status: verified`。
- `soul-flower-broth.md`：从公开发布降级为待审核，`publishStatus: needs-review`，`status: mixed`。
- `doujiang-huimian.md`：保持不公开，`publishStatus: needs-review`，`status: pending`。
- `soy-milk-noodle.md`：早期占位示例，降级为 `needs-review`。
- `desert-dry-pot.md`：占位示例，降级为 `needs-review`。
- `cavern-night-tea.md`：占位示例，降级为 `needs-review`。

## `src/content/dishes/zhendao-crisps.md`

- 当前 publishStatus：`published`
- 当前 status：`verified`
- 是否建议公开发布：建议继续公开。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| 永劫无间手游官网：振刀技巧及应用 | 振刀是《永劫无间》相关新手技巧内容之一；振刀可作为玩家学习的战斗技巧。 | 不支撑本站菜品名、口味设定、玩家吐槽或具体版本数值。 |
| 《永劫无间》6月24日更新公告 | 官方公告使用“振刀成功”“振刀追击招式”等机制表述；振刀相关效果会随版本更新调整。 | 不支撑具体教学结论，也不支撑玩家梗化表达。 |
| 游民星空振刀玩法解析 | 振刀处于轻击、蓄力、蓝霸体等战斗博弈语境；存在预判和风险语境。 | 不是官方来源，不支撑官方机制细节或固定胜率结论。 |
| TapTap 黑话术语汇总 | 玩家术语汇总收录“进蓝”“跳振”等振刀衍生说法。 | 不支撑官方机制说明，不支撑本站菜品名。 |

### 未被来源支撑的说法

- “振刀脆响酥”菜品名。
- 红金刀光、酥皮、咔声、加菜等口味和吐槽设定。

### 已修改处理

- 已明确写入：菜品名、口味设定和吐槽均为本站菜品化二创。
- 已补充官方新手技巧来源。
- 已避免写固定按键、版本数值或胜率结论。

## `src/content/dishes/soul-flower-broth.md`

- 当前 publishStatus：`needs-review`
- 当前 status：`mixed`
- 是否建议公开发布：暂不建议公开，待人工确认术语边界。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| 《永劫无间》6月24日更新公告 | 官方公告使用“拾取返魂花魄”的表述；返魂花魄相关效果会随版本调整。 | 不支撑返魂机制整体、返魂幡、返魂花主题外观，也不支撑本站菜名。 |
| TapTap 黑话术语汇总 | 社区语境中“吃花”与返魂花魄相关。 | 不能单独支撑官方机制细节、具体回复数值或模式差异。 |

### 未被来源支撑的说法

- 把“返魂花”作为独立官方机制。
- 用返魂幡或返魂花主题外观证明返魂花魄。
- 把“返魂花魄清补盏”写成来源原有说法。

### 已修改处理

- 标题改为“返魂花魄清补盏（资料整理中）”。
- 正文明确区分返魂花魄、返魂机制、返魂幡和返魂花主题外观。
- `status` 改为 `mixed`，`publishStatus` 改为 `needs-review`。

## `src/content/dishes/doujiang-huimian.md`

- 当前 publishStatus：`needs-review`
- 当前 status：`pending`
- 是否建议公开发布：不建议公开。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| Bilibili 视频标题 | “豆浆烩面”出现在公开的《永劫无间》相关视频标题中。 | 不支撑官方原句、最早出处、技能语境或传播范围。 |
| 豆瓣小组公开讨论 | 社区二手解释将其关联到天海 / 和尚语音谐音。 | 不支撑官方字幕、原始出处或权威结论。 |
| 网易大神话题搜索结果 | 存在话题线索。 | 直接抓取没有有效正文，不能支撑具体结论。 |

### 未被来源支撑的说法

- 官方原句已确认。
- 最早出处已确认。
- 天海技能语境已确认。
- 社区传播范围已确认。
- 谐音解释无误。

### 已修改处理

- `status` 从 `mixed` 改为 `pending`。
- 保持 `publishStatus: needs-review`。
- 正文明确写“资料整理中 / 待考证”。

## `src/content/dishes/soy-milk-noodle.md`

- 当前 publishStatus：`needs-review`
- 当前 status：`pending`
- 是否建议公开发布：不建议公开。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| 项目需求上下文 | 仅支撑该条目是早期占位示例。 | 不支撑真实玩家梗来源、传播路径或具体语境。 |

### 已修改处理

- 从 `published` 降级为 `needs-review`。
- 标注为早期占位，正式研究迁移到 `doujiang-huimian.md`。

## `src/content/dishes/desert-dry-pot.md`

- 当前 publishStatus：`needs-review`
- 当前 status：`pending`
- 是否建议公开发布：不建议公开。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| MVP 占位说明 | 仅支撑该条目是火罗国主题占位示例。 | 不支撑任何已存在的玩家梗或社区共识。 |

### 已修改处理

- 从 `published` 降级为 `needs-review`。
- 保留为结构样例，不进入正式菜单。

## `src/content/dishes/cavern-night-tea.md`

- 当前 publishStatus：`needs-review`
- 当前 status：`pending`
- 是否建议公开发布：不建议公开。

### 来源支撑关系

| 来源 | 支撑了什么 | 不支撑什么 |
| --- | --- | --- |
| MVP 占位说明 | 仅支撑该条目是龙隐洞天主题占位示例。 | 不支撑任何已存在的玩家梗或社区共识。 |

### 已修改处理

- 从 `published` 降级为 `needs-review`。
- 保留为结构样例，不进入正式菜单。

## 后续建议

- 第一版只让 `zhendao-crisps.md` 作为 published 正式菜品上线。
- `soul-flower-broth.md` 需要人工确认“吃花”的社区传播范围，再决定是否恢复发布。
- `doujiang-huimian.md` 需要确认官方原句、技能语境和更早出处后，才能考虑发布。
- 三个占位菜品后续应删除、归档或替换为有公开来源的真实梗菜品。
