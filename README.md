# NARAKA Restaurant

NARAKA Restaurant 是一个《永劫无间 / NARAKA: BLADEPOINT》玩家同好创作站，用“虚拟游戏主题餐厅”的形式整理玩家梗、下饭文案、来源记录和社区投稿。

本站不是官方网站，不销售真实餐品，也不提供官方资料库。所有未核验梗必须标注“待考证”。

## 技术栈

- Astro
- Markdown Content Collections
- 原生 CSS 与 CSS Variables
- GitHub Pages

## 本地运行

```bash
npm install
npm run dev
```

构建验证：

```bash
npm run build
```

单独检查菜品字段：

```bash
npm run validate:content
```

## 内容结构

菜品内容放在 `src/content/dishes/`。每个菜品 Markdown 必须包含：

- `title`
- `slug`
- `map`
- `category`
- `relatedCharacter`
- `relatedWeapon`
- `relatedOperation`
- `memeType`
- `credibility`
- `image`
- `tags`
- `sources`
- `status`
- `publishStatus`
- `curator`

`status` 表示来源核验状态，可用值：`verified`、`pending`、`mixed`、`rejected`。

`publishStatus` 表示是否进入公开页面，可用值：`draft`、`published`、`needs-review`。

没有可靠来源的内容只能使用 `pending` 或 `mixed`，并在页面可见位置写明“待考证”或“资料整理中”。`needs-review` 用于研究草稿，默认不进入公开页面列表。

## GitHub Pages 部署

1. 在 GitHub 仓库设置中进入 Pages。
2. Source 选择 GitHub Actions。
3. 合并到 `main` 后，`.github/workflows/deploy.yml` 会运行 `npm ci` 和 `npm run build`。
4. Workflow 会自动设置：
   - `SITE`
   - `BASE_PATH`
   - `PUBLIC_REPOSITORY_URL`

如果仓库发布分支不是 `main`，请同步修改 `.github/workflows/deploy.yml`。

## 非官方声明

本站为《永劫无间》玩家同好创作项目，非官方网站，与游戏官方无隶属关系。站内内容主要用于玩家交流、梗文化整理与非商业展示。若内容涉及权益问题，请联系维护者处理。
