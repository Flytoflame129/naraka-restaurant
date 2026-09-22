# NARAKA Restaurant · 无间食肆

一个《永劫无间 / NARAKA: BLADEPOINT》玩家同好创作站，以“虚拟游戏主题餐厅”的形式呈现原创菜单、来源档案和社区投稿入口。视觉采用暗色武侠与东方幻想风格，支持聚窟洲、火罗国、龙隐洞天三个地图主题。

**本站为非官方玩家同好创作项目，不销售真实餐品，不代表游戏官方立场。未经核验的具体说法不得写成已确认事实。**

[站点地址](https://flytoflame129.github.io/naraka-restaurant/) · [菜品投稿](https://github.com/Flytoflame129/naraka-restaurant/issues/new?template=dish-submission.yml) · [问题反馈](https://github.com/Flytoflame129/naraka-restaurant/issues) · [贡献指南](CONTRIBUTING.md)

## 项目现状

目前是 **Astro 静态内容网站**：内容由仓库中的 Markdown 和 TypeScript 数据维护，构建后发布静态 HTML、CSS、JavaScript 与图片。Node.js 用于开发、构建和验证，当前没有常驻业务后端或数据库。

截至 2026-09-21 的内容快照：

| 内容 | 当前状态 |
| --- | --- |
| 虚拟菜单 | 15 道：聚窟洲 8 道、火罗国 4 道、龙隐洞天 3 道，均有详情页内容和图片说明 |
| 考据菜品档案 | 6 条，其中 1 条已核验且已发布，5 条待审核 |
| 社区画廊 | 已有页面和空状态，尚无作品数据 |
| 投稿 | GitHub Issue Form 与 Pull Request 协作，不是站内投稿系统 |
| 全栈扩展 | ASP.NET Core、EF Core、SQL Server 和管理后台处于方案讨论阶段，尚未实现 |

虚拟菜单属于本站二创，不等同于 15 条已经核实的玩家梗。当前菜单条目与考据档案分别维护。

## 已实现功能

| 模块 | 能力 |
| --- | --- |
| 首页 | 地图主题介绍、菜单与投稿入口、每个地图一道“今日三席推荐”；按访客本地日期在页面加载时轮换，同日选择稳定 |
| 菜单与详情 | 三地图主题切换、菜品排序与数量展示、独立详情页、菜品介绍与推荐搭配 |
| 来源档案 | 来源说明、核验状态、图片权利说明；只公开符合发布条件的档案 |
| 主题 | 地图主题与明暗模式切换；地图选择通过浏览器本地存储保留 |
| 动效 | Astro 页面转场、加载指示器、主题交叉淡化、Hero 雾层与扫光、滚动入场、触屏按压反馈 |
| 移动导航 | 抽屉菜单、关闭按钮、遮罩及 Escape 关闭、焦点恢复 |
| 基础可访问性 | 跳过导航、焦点样式、交互状态属性、减少动态效果偏好支持与无脚本降级 |
| SEO | 页面标题与描述、canonical、社交分享信息、sitemap.xml、robots.txt |
| 协作与验证 | 内容校验、体验静态检查、可重放浏览器 QA、PR 构建与 GitHub Pages 发布配置 |

**尚未提供：** 关键词搜索、类别筛选、站内登录、在线编辑与审核后台、图片上传、数据库、订单或支付。主题偏好不是跨设备账号同步，日期推荐也不是个性化推荐服务。

以上为代码实现范围，不代表所有设备、浏览器和线上环境已经完成验收。

## 技术栈与架构

| 层面 | 当前使用 |
| --- | --- |
| 框架 | Astro 7；依赖声明为 `^7.0.6`，当前锁文件为 `7.1.3` |
| 语言 | Astro 模板、TypeScript、JavaScript |
| 渲染 | `output: "static"`，构建时生成静态页面 |
| 内容 | Markdown + Astro Content Collections + Zod Schema |
| 样式与交互 | 原生 CSS、CSS 变量、DOM API、Astro ClientRouter |
| 辅助依赖 | `astro-loading-indicator`、`astro-theme-toggle`、`astro-vtbot` |
| 图片 | `astro:assets`，部分图片输出 AVIF / WebP |
| 工具链 | Node.js ≥24、npm ≥10、npm 锁文件 |
| 发布 | GitHub Actions + GitHub Pages |

```text
Markdown 菜单 / 考据档案 + TypeScript 主题数据
                         ↓
              内容校验 + Content Collections
                         ↓
              Astro 页面、组件与统一布局
                         ↓
              dist/ 静态产物 → GitHub Pages

浏览器端 JavaScript：主题、移动导航、推荐轮换与动效
```

页面组件消费内容数据；来源与发布规则由 [内容 Schema](src/content.config.ts)、[内容校验脚本](scripts/validate-content.mjs) 和公开状态过滤共同约束。

## 本地开发

### 环境要求

- Node.js 24 或更高版本；CI 固定使用 Node.js 24。
- npm 10 或更高版本。
- Git。
- 浏览器体验 QA 额外需要本机 Chrome 或 Edge；普通构建不依赖浏览器。

### 安装与启动

```bash
git clone https://github.com/Flytoflame129/naraka-restaurant.git
cd naraka-restaurant
npm ci
npm run dev
```

开发服务默认地址为 `http://localhost:4321/`，实际地址和端口以终端输出为准。

Windows PowerShell 如果阻止执行 `npm.ps1`，使用 `npm.cmd`，例如：

```powershell
npm.cmd ci
npm.cmd run dev
```

### 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务 |
| `npm run validate:repository` | 检查 Git 是否误跟踪了仓库忽略规则中的本地文件 |
| `npm run validate:content` | 校验菜单、考据档案及相关内容规则 |
| `npm run validate:experience` | 静态检查导航、动效与降级约定；不能代替浏览器验收 |
| `npm run build` | 依次运行仓库卫生检查、内容校验、体验静态检查、Astro 静态构建 |
| `npm run preview` | 预览已有的 `dist/`，需要先运行构建 |
| `npm run qa:experience` | 先构建，再启动预览并执行浏览器体验检查 |

```bash
npm run build
npm run preview
```

`preview` 用于本地检查，不作为云服务器生产部署方案。

### 浏览器体验检查

```powershell
npm.cmd run qa:experience
```

当前脚本先尝试 `CHROME_PATH` 指定的浏览器可执行文件，未指定或该路径不可用时，再尝试 Windows 常见 Chrome / Edge 安装路径。脚本当前主要面向 Windows 本地检查，其他运行环境需要确认浏览器路径和启动条件。

检查内容包括移动端布局与点击目标、“翻开菜单卷轴”后逐帧导航遮挡回归、菜单关闭及焦点恢复、地图主题切换与持久化、页面转场、内容入场、触屏反馈、减少动态效果、无脚本导航降级和浏览器错误。

当前默认视口为 `375 × 812`，可通过 `QA_VIEWPORT_WIDTH` 指定其他手机或平板宽度（不超过 900px）。脚本支持与构建一致的 `BASE_PATH`，也可通过 `QA_BASE_URL` 检查已部署站点。不同设备及跨浏览器仍需单独验收，命令示例见 [体验 QA 文档](docs/qa/README.md)。

结果会覆盖写入本地 `.cache/qa/site-experience-latest.json`，不提交到 Git。判断结果时需同时查看记录的 `generatedAt`、视口、目标地址和检查范围；历史通过不代表当前线上状态，也不代表完整的跨浏览器测试。

## 项目结构

```text
src/
  assets/               由 astro:assets 处理的本地图片
  components/           导航、卡片、主题切换和来源等组件
  content/menu-items/   虚拟菜单及详情内容
  content/dishes/       带来源、可信度和发布状态的考据档案
  content.config.ts     内容字段与状态约束
  data/                 地图主题与画廊数据
  layouts/              全站布局、元信息与脚本入口
  lib/                  路径、图片映射和公共内容规则
  pages/                页面路由、站点地图与 robots.txt
  scripts/              移动导航与动效控制器
  styles/               全站 CSS
public/assets/          直接复制到产物的静态资源
scripts/                内容校验、体验静态检查与浏览器 QA
docs/                   产品、领域、设计、研究与 QA 文档
.codex/skills/          项目专用 Codex 工作流
.github/                投稿模板、PR 模板与自动化工作流
```

## 内容规则与维护方式

### 虚拟菜单

[src/content/menu-items/](src/content/menu-items/) 是虚拟菜单的数据源，同时驱动菜单卡片、首页推荐和 `/menu/[slug]/` 详情页。条目包含介绍、设定、席间趣评、推荐搭配、相关元素和图片说明。

新增条目需维护 Schema 所要求的字段。图片还需同步登记 [视觉资产表](docs/visual-asset-register.md) 和 [菜单图片审查记录](docs/research/menu-image-review.md)。

### 考据菜品档案

[src/content/dishes/](src/content/dishes/) 保存需要来源证据的档案。只有同时满足以下两个条件的档案才生成 `/dishes/[slug]/` 公开页面：

```yaml
status: verified
publishStatus: published
```

`status` 描述内容核验状态，`publishStatus` 描述发布状态，两者不能混用。来源不足时根据实际情况使用 `pending` 或 `mixed`，发布状态保留为 `draft` 或 `needs-review`，并注明“待考证”。

来源应说明标题、链接或无公开链接原因、平台、支持的具体说法、可靠度、核查日期和备注。字段校验不能代替维护者对来源真实性及图片授权的人工审查。

### 社区画廊与投稿

当前画廊数据为空。正式作品上线前需记录作者、来源、授权范围和撤稿联系方式，不能用未经授权的图片填充占位内容。

- 新菜品或来源线索：使用 [GitHub Issue Form](https://github.com/Flytoflame129/naraka-restaurant/issues/new?template=dish-submission.yml)。
- 代码或内容修改：提交 Pull Request。
- 撤稿与权益问题：通过 [Issue](https://github.com/Flytoflame129/naraka-restaurant/issues) 提供涉及页面、权利关系与处理诉求；不要公开身份证件、私人联系方式或其他敏感材料。

## GitHub 协作与发布

1. 从最新 `main` 创建独立分支，Codex 分支使用 `codex/` 前缀。
2. 保持单次变更目标明确，避免混入无关代码和素材。
3. 提交前运行 `npm run validate:content`、`npm run build` 和 `git diff --check`；交互变更另运行 `npm run qa:experience`。
4. 提交 PR，完成内容、来源和图片授权检查。
5. 审查通过后合并；发布结果以 GitHub Actions 和线上检查为准。

详细规则见 [CONTRIBUTING.md](CONTRIBUTING.md) 和 [AGENTS.md](AGENTS.md)。

本地依赖、构建产物、缓存、内部任务报告及机器专属 QA 输出通过 `.gitignore` 排除。`npm run validate:repository` 已接入构建，防止被忽略的文件再次误入 Git；`.gitignore` 不会自动解除已跟踪文件，清理时应针对已确认路径使用 `git rm --cached`，保留本地副本。该检查不是密钥扫描，也不会改写历史提交。项目规范、内容来源文档及 `.codex/skills/` 是有意维护的源文件，不作为缓存删除。

### GitHub Pages

仓库的 **Settings → Pages → Source** 需要设置为 **GitHub Actions**。

- [ci.yml](.github/workflows/ci.yml)：PR 或手动触发，安装依赖并执行 `npm run build`。
- [deploy.yml](.github/workflows/deploy.yml)：推送到 `main` 或手动触发，构建并发布 `dist/`。
- 当前 CI 包含仓库卫生、内容和体验静态检查，**没有自动执行浏览器 QA**。

工作流会设置以下环境变量：

| 变量 | 用途 | 当前仓库发布值 |
| --- | --- | --- |
| `SITE` | 站点来源地址，用于 canonical 和 sitemap 等 | `https://Flytoflame129.github.io` |
| `BASE_PATH` | 部署子路径；本地默认 `/` | `/naraka-restaurant` |
| `PUBLIC_REPOSITORY_URL` | 投稿与仓库链接 | `https://github.com/Flytoflame129/naraka-restaurant` |

配置见 [astro.config.mjs](astro.config.mjs)。迁移到自定义域名或其他路径时，要同步检查导航、图片、canonical、sitemap 与投稿链接；不要直接把本地根路径构建当作 GitHub Pages 子路径产物。

## 后续方向：尚未实现

目前讨论过的扩展方向是保留 Astro 前台，增加 ASP.NET Core Web API、EF Core 与 SQL Server；管理后台可采用 Razor Pages。**这只是候选方案，不是当前运行架构，也不表示后端选型已经最终确认。**

建议按可独立验收的阶段推进：

- [ ] 明确菜单与考据档案的数据模型、审核规则和权限边界。
- [ ] 增加 SQL Server 数据层与只读 API，验证内容迁移及旧网址兼容。
- [ ] 接入前台数据读取，保留现有样式和交互。
- [ ] 增加维护者登录、草稿编辑、内容版本、审核、发布与撤稿。
- [ ] 增加受控图片上传、对象存储及授权管理。
- [ ] 建立云服务器部署、HTTPS、备份恢复、日志与自动化测试。
- [ ] 管理流程稳定后，再开放站内玩家投稿和画廊管理。

后端启用后需要单独设计运行环境和部署流程；当前 GitHub Pages 工作流只发布静态产物，不承载数据库或 ASP.NET Core 服务。现有静态阶段文档可能保留历史目标，实施前应同步更新设计与验收标准。

## 项目文档

- [项目上下文](CONTEXT.md)
- [产品需求](docs/PRD.md)
- [领域模型](docs/domain-model.md)
- [视觉方向](docs/design-direction.md)
- [技术决策](docs/tech-decision.md)
- [静态阶段路线图](docs/roadmap.md)
- [视觉资产登记](docs/visual-asset-register.md)
- [体验 QA](docs/qa/README.md)

## 非官方与版权声明

本站为《永劫无间》玩家同好创作项目，非官方网站，与游戏官方无隶属关系。站内内容主要用于玩家交流、文化整理与非商业展示，不构成真实商品售卖。

《永劫无间 / NARAKA: BLADEPOINT》相关名称、商标、角色、设定和素材版权归其相应权利人所有。不得使用官方 Logo、游戏截图、客户端提取素材或未获授权的社区作品。AI 辅助图片必须保留来源及使用说明，不能仅因“AI 生成”就视为已完成权利审查。

各素材的使用范围以对应记录为准，非官方或非商业声明不替代授权。权利人或作者提出删除请求时，应优先下架相关内容并记录处理结果。
