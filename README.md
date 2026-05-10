# MoveGo / 动动Go

面向大学生的 AI 运动搭子和游戏化运动激励工具原型。

## 当前版本

版本：`1.0.0`

- 今日 Quest：宿舍肩颈解锁、饭后校园散步等轻量任务。
- AI 搭子：根据疲劳状态给出低门槛运动建议。
- 室友小队：展示小队共同目标和成员打卡状态。
- 成就反馈：连续天数、能量值、徽章和周洞察。
- 可交互打卡：点击“开始”后会模拟运动识别、完成 Quest、更新能量和小队状态。

## 项目管理

- 版本号记录在 `VERSION`。
- 版本变更记录在 `CHANGELOG.md`。
- Git 分支、提交、版本发布规则见 `PROJECT_MANAGEMENT.md`。
- 当前版本建议打 tag：`v1.0.0`。

## 产品文档

- PRD：`docs/notion/product-prd.md`
- Dev Backlog：`docs/notion/dev-backlog.md`
- 工程开发说明：`docs/notion/engineering-guide.md`
- 视觉素材：`assets/images/`
- 动动吉祥物素材库：`assets/mascot/`

## 本地预览

```bash
python3 -m http.server 4173
```

打开：

```text
http://localhost:4173
```

## 交作业链接

当前项目是纯静态页面，适合部署到 NoCode、GitHub Pages、Netlify、Vercel 或任意静态站点平台。部署后提交平台生成的公开访问链接即可。后续只要继续更新本项目文件并重新部署，同一个作品链接就能持续迭代。
