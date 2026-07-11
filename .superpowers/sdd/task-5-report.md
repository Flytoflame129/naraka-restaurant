# Task 5 Report

工作目录：`D:\bliev\Documents\NARAKA Restaurant\.worktrees\ui-redesign`

## Skill 1: naraka-meme-research

- Baseline:
  - 输出只有来源表格，没有与菜品 schema 对齐的逐条 `sources` evidence 对象。
  - `supports` 没有被定义为“该来源具体证明什么”，官方机制、社区叫法、本站二创之间缺少分界。
  - skill 自带梗类型长枚举，和 `src/content.config.ts` 存在漂移风险。
- 修改:
  - workflow 首步改为读取 `AGENTS.md` 与 `src/content.config.ts`，把受控词汇和来源对象合同交还给实现真相。
  - output_format 改成卡片字段 + `sources` YAML 对象，补齐 `title`、`url` / `noPublicLinkReason`、`platform`、`sourceType`、`supports`、`reliability`、`checkedAt`、`notes`。
  - 补充 `可能原句`、`流行平台`、`证据摘要`、角色/武器/地图/操作拆分字段、`待人工确认点`，并明确官方/社区/本站二创不得混证。
- 验证命令 / 结果:
  - `rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/naraka-meme-research/SKILL.md`
    - 命中 `name`、`description` 和 4 个必需章节。
  - `git diff --check`
    - 首次发现 YAML 示例数组项尾随空格；修复后重跑，仅剩 Git 的 LF/CRLF 警告，无 diff 错误。
- 应用场景检查:
  - 场景：将 `docs/research/doujiang-huimian.md` 整理成可供菜品写作使用的梗资料卡。
  - 检查命令：`rg -n "豆浆烩面|可能原句|supports|sourceType|noPublicLinkReason|checkedAt|reliability|待人工确认点|流行平台" .codex/skills/naraka-meme-research/SKILL.md`
  - 结果：`可能原句`、`流行平台`、`sourceType`、`supports`、`noPublicLinkReason`、`reliability`、`checkedAt`、`待人工确认点` 均可直接检索到；说明代理能从 skill 里直接找到 required optimization 对应字段。
- Commit:
  - `docs(skills): align meme research evidence`
- 残余风险:
  - 该 skill 仍然依赖执行者真的去读取 `src/content.config.ts`；skill 本身不做自动提取。

## Skill 2: meme-to-dish-writer

- Baseline:
  - 只有“来源状态”，没有同时区分 `status` 与 `publishStatus`。
  - 没有逐条 `sources` 合同，也没有把来源事实和本站原创菜品化内容分开。
  - 输出结构没有对齐 `docs/dish-writing-template.md` 的七分区正文。
- 修改:
  - workflow 改为先读 `AGENTS.md`、`src/content.config.ts`、`docs/dish-writing-template.md`，并显式区分来源事实、本站二创和不可用内容。
  - 输出增加 `status` 与 `publishStatus`，并要求两者独立判断、不得互相替代。
  - output_format 改成“来源事实 + 七分区正文 + `sources` 合同 + 待考证说明 + 下一步交给 dish-schema-keeper”。
- 验证命令 / 结果:
  - `rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/meme-to-dish-writer/SKILL.md`
    - 命中 `name`、`description` 和 4 个必需章节。
  - `git diff --check`
    - 无 diff 错误；仅有 Git 的 LF/CRLF 警告。
- 应用场景检查:
  - 场景：把 `docs/research/doujiang-huimian.md` 改写成一份仍需审核的菜品草稿。
  - 检查命令：`rg -n "status: verified|publishStatus: draft|资料整理中|待考证|sources:|dish-schema-keeper|本站二创|来源事实" .codex/skills/meme-to-dish-writer/SKILL.md`
  - 结果：`status`、`publishStatus`、`资料整理中` / `待考证`、逐条 `sources` 合同、`来源事实`、`本站二创` 和移交 `dish-schema-keeper` 的要求都能直接检索到。
- Commit:
  - `docs(skills): separate dish facts and fan copy`
- 残余风险:
  - skill 只要求交接给 `dish-schema-keeper`，不会在这里自动补齐全部 dish frontmatter 字段。

## Skill 3: dish-schema-keeper

- Baseline:
  - skill 自己复制了大量字段和枚举，和 `src/content.config.ts`、`scripts/validate-content.mjs` 有漂移风险。
  - 没有把“先读实现再检查”的顺序写成硬约束。
  - 输出表格是手写字段清单，不符合“动态提取当前实现”的要求。
- 修改:
  - workflow 第一步改成读取并解析 `src/content.config.ts` 与 `scripts/validate-content.mjs`，并明确它们是字段与发布门的真相。
  - 把长枚举从 skill 主体删掉，保留必须的人类判断规则：逐条 `sources` 检查、verified 不得依赖 low、pending/mixed 不得伪装发布。
  - output_format 改成“动态字段检查 + 来源逐条检查 + 阻塞项 + 建议修改”。
- 验证命令 / 结果:
  - `rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/dish-schema-keeper/SKILL.md`
    - 命中 `name`、`description` 和 4 个必需章节。
  - `git diff --check`
    - 无 diff 错误；仅有 Git 的 LF/CRLF 警告。
- 应用场景检查:
  - 场景：审核任意 dish frontmatter 时，不再依赖 skill 内置字段表，而是先读 `src/content.config.ts` 与 `scripts/validate-content.mjs`。
  - 检查命令：`rg -n "src/content.config.ts|scripts/validate-content.mjs|sourceType|supports|reliability|checkedAt|动态字段|verified.*low|mixed|待考证" .codex/skills/dish-schema-keeper/SKILL.md`
  - 结果：实现真相入口、`sources` 逐条字段、`verified` 不能依赖 low、`mixed` / `待考证` 伪装发布阻断、动态字段检查占位都能直接检索到。
- Commit:
  - `docs(skills): make schema implementation authoritative`
- 残余风险:
  - 如果执行者不真的解析实现文件，仍可能只做表面字段检查；skill 只能把这个顺序要求写死。

## Skill 4: copyright-source-review

- Baseline:
  - 没有把 `docs/visual-asset-register.md` 纳入审核入口。
  - 没有单列 AI / 图片资产检查项，也没有明确阻止“看起来像官方概念图”的 AI 图片。
  - 虽然有来源审核，但官方来源、社区来源、本站二创之间的句子级边界还不够明确。
- 修改:
  - workflow 加入读取 `AGENTS.md` 与 `docs/visual-asset-register.md`。
  - 新增“来源 - 结论对应”逐句审核和 AI / 图片资产检查，覆盖用途、alt、生成说明、权利备注以及官方视觉相似性阻断。
  - output_format 增加 `AI/图片资产` 检查项，并把高风险 AI / 版权问题明确为 blocking。
- 验证命令 / 结果:
  - `rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/copyright-source-review/SKILL.md`
    - 命中 `name`、`description` 和 4 个必需章节。
  - `git diff --check`
    - 无 diff 错误；仅有 Git 的 LF/CRLF 警告。
- 应用场景检查:
  - 场景：审核 `docs/visual-asset-register.md` 中登记的 Hero 与三张主题图是否适合公开站点使用。
  - 检查命令：`rg -n "visual-asset-register|AI / 图片资产|官方 Logo|官方概念设计|本站二创|来源 - 结论|alt|生成说明|权利备注" .codex/skills/copyright-source-review/SKILL.md`
  - 结果：视觉资产登记入口、AI 资产字段、官方视觉相似性阻断、本站二创与来源原文分离要求都能直接检索到。
- Commit:
  - `docs(skills): review generated visual assets`
- 残余风险:
  - “视觉相似性”仍然需要人工判断，skill 只能要求比较和阻断，不能自动量化。

## Skill 5: astro-site-builder

- Baseline:
  - 没有要求视觉任务先读 `docs/design-direction.md` 或调用 `ui-ux-pro-max`。
  - 没有写明复用 `mapThemes`、`sitePath()`、Content Collections。
  - 完成门缺少 375 / 768 / 1440、键盘焦点、44px、文字溢出、三主题差异和 reduced-motion。
- 修改:
  - workflow 增加架构文档读取顺序，以及视觉任务调用 `ui-ux-pro-max`、但项目设计和版权边界优先的规则。
  - 明确要求复用 `mapThemes`、`sitePath()`、Content Collections，不得硬编码内容。
  - 补上视口、键盘可访问性、44px、文字溢出、三主题差异、reduced-motion、`npm run build` 完成门。
- 验证命令 / 结果:
  - `rg -n "^name:|^description:|^## when_to_use|^## workflow|^## output_format|^## guardrails" .codex/skills/astro-site-builder/SKILL.md`
    - 命中 `name`、`description` 和 4 个必需章节。
  - `git diff --check`
    - 无 diff 错误；仅有 Git 的 LF/CRLF 警告。
- 应用场景检查:
  - 场景：实现首页 / 菜单页 UI 重做时，需要先对齐设计方向，再验证三主题和多视口完成门。
  - 检查命令：`rg -n "docs/design-direction.md|ui-ux-pro-max|mapThemes|sitePath\\(\\)|Content Collections|375px|768px|1440px|44px|reduced-motion|npm run build" .codex/skills/astro-site-builder/SKILL.md`
  - 结果：设计文档、`ui-ux-pro-max`、现有数据接口复用、375 / 768 / 1440、44px、reduced-motion 和 build 门都能直接检索到。
- Commit:
  - `docs(skills): add visual design workflow`
- 残余风险:
  - `ui-ux-pro-max` 是建议来源，不会自动保证实现正确；最终仍依赖实际页面验证。

## Skill 6: deploy-quality-check

- Baseline:
  - 待填写
- 修改:
  - 待填写
- 验证命令 / 结果:
  - 待填写
- 应用场景检查:
  - 待填写
- Commit:
  - 待填写
- 残余风险:
  - 待填写
