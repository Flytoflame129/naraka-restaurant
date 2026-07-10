# 贡献指南

感谢参与 NARAKA Restaurant。请先阅读 `AGENTS.md`、`docs/PRD.md` 和 `docs/domain-model.md`。

## 内容规则

- 不要无来源编造《永劫无间》梗。
- 未确认来源的具体梗必须标注“待考证”。
- 不得攻击现实个人、主播、玩家群体或角色玩家群体。
- 不得提交低俗、歧视、引战、隐私泄露、开盒或网暴内容。
- 不得上传未授权图片、游戏客户端提取素材或未授权二创作品。

## 投稿方式

- 新菜品或来源线索：使用 `.github/ISSUE_TEMPLATE/dish-submission.yml` 创建 Issue。
- 直接修改内容：提交 Pull Request。
- 撤稿或权益问题：在 Issue 中说明涉及内容、权利关系和处理诉求。

## 菜品 Markdown 要求

菜品文件位于 `src/content/dishes/`。发布前必须通过：

```bash
npm run validate:content
npm run build
```

字段缺失、来源为空、状态不合法或图片无授权说明时，不得直接发布。

## PR 检查清单

- [ ] 页面仍能看到非官方声明或链接到关于页。
- [ ] 所有具体梗都有来源链接或“待考证”标注。
- [ ] 图片有作者、来源或授权说明。
- [ ] 没有真实售卖、下单、支付或官方身份暗示。
- [ ] `npm run build` 通过。
