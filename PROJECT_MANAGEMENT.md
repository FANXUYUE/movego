# Project Management

这份文档用于管理 MoveGo / 动动Go 的版本、分支、提交和发布节奏。

## 当前版本

- 当前版本：`1.0.0`
- 版本名称：V1 原型基线
- 版本日期：2026-05-10
- 当前形态：纯静态移动端风格 Web 原型

## Git 管理原则

### 分支策略

- `main`：稳定分支，只放可以演示或交付的版本。
- `codex-version-1-management`：本次版本管理文件分支。
- 后续功能分支建议格式：
  - `feature/adventure-page`
  - `feature/task-detail`
  - `feature/local-storage`
  - `fix/mobile-layout`
  - `docs/update-backlog`

如果当前环境不支持带 `/` 的分支名，可以改用：
- `feature-adventure-page`
- `feature-task-detail`
- `fix-mobile-layout`

### 提交规范

推荐使用简洁的 Conventional Commit 风格：

```text
feat: add adventure map
fix: prevent timer double completion
docs: update v1 roadmap
chore: tag v1 baseline
refactor: extract task completion action
style: polish mobile navigation
```

常用类型：
- `feat`：新增功能。
- `fix`：修复问题。
- `docs`：文档变更。
- `style`：样式调整，不改变业务逻辑。
- `refactor`：重构，不改变外部行为。
- `chore`：工具、配置、版本管理。
- `test`：测试或验收脚本。

### 版本规则

采用 `MAJOR.MINOR.PATCH`：

- `1.0.0`：当前静态原型基线。
- `1.1.0`：增加完整页面或核心模块，但仍兼容当前演示目标。
- `1.2.0`：增加 localStorage、完整状态流、Quest / League 联动等中型能力。
- `2.0.0`：完成 React 工程化重构，并进入真正 MVP Demo 架构。
- `x.y.1`：修复 bug、文字、样式、轻微交互问题。

版本发布时必须同步更新：
- `VERSION`
- `CHANGELOG.md`
- `README.md` 中的当前版本说明
- Git tag，例如 `v1.0.0`

## V1 基线说明

V1 是“产品概念原型”，重点不是完整技术架构，而是把 MoveGo 的核心感觉演示出来：

- 用户看到一个手机 App 风格界面。
- 用户能开始一个轻量运动 Quest。
- 页面能模拟运动识别和完成反馈。
- 完成后能看到能量、streak、小队状态变化。
- 页面表达了 AI 搭子、小队、徽章和洞察这些产品方向。

V1 不承担完整 PRD 的全部 MVP 功能。完整 MVP 的开发说明已经放在 Notion：

- PRD：<https://www.notion.so/35cebc76fe9c81c1a55ad11e28896474>
- Dev Backlog：<https://www.notion.so/35cebc76fe9c8140b13edc08feb05e83>
- 工程开发说明：<https://www.notion.so/35cebc76fe9c8169bfb3eb1e02d9722e>

## 推荐里程碑

### V1.0.0 - 当前原型基线

目标：保存当前静态原型，作为后续开发起点。

验收：
- 静态页面可打开。
- “开始”按钮可以跑完模拟打卡。
- README 能说明本地预览方式。

### V1.1.0 - 移动端结构补全

目标：从当前 4 个内页 Tab 扩展到 PRD 的 5 个底部 Tab + 头像入口。

建议任务：
- 底部导航：冒险、快练、Quest、锦标赛、社区。
- 头像入口：我的页。
- 移动端 App Shell 统一布局。

### V1.2.0 - 数据持久化与状态层

目标：用 localStorage 保存用户状态。

建议任务：
- 设计默认 demo state。
- 保存 XP、streak、当前关卡、Quest 进度、徽章、feed。
- 增加 reset demo 按钮。

### V1.3.0 - 任务详情闭环

目标：完成主线和快练共用任务详情页。

建议任务：
- 任务详情页模板。
- 计时器。
- 自评强度。
- 完成弹窗。
- 统一 `completeTask` 结算逻辑。

### V2.0.0 - React MVP Demo

目标：迁移到 React + Vite + Tailwind + shadcn/ui，按工程开发说明重构。

验收：
- 5 个主 Tab 完整。
- 冒险、快练、Quest、锦标赛、社区、我的页可访问。
- 完成任务后所有核心状态联动。
- 刷新后状态保留。

## 每次开发的标准流程

1. 确认要做的 task 编号和目标。
2. 从稳定分支创建新分支。
3. 开发期间保持小步提交。
4. 完成后本地预览并跑手动验收。
5. 更新 `CHANGELOG.md`。
6. 合并回稳定分支。
7. 如果是版本发布，更新 `VERSION` 并创建 Git tag。

## 发布检查清单

- [ ] 页面能本地打开。
- [ ] 关键交互可完成。
- [ ] 移动端宽度无横向滚动。
- [ ] README 的启动方式仍然正确。
- [ ] `VERSION` 已更新。
- [ ] `CHANGELOG.md` 已更新。
- [ ] 已创建对应 Git tag。
- [ ] 如果部署到线上，README 中的演示链接已更新。
