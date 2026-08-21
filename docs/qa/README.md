# 站点体验 QA

运行以下命令可重放移动端关键交互验收：

```powershell
npm.cmd run qa:experience
```

命令会先执行生产构建，再启动本地 `astro preview`，使用机器现有 Chrome 或 Edge 的 DevTools 协议检查菜单焦点与关闭路径、地图主题交叉淡化与持久化、Astro 页面转场、隐藏主题 reveal、粗指针按压反馈和 reduced-motion 回退。

最近一次结构化结果写入 `docs/qa/site-experience-latest.json`。此目录只保存 JSON/Markdown 证据与重放命令，不提交易碎截图。
