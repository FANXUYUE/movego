# 工程开发说明

<aside>
🧭

这份说明面向实际开发。它不是新的 PRD，而是把 MoveGo MVP 转成工程实现约束：技术栈、目录结构、数据模型、状态更新流、页面组件边界、开发顺序和验收路径。开发时先读本页，再按 Dev Backlog 的 task 编号推进。

</aside>

## 1. 工程目标

第一版要做的是**手机 App 风格 Web Demo**，不是完整原生 App。目标不是堆功能，而是跑通一个可信、可演示、可扩展的产品闭环。

核心闭环：

1. 用户进入冒险页或快练页。
2. 用户选择一个运动任务。
3. 进入任务详情页，查看演示、步骤、计时器。
4. 用户完成任务。
5. 系统统一结算：XP、streak、Quest、League、badge、feed。
6. 冒险地图、Quest、锦标赛、社区、我的页全部同步更新。
7. 刷新页面后状态仍然保留。

MVP 的判断标准：用户在手机尺寸下能清楚理解“我今天动了一下，并且产品所有激励系统都对这一下有反馈”。

## 2. 技术栈决策

推荐技术栈：

- React + TypeScript + Vite：前端基础。
- Tailwind CSS：快速完成移动端视觉。
- shadcn/ui：Dialog、Progress、Tabs、Toast、Button、Card 等基础组件。
- lucide-react：底部导航、操作按钮和状态图标。
- Zustand：全局状态管理，推荐使用 persist 中间件或手写 localStorage adapter。
- React Router：页面路由。
- date-fns：日期、周/月统计、streak 计算。

暂不接入：

- 后端数据库。
- 登录鉴权。
- OpenAI API。
- 手机健康数据、GPS、手环。
- 视频上传、图片上传、真实好友关系、真实评论。

选择 Zustand 的原因：本项目状态跨页面联动明显，Context + useReducer 可以做，但完成任务后的状态更新会很快变成多层传参。Zustand 更适合 Demo 阶段快速组织业务状态，同时迁移到后端时也容易替换 action 内部实现。

## 3. 推荐目录结构

```
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  components/
    ui/
    layout/
      MobileShell.tsx
      TopBar.tsx
      BottomNav.tsx
    shared/
      MascotAvatar.tsx
      StatPill.tsx
      RewardBadge.tsx
      EmptyState.tsx
      ProgressRing.tsx
  data/
    adventureLevels.ts
    quickMoves.ts
    quests.ts
    badges.ts
    leagues.ts
    communitySeeds.ts
    copywriting.ts
  features/
    adventure/
      AdventurePage.tsx
      UserStatusCard.tsx
      AdventureMap.tsx
      CurrentLevelCard.tsx
      MilestoneHint.tsx
    quick-move/
      QuickMovePage.tsx
      RecommendedMoveCard.tsx
      QuickMoveGrid.tsx
      RecentMoves.tsx
    task-detail/
      TaskDetailPage.tsx
      TaskHero.tsx
      MotionPreview.tsx
      StepList.tsx
      TaskTimer.tsx
      IntensityPicker.tsx
      CompletionDialog.tsx
    quest/
      QuestPage.tsx
      DailyQuestSection.tsx
      WeeklyQuestSection.tsx
      MonthlyQuestSection.tsx
      TeamQuestSection.tsx
    league/
      LeaguePage.tsx
      LeagueHeader.tsx
      LeaguePath.tsx
      RankingList.tsx
    community/
      CommunityPage.tsx
      FeedCard.tsx
      FeedActions.tsx
    profile/
      ProfilePage.tsx
      ProfileHeader.tsx
      GrowthPanel.tsx
      BadgeWall.tsx
      FriendList.tsx
      ActivityReview.tsx
    onboarding/
      OnboardingPage.tsx
      PreferenceQuestion.tsx
  store/
    appStore.ts
    actions/
      completeTask.ts
      updateQuestProgress.ts
      updateLeague.ts
      unlockBadges.ts
      generateFeed.ts
    selectors.ts
  types/
    domain.ts
  utils/
    date.ts
    xp.ts
    storage.ts
    seed.ts
```

目录原则：

- `data/` 只放静态配置，不放运行时状态。
- `store/` 放运行时状态和业务 action。
- `features/` 按页面/业务域拆组件。
- `components/shared/` 放跨业务复用组件。
- 页面组件只负责组装，不直接写复杂结算逻辑。

## 4. 路由设计

```
/                      -> redirect /adventure
/adventure             -> 冒险页
/quick                 -> 快练页
/quest                 -> Quest 页
/league                -> 锦标赛页
/community             -> 社区页
/profile               -> 我的页
/task/:taskId          -> 任务详情页，主线和快练共用
/onboarding            -> 入岛测试，可 P1 实现
```

路由行为：

- 底部 5 Tab 对应 `/adventure`、`/quick`、`/quest`、`/league`、`/community`。
- 头像入口进入 `/profile`，不占底部 Tab。
- `/task/:taskId` 根据 taskId 在主线任务和快练任务里查找。
- 任务详情页要记录来源页，可用 `location.state.from` 或 query 参数，如 `/task/a-1-1?from=adventure`。

## 5. 核心类型设计

```tsx
type TaskKind = 'adventure' | 'quick';
type TaskCategory = 'walk' | 'stretch' | 'core' | 'wake' | 'recovery' | 'milestone';
type Difficulty = 'easy' | 'normal' | 'challenge';

type TaskStep = {
  id: string;
  title: string;
  durationSec: number;
  instruction: string;
  safetyTip?: string;
};

type MoveTask = {
  id: string;
  kind: TaskKind;
  levelCode?: string;
  title: string;
  category: TaskCategory;
  durationMin: number;
  baseXp: number;
  difficulty: Difficulty;
  goal: string;
  scene: string;
  assetKey: string;
  steps: TaskStep[];
  isMilestone?: boolean;
};

type UserState = {
  id: 'demo-user';
  name: string;
  avatarKey: string;
  level: number;
  totalXp: number;
  moveCoins: number;
  streak: number;
  lastCompletedDate?: string;
  currentAdventureTaskId: string;
  completedTaskIds: string[];
  unlockedBadgeIds: string[];
  preferences?: UserPreferences;
};

type CompletionRecord = {
  id: string;
  taskId: string;
  completedAt: string;
  durationSec: number;
  intensity: 'easy' | 'just-right' | 'tired';
  baseXp: number;
  personalXpAwarded: number;
  leagueXpAwarded: number;
  source: TaskKind;
};
```

类型原则：

- task 配置和完成记录分开。任务定义是静态的，完成记录是用户行为。
- personal XP 和 league XP 分开。个人成长可以给完整奖励，锦标赛要受上限和衰减规则限制。
- 当前主线关卡用 `currentAdventureTaskId`，不要只用数字 index，后续方便插入关卡。

## 6. AppState 设计

```tsx
type AppState = {
  schemaVersion: 1;
  user: UserState;
  completions: CompletionRecord[];
  quests: QuestRuntimeState;
  league: LeagueRuntimeState;
  feed: FeedItem[];
  ui: {
    hasSeenOnboarding: boolean;
    lastActiveTab: string;
  };
};
```

store 必须提供这些 action：

- `completeTask(input)`：完成任务唯一入口。
- `resetDemo()`：重置演示数据。
- `seedDemoProgress()`：填充演示进度。
- `likeFeedItem(feedId)`：社区点赞。
- `savePreferences(preferences)`：保存入岛测试。

store 必须提供这些 selector：

- `selectCurrentAdventureTask()`
- `selectTaskById(taskId)`
- `selectTodayCompletions()`
- `selectQuestProgress()`
- `selectLeagueRanking()`
- `selectUnlockedBadges()`
- `selectWeeklyStats()`

## 7. localStorage 设计

storage key：

```tsx
const STORAGE_KEY = 'movego:mvp:v1';
```

保存策略：

- 每次 action 更新后自动保存。
- 初始化时读取 localStorage，如果没有则使用默认 demo state。
- 如果 JSON parse 失败，保留错误提示并回退默认数据。
- 如果 `schemaVersion` 不匹配，走 migration。

默认状态必须包含：

- demo 用户 Lina。
- 当前主线关卡 1-1。
- 0 XP、0 streak、默认段位青铜行动者。
- 20 人锦标赛假数据。
- 5 到 10 条社区种子动态。
- Quest 初始进度。

## 8. 完成任务的统一结算流

所有完成任务的入口都必须调用同一个 action。不要在任务详情页、冒险页、快练页分别写奖励逻辑。

```tsx
function completeTask(input: {
  taskId: string;
  durationSec: number;
  intensity: CompletionRecord['intensity'];
}) {
  const task = findTask(input.taskId);
  const now = new Date();

  const personalXp = calculatePersonalXp(task);
  const leagueXp = calculateLeagueXp(task, state.completions, now);
  const nextStreak = calculateStreak(state.user.lastCompletedDate, now);

  const completion = createCompletionRecord(task, input, personalXp, leagueXp, now);

  state.completions.push(completion);
  state.user.totalXp += personalXp;
  state.user.streak = nextStreak;
  state.user.lastCompletedDate = toDateKey(now);

  if (task.kind === 'adventure') {
    state.user.currentAdventureTaskId = getNextAdventureTaskId(task.id);
  }

  updateQuestProgress(state, completion);
  updateLeague(state, completion);
  unlockBadges(state, completion);
  generateCompletionFeed(state, completion);
  persist(state);
}
```

结算顺序不能乱：

1. 先创建完成记录。
2. 再更新用户 XP / streak / 主线进度。
3. 再更新 Quest。
4. 再更新 League。
5. 再解锁徽章。
6. 最后生成社区动态。

原因：后面的模块需要依赖前面已经更新好的状态，例如徽章可能依赖连续天数，社区动态可能需要知道是否刚解锁了徽章。

## 9. XP 与防刷规则

个人 XP：

- 首次完成任务：获得 `task.baseXp`。
- 重复完成任务：个人 XP 仍可获得，但可以显示为“练习奖励”。
- MVP 阶段个人 XP 不做过重限制，避免用户演示时觉得没反馈。

锦标赛 XP：

- 每日计入上限：建议 150 XP。
- 同一天重复完成同一快练：第一次 100%，第二次 50%，第三次及以后 20%。
- 小队 Quest 奖励只部分计入 League，建议 30%。
- 任务打开少于 10 秒直接完成：个人 XP 可给少量，League XP 记 0，防止演示里误刷。

实现建议：

```tsx
function calculateLeagueXp(task, completions, now) {
  const todayLeagueXp = getTodayLeagueXp(completions, now);
  const remainingCap = Math.max(0, 150 - todayLeagueXp);
  const decay = getRepeatDecay(task.id, completions, now);
  return Math.min(Math.round(task.baseXp * decay), remainingCap);
}
```

## 10. streak 规则

MVP 规则：

- 每个自然日完成至少 1 个健康任务，streak +1。
- 同一天多次完成任务，streak 不重复增加。
- 昨天完成过，今天第一次完成：streak +1。
- 今天已经完成过，再完成：streak 不变。
- 中断超过 1 天：streak 重置为 1。

暂不实现：

- Streak Shield。
- Recovery Day 真实结算。
- 考试周模式。

页面展示可以提前预留入口，但逻辑先不做。

## 11. Quest 进度规则

Quest 类型：

- Daily：每天重置，三档任务。
- Weekly：每周重置，按自然周统计。
- Monthly：每月重置。
- Team：MVP 用模拟小队，不做真实多人同步。

Quest runtime state 推荐：

```tsx
type QuestProgress = {
  questId: string;
  periodKey: string;
  current: number;
  target: number;
  completed: boolean;
  rewardClaimed: boolean;
};
```

Quest 更新时只根据 completion 派生，不让页面手动改进度。

示例映射：

- 完成任意任务：Daily 第一档 +1，Monthly +1。
- 完成 adventure：Daily 第二档可能完成，Adventure 周 Quest +1。
- 完成 quick 且 durationMin >= 10：Daily 第二档可能完成，Weekly 快练 Quest +1。
- 完成任意任务：Team Quest 个人贡献 +1，但受个人贡献上限限制。

奖励结算：

- Quest 首次完成时发放奖励。
- `rewardClaimed` 防止刷新或重复完成后重复派奖。
- MVP 可以自动领取，不做领取按钮。

## 12. Badge 规则

徽章不应写死在页面里，而是配置化。

```tsx
type Badge = {
  id: string;
  title: string;
  category: 'start' | 'streak' | 'breakthrough' | 'team' | 'life' | 'limited';
  description: string;
  iconKey: string;
  condition: BadgeCondition;
};
```

MVP 必做徽章：

- 首次动动：完成任意 1 个任务。
- 第一关完成：完成 1-1。
- 第一座能量桥：完成 1-5。
- 一周不掉线：streak 达到 7。
- 十分钟达人：完成任意 10 分钟任务 3 次。
- 饭后行动派：完成饭后散步类任务 3 次。

实现方式：

- `unlockBadges(state, completion)` 每次任务完成后扫描 badge 配置。
- 已解锁徽章不重复插入。
- 新解锁徽章返回给完成弹窗和 feed 生成逻辑。

## 13. 社区动态生成规则

Feed 类型：

```tsx
type FeedType = 'completion' | 'badge' | 'league' | 'milestone' | 'official';
```

自动生成场景：

- 用户完成任务：生成 completion 动态。
- 用户解锁徽章：生成 badge 动态。
- 用户完成 1-5 或 1-10：生成 milestone 动态。
- 用户 League 排名进入前 5：可生成 league 动态。

Feed 内容原则：

- 不展示真实健康隐私。
- 不展示体重、卡路里、身体评价。
- 文案要像轻松的运动搭子，不要像健身教练打鸡血。

互动：

- 点赞做真实本地状态。
- 评论入口可以先弹 Toast：“评论功能 Demo 暂未开放”。
- 分享按钮可以先生成完成卡弹窗，或先 Toast 占位。
- 提醒好友动一下只做按钮状态，不做真实通知。

## 14. 页面实现说明

### 14.1 App Shell

职责：

- 控制手机容器宽度。
- 放置顶部头像入口。
- 放置底部导航。
- 给主内容区留出底部安全距离。

验收：

- 375px、390px、430px 下不横向滚动。
- 底部导航不遮挡页面最后一个卡片。
- 任务详情页可以隐藏底部导航，让用户专注任务。

### 14.2 Adventure Page

组件：

- `UserStatusCard`：读取 user、league、streak。
- `AdventureMap`：读取主线数据和完成状态。
- `CurrentLevelCard`：读取当前关卡。
- `MilestoneHint`：根据下一 milestone 计算提示。

关键交互：

- 当前关卡可点击开始。
- 已完成关卡可点击回看，但再次完成只算重复完成。
- 未解锁关卡展示锁定态，不进入任务详情。
- 1-5、1-10 使用 milestone 样式。

### 14.3 Quick Move Page

组件：

- `RecommendedMoveCard`：规则推荐一个任务。
- `QuickMoveGrid`：展示 4 个快练。
- `RecentMoves`：根据 completions 排序。
- `RewardNote`：解释快练可保 streak、计入 Quest。

推荐规则优先级：

1. 如果今日未完成任务，推荐 10 分钟肩颈放松或饭后散步。
2. 如果用户偏好 core，推荐核心入门。
3. 如果当前时间是早上，推荐晨间唤醒。
4. 如果已完成今日任务，推荐低压力恢复类任务。

### 14.4 Task Detail Page

组件：

- `TaskHero`：任务名、XP、时长、难度。
- `MotionPreview`：视频/GIF/占位图。
- `StepList`：步骤和安全提示。
- `TaskTimer`：开始、暂停、继续、重置。
- `IntensityPicker`：完成前自评。
- `CompletionDialog`：结算反馈。

计时器要求：

- 初始状态：未开始。
- 点击开始后倒计时。
- 暂停时保持剩余时间。
- 时间到后按钮变成“完成”。
- Demo 允许开发模式下跳过计时，但正式演示默认不要暴露。

完成按钮规则：

- 未开始时不可完成。
- 已开始但少于 10 秒完成：可以完成，但 League XP 为 0。
- 正常完成：进入 `completeTask`。

### 14.5 Quest Page

页面层级：

1. 月 Quest：最大目标，给用户长期方向。
2. 周 Quest：本周目标。
3. 小队 Quest：展示社交协作感。
4. 每日 Quest：三档即时反馈。

验收重点：

- 完成任意任务后 Daily 第一档变为完成。
- 完成 10 分钟快练后 Daily 第二档变为完成。
- 完成快练后 Weekly 快练任务进度增加。
- Team Quest 展示个人贡献上限。

### 14.6 League Page

组件：

- `LeagueHeader`：段位、排名、剩余时间、规则。
- `LeaguePath`：10 段位路径。
- `RankingList`：20 人排行榜。

排名逻辑：

- 假用户有初始 XP。
- 用户完成任务后自己的 `leagueXp` 增加。
- 排行榜按 league XP 降序。
- 前 5 名标记晋级区，中间 10 名保级区，后 5 名降级区。

MVP 不做真实周结算，只展示“本轮剩余 X 天”。

### 14.7 Community Page

组件：

- `FeedCard`：按 type 渲染不同样式。
- `FeedActions`：点赞、评论、分享、提醒。

验收重点：

- 初始 feed 不为空。
- 完成任务后顶部插入新动态。
- 点赞刷新后保留。
- 不出现真实上传入口，不让用户误以为可以发视频。

### 14.8 Profile Page

组件：

- `ProfileHeader`：头像、昵称、等级、段位、streak、XP、运动币。
- `GrowthPanel`：等级进度、League 排名、本周完成数。
- `BadgeWall`：徽章分类。
- `FriendList`：假好友状态。
- `ActivityReview`：AI 复盘占位。

验收重点：

- 完成任务后 XP、streak、本周完成次数更新。
- 解锁徽章后徽章墙状态更新。
- AI 复盘文案根据完成次数变化。

## 15. UI 设计约束

整体风格：

- 移动端优先。
- 轻松、清爽、游戏化，但不要低幼。
- 主色可用绿色系，但不要整个页面只有一种绿色。建议搭配蓝、黄、浅灰、少量橙色作为奖励色。
- 卡片圆角建议 8px 到 16px，业务卡片可以稍圆，工具按钮保持清晰。
- 字号不要用 viewport 缩放。

字体与排版：

- App UI 默认使用中文优先字体栈：`HarmonyOS Sans SC`, `PingFang SC`, `Hiragino Sans GB`, `Noto Sans CJK SC`, `Source Han Sans SC`, `Microsoft YaHei UI`, `Microsoft YaHei`, `sans-serif`。
- 不把英文字体放在中文字体前面，避免中文 fallback 后出现字重、字面和行高不统一。
- 标题建议 700 到 800 字重，正文 400 到 500 字重；数字、段位和关键按钮可以使用 700 到 800。
- 字体气质要清爽、圆润、亲和，服务“松弛陪伴型运动搭子”，不要做硬核健身房风格。

吉祥物素材：

- 动动素材库放在 `assets/mascot/`。
- 基础形象：戴绿色运动发带、背小水壶、穿白绿运动鞋的小水豚，穿绿色运动背心，胸前有白色 `D` 标。
- 性格表达：松弛、温和、陪伴型，不鸡血、不 PUA。
- 视觉风格：圆润、暖棕色毛发、3D 玩具感、轻运动校园感。
- 形态优先覆盖：头像、默认站立、完成鼓励、散步、慢跑、拉伸、喝水、休息、AI 陪练。
- 页面里优先引用新版 `dongdong-3d-*.png`，不在 CSS 里重复手绘一套吉祥物。旧版 `dongdong-*.svg` 仅作为占位或备用。

组件要求：

- 底部导航用图标 + 短标签。
- 状态数字用 pill 或小卡展示。
- 进度用 Progress，不要只写文字。
- 完成反馈用 Dialog。
- 操作用 Toast 提示。
- 未开放功能不要静默失败，要给轻提示。

移动端安全区：

- 主画板按 Figma Demo 的手机 Frame 处理，默认预览尺寸为 `390px × 844px`，比例约 `0.46`，接近主流 iPhone App 视口。
- 主内容区底部 padding 至少 88px。
- 底部导航固定高度约 64px 到 72px。
- 任务详情页底部按钮固定时，要额外给内容区 padding。

## 16. 开发顺序建议

第一阶段：工程骨架

- T001 到 T007。
- 目标：能跑、能切页、有移动端壳层和基础视觉。

第二阶段：数据与状态

- T008 到 T015。
- 目标：静态数据、默认 state、localStorage、store action 打通。

第三阶段：核心闭环

- T016 到 T033。
- 目标：冒险页、快练页、任务详情页、completeTask 跑通。

第四阶段：激励系统

- T034 到 T048。
- 目标：Quest、League、Community、Profile 全部消费同一份状态。

第五阶段：AI 感与演示质量

- T049 到 T057。
- 目标：入岛测试、推荐文案、复盘、QA、README。

不建议一开始就做全部页面视觉。先做闭环，再补完整页面。否则很容易得到一堆静态漂亮页面，但完成任务后没有真实反馈。

## 17. 单个 task 的标准写法

后续每个开发 task 都建议补齐以下字段：

- 目标：这个 task 解决什么问题。
- 范围：包括什么，不包括什么。
- 依赖：前置 task 或数据结构。
- 建议文件：预计新增/修改哪些文件。
- 输入数据：组件或 action 需要什么数据。
- 交互行为：用户点击、状态变化、异常情况。
- 验收标准：如何判断完成。
- 复杂度：S / M / L。

示例：

```
T017 冒险页 - 主线地图组件
目标：展示第 1 章 10 个主线关卡，并清楚表达已完成、当前、未解锁、milestone 状态。
范围：只做地图节点和点击行为，不做任务完成结算。
依赖：T008 主线数据，T015 App Store。
建议文件：src/features/adventure/AdventureMap.tsx。
输入数据：adventureLevels、currentAdventureTaskId、completedTaskIds。
交互行为：当前关卡可开始，已完成可回看，未解锁不可点。
验收标准：完成 1-1 后 1-1 点亮，1-2 变当前；1-5 和 1-10 有 milestone 样式。
复杂度：M。
```

## 18. 手动验收脚本

必须走通这条脚本，才算 MVP 闭环成立：

1. 打开 `/adventure`。
2. 确认用户状态卡显示 0 XP、0 streak、青铜段位。
3. 点击当前关卡 1-1。
4. 进入 `/task/a-1-1`。
5. 点击开始计时。
6. 完成任务，选择自评强度。
7. 弹窗显示 XP、streak、Quest、League、badge 反馈。
8. 回到冒险页，1-1 点亮，1-2 解锁。
9. 进入 Quest 页，每日任务进度更新。
10. 进入 League 页，用户 XP 和排名变化。
11. 进入 Community 页，顶部出现完成动态。
12. 进入 Profile 页，XP、streak、徽章墙、运动记录更新。
13. 刷新页面，所有状态保留。
14. 点击重置 Demo，恢复初始状态。

## 19. MVP 不做清单

开发过程中遇到这些需求，先做占位或明确不做：

- 真实账号注册和登录。
- 真实好友添加。
- 真实排行榜同步。
- 真实社区发帖和评论。
- 视频上传、图片上传。
- 计步器、GPS、健康数据。
- OpenAI API 实时生成任务。
- 商城支付、优惠券兑换。
- Push Notification。
- 复杂内容审核系统。

这些不是不重要，而是会把 Demo 从“产品闭环验证”拖成“后端产品研发”。第一版必须克制。

## 20. 最小可上线完成定义

当以下条件全部满足，MVP Demo 可以交付：

- 5 个底部 Tab 和我的页都可访问。
- 主线 10 关和快练 4 个都能进入任务详情。
- 至少 1 个主线任务和 1 个快练任务能完成并结算。
- completeTask 统一更新 XP、streak、Quest、League、badge、feed。
- localStorage 刷新保留状态。
- 社区有初始 feed 和自动动态。
- Profile 能展示个人成长和徽章墙。
- 移动端 375px / 390px / 430px 无横向滚动、无明显遮挡。
- README 写清楚启动方式、演示路径、MVP 范围和暂不实现项。

如果开发时间紧，优先级永远是：任务完成闭环 > 状态同步 > 移动端可用性 > 视觉精修 > AI 感增强。
