# 站点体验 QA

运行以下命令可重放移动端关键交互验收：

```powershell
npm.cmd run qa:experience
```

命令会先执行生产构建，再启动本地 `astro preview`，使用机器现有 Chrome 或 Edge 的独立无头会话检查菜单焦点与关闭路径、地图主题交叉淡化与持久化、Astro 页面转场、隐藏主题 reveal、粗指针按压反馈、reduced-motion 回退及无脚本导航降级。

导航回归使用真实触屏事件点击首页“翻开菜单卷轴”，记录 `astro:after-swap` 和后续动画帧，检查主导航是否意外展开并遮挡页面。

## GitHub Pages 子路径

在新的 PowerShell 会话中运行：

```powershell
$env:BASE_PATH = '/naraka-restaurant'
npm.cmd run qa:experience
```

构建与预览必须使用相同 `BASE_PATH`。根路径检查则不设置该变量。

## 定向复测与线上复现

针对已经构建的本地产物，可省略重复构建：

```powershell
$env:BASE_PATH = '/naraka-restaurant'
$env:QA_CHECK = 'mobile-menu-navigation'
$env:QA_VIEWPORT_WIDTH = '390'
$env:QA_SCREENSHOT = '1'
node scripts/qa-site-experience.mjs
```

检查已部署页面时，使用独立会话设置目标 URL（含子路径），脚本不会启动本地预览：

```powershell
$env:QA_BASE_URL = 'https://flytoflame129.github.io/naraka-restaurant/'
$env:QA_CHECK = 'mobile-menu-navigation'
node scripts/qa-site-experience.mjs
```

`QA_CHECK` 只执行指定检查，不代表完整 QA。完整检查请在未设置 `QA_CHECK` 的会话中运行。`QA_VIEWPORT_WIDTH` 默认 375，适用于不超过 900px 的手机/平板导航；固定高度为 812。Chrome 默认模拟视口不等同于真实 iOS Safari 验收。

## 结果与仓库卫生

最近一次结构化结果写入 `.cache/qa/site-experience-latest.json`；`QA_SCREENSHOT=1` 时导航回归另保存 `.cache/qa/mobile-menu-navigation.png`。这些机器专属结果已被忽略，不提交到仓库；本目录仅维护可复现说明和经整理的结论。

旧的 `docs/qa/site-experience-latest.json` 已取消版本跟踪，本地副本可保留。`npm run validate:repository` 会拦截仍被跟踪且匹配仓库 `.gitignore` 的文件，但不扫描秘密内容，也不清理 Git 历史。
