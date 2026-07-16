# 贡献指南

感谢参与 NARAKA Restaurant。开始修改前请阅读 `AGENTS.md`、`docs/domain-model.md` 和 `docs/design-direction.md`。

## 开发流程

1. 使用 Node.js 24 和 npm 10 或更高版本。
2. 从 `main` 创建功能分支；Codex 分支使用 `codex/` 前缀。
3. 使用 `npm ci` 安装锁定版本依赖。
4. 保持单次 PR 目标明确，不把内容、视觉和无关重构混在一起。
5. 提交前运行：

```bash
npm run validate:content
npm run build
```

## 内容规则

- 不要无来源编造《永劫无间》机制、梗来源、传播范围或社区共识。
- 未确认的具体说法必须标注“待考证”，不得包装成官方设定。
- 幽默文案不得攻击现实个人、主播、玩家群体或角色玩家群体。
- 不得提交低俗、歧视、引战、隐私泄露、开盒或网暴内容。
- 不得上传官方 Logo、游戏截图、客户端提取素材、未授权二创或未授权社区作品。

## 正式虚拟菜单

正式菜单位于 `src/content/menu-items/`，同时用于菜单页、首页推荐和 `/menu/[slug]/` 详情页。新增或修改条目时必须维护：

- 基础字段：`title`、`slug`、`map`、`category`、`description`、`order`
- 详情字段：`dishIntro`、`dishSetting`、`playerComment`、`recommendedPairing`、`relatedElements`
- 图片字段：`image.src`、`image.alt`、`image.credit`、`image.license`

正式菜单是本站虚拟餐厅二创。涉及具体游戏机制、地点效果或玩家社区共识时，仍应使用可核验来源或收敛为明确的玩家联想。

新增图片时还必须同步更新：

- `docs/visual-asset-register.md`
- `docs/research/menu-image-review.md`

## 考据菜品档案

需要来源说明和考据状态的内容位于 `src/content/dishes/`。字段以 `src/content.config.ts` 为准，每条来源必须说明链接或无公开链接原因、平台、来源类型、支持的具体说法、可靠度、核查日期和备注。

只有同时满足 `publishStatus: published` 与 `status: verified` 的档案可以公开。字段缺失、来源不足、图片无授权说明或状态不合法时不得发布。

## 投稿方式

- 新菜品或来源线索：使用 `.github/ISSUE_TEMPLATE/dish-submission.yml` 创建 Issue。
- 直接修改代码或内容：提交 Pull Request。
- 撤稿或权益问题：在 Issue 中说明涉及内容、权利关系和处理诉求。

## PR 检查清单

- [ ] `npm run validate:content` 通过。
- [ ] `npm run build` 通过。
- [ ] 新增内部链接和图片路径在 GitHub Pages 子路径下可用。
- [ ] 图片包含中文替代文本、来源和授权说明。
- [ ] 具体来源能够支撑对应说法，来源不足处已标注“待考证”。
- [ ] 页面仍保留非官方声明，没有官方身份或真实售卖暗示。
