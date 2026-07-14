---
name: copyright-source-review
description: Use when reviewing NARAKA Restaurant content for non-official disclaimers, source attribution, copyright, image permissions, creator rights, takedown risk, and community safety.
---

# copyright-source-review

## source_claim_audit_update

- 审核时必须做“来源—结论对应”：逐条检查来源能证明页面里的哪些具体句子。
- 每条 `sources` 必须包含 `title`、`url` 或 `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
- `supports` 不得泛写“来源相关”；必须拆成可核验的具体说法。
- 官方来源只支撑官方术语和官方说明，不自动支撑玩家梗称呼、菜品命名、吐槽或社区共识。
- 社区来源只能支撑社区语境线索，不能单独证明官方机制细节。
- 高风险或无来源结论必须阻止公开发布，不用“建议补充”代替阻塞。

## when_to_use

Use this skill before publishing or merging any NARAKA Restaurant content that includes memes, dish copy, source claims, images, gallery items, submissions, screenshots, author names, or community references.

Use it especially when:

- 内容来自投稿、社交平台、视频、截图或二创作品。
- 图片、字体、图标、海报、菜单设计需要展示。
- 文案提到玩家、主播、社区争议或现实个人。
- 页面、页脚或关于页可能缺少非官方声明。

## workflow

1. 先读 `AGENTS.md` 与 `docs/visual-asset-register.md`，确认非官方声明、权利边界和当前 AI / 原创视觉资产登记。
2. Identify all content being reviewed: page copy, Markdown, images, links, gallery entries, and source notes.
3. Check non-official positioning:
   - Page or nearby context must make clear this is a 非官方玩家同好创作站.
   - Do not mimic official announcements, official support, official sales, or official database wording.
4. Check source attribution:
   - Every concrete meme claim needs a source or “待考证”.
   - Every source keeps link, author / publisher, platform, and note when available.
5. 做“来源 - 结论对应”逐句审核：
   - 官方来源只支撑官方机制、官方术语或官方说明。
   - 社区来源只支撑社区叫法、传播语境或玩家解释。
   - 本站二创菜名、吐槽、菜品设定单独标注，不得伪装成来源原文。
6. Check copyright and permission:
   - Game trademarks and names are treated as rights-holder property.
   - No direct game-client asset extraction unless permission is clearly documented.
   - Gallery images require author, source, and license / permission note.
7. Check AI / 图片资产:
   - 对照 `docs/visual-asset-register.md`，核对相对路径、用途、alt、生成方式或作者信息。
   - AI 图片必须保留生成说明、使用用途、中文 alt 和权利备注。
   - 阻止带有官方 Logo、可识别官方角色、武器、地图地标、游戏截图、官方 UI 的图片。
   - 阻止冒充官方概念设计、官方宣传图或官方活动页视觉的图片，即使它是 AI 生成的。
8. Check community safety:
   - Block 低俗、歧视、攻击、引战、开盒、隐私泄露、网暴内容.
   - Jokes may target a game situation or fictional dish, not real people or vulnerable groups.
9. Classify each issue:
   - `blocking`: must fix before publish.
   - `needs-source`: source missing or weak.
   - `needs-permission`: authorization unclear.
   - `copy-edit`: wording risk but fixable.
10. Output a merge decision: `可合并`、`修改后合并`、`不得合并`. Any high-risk copyright or AI asset issue stays `blocking`.

## output_format

Use this report:

```markdown
## 版权与来源审核

- 审核对象:
- 结论: 可合并 / 修改后合并 / 不得合并
- 非官方声明: pass/fail
- 来源标注: pass/fail
- 图片授权: pass/fail/not-applicable
- AI/图片资产: pass/fail/not-applicable
- 社区安全: pass/fail

### 阻塞项

| 类型 | 位置 | 问题 | 必须修改 |
| --- | --- | --- | --- |
|  |  |  |  |

### 非阻塞建议

-

### 可接受的发布条件

-
```

## guardrails

- 高风险内容必须阻止发布，不用“建议补充”代替阻塞。
- 不替投稿者、原作者或官方权利人假定授权。
- 不用“来源见网络”代替具体来源。
- 不把未授权图片、截图或二创作品放入 GalleryItem。
- 不把 AI 图片写成官方概念设计、官方宣传图或官方活动视觉。
- 不接受缺少用途、alt、生成说明或权利备注的 AI 视觉资产登记。
- 不发布攻击现实个人、主播、玩家群体或角色玩家群体的内容。
- 不删除非官方声明。
- 遇到撤稿或权利人删除请求，优先下架相关内容并记录处理结果。
