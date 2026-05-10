# MoveGo / 动动Go

动动Go 是一款面向大学生的 AI 游戏化运动工具原型。它不做专业健身训练，而是用冒险闯关、快练任务、Quest、锦标赛、社区动态和动动水豚的轻陪伴，帮助“想运动但坚持不下来”的学生从今天先动一下开始。

产品口号：今天不用很猛，动一下就算赢。

## 当前版本

版本：`1.3.0`

当前 Demo 已从早期概念页推进到移动端 App 风格闭环：

- 冒险：第 1 章主线地图、当前关卡卡片、milestone 提醒。
- 快练：肩颈放松、核心入门、饭后散步、晨间唤醒等 10 分钟轻任务。
- Quest：每日、每周、每月、小队 Quest 进度。
- 锦标赛：20 人分组排行、段位路径、晋级 / 保级 / 降级反馈。
- 社区：好友动态流、点赞、分享任务卡，动态头像使用动动水豚概念图。
- 我的：个人状态、徽章墙、运动回顾与动动建议。
- 任务详情：主线和快练共用详情页，包含演示区、动作步骤、计时器和完成入口。
- 完成奖励：统一结算 XP、streak、Quest、锦标赛 XP 和社区动态。
- 本地状态：使用 `localStorage` 保存演示进度，刷新后状态保留。

## 设计方向

目标用户是 18-24 岁大学生，尤其是低频新手和间歇运动者。产品设计遵循 PRD 中的几个原则：

- 低压力：任务以 5-15 分钟、宿舍 / 校园 / 饭后等真实场景为主。
- 即时反馈：完成一次运动后，多个激励系统同步更新。
- 轻社交：让用户被看见、被鼓励，但不制造强压力。
- 游戏化：使用 XP、streak、badge、league 和 milestone 形成持续动机。
- 吉祥物陪伴：动动是一只温和的运动搭子，不是监督型教练。

## 项目结构

当前为了方便检查和快速迭代，先保持轻量前端结构：

```text
index.html
styles.css
script.js
assets/
docs/notion/
```

工程化重构方向见 `docs/notion/engineering-guide.md`。后续如果进入完整 MVP，可迁移到 React + TypeScript + Vite + Zustand + React Router。

## 产品文档

- PRD：`docs/notion/product-prd.md`
- Dev Backlog：`docs/notion/dev-backlog.md`
- 工程开发说明：`docs/notion/engineering-guide.md`
- 动动吉祥物素材库：`assets/mascot/`
- 概念图：`assets/images/`

## 本地预览

```bash
python3 -m http.server 4181
```

打开：

```text
http://127.0.0.1:4181/index.html
```

也可以通过 query 直接预览某个模块：

```text
?view=adventure
?view=quick
?view=quest
?view=league
?view=community
?view=profile
?view=task
```

## 当前限制

- 仍是静态 Demo，没有真实后端、登录、好友关系或健康数据接入。
- 任务演示为原型动画和素材占位，不是真人视频。
- 评论、分享、排行榜等为本地模拟数据。
