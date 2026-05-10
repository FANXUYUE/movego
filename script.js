const adventureLevels = [
  { id: "a-1-1", kind: "adventure", code: "1-1", title: "下楼走一圈", type: "步行启动", duration: "5 分钟", minutes: 5, xp: 20, goal: "完成第一次低门槛运动" },
  { id: "a-1-2", kind: "adventure", code: "1-2", title: "宿舍肩颈解锁", type: "拉伸恢复", duration: "6 分钟", minutes: 6, xp: 20, goal: "缓解久坐肩颈" },
  { id: "a-1-3", kind: "adventure", code: "1-3", title: "饭后校园散步", type: "生活运动", duration: "10 分钟", minutes: 10, xp: 25, goal: "把运动嵌入日常" },
  { id: "a-1-4", kind: "adventure", code: "1-4", title: "晨间唤醒", type: "轻激活", duration: "7 分钟", minutes: 7, xp: 25, goal: "起床后低强度激活" },
  { id: "a-1-5", kind: "adventure", code: "1-5", title: "第一座能量桥", type: "Milestone", duration: "10 分钟", minutes: 10, xp: 50, goal: "综合轻运动挑战", milestone: true },
  { id: "a-1-6", kind: "adventure", code: "1-6", title: "图书馆久坐修复", type: "久坐恢复", duration: "8 分钟", minutes: 8, xp: 25, goal: "自习后修复肩背髋" },
  { id: "a-1-7", kind: "adventure", code: "1-7", title: "核心入门", type: "基础力量", duration: "10 分钟", minutes: 10, xp: 30, goal: "建立轻力量训练体验" },
  { id: "a-1-8", kind: "adventure", code: "1-8", title: "校园快走挑战", type: "心肺入门", duration: "12 分钟", minutes: 12, xp: 30, goal: "稍微提高心肺强度" },
  { id: "a-1-9", kind: "adventure", code: "1-9", title: "睡前舒缓", type: "放松恢复", duration: "8 分钟", minutes: 8, xp: 25, goal: "睡前低压力拉伸" },
  { id: "a-1-10", kind: "adventure", code: "1-10", title: "一周不掉线", type: "Milestone", duration: "12 分钟", minutes: 12, xp: 80, goal: "完成第一章总结挑战", milestone: true },
];

const quickMoves = [
  { id: "q-neck", kind: "quick", icon: "1", title: "肩颈放松", scene: "久坐救星", duration: "10 min", minutes: 10, xp: 20, tone: "mint", goal: "颈部侧伸、肩绕环、胸椎打开、肩胛夹背、深呼吸" },
  { id: "q-core", kind: "quick", icon: "2", title: "核心入门", scene: "宿舍可做", duration: "10 min", minutes: 10, xp: 25, tone: "peach", goal: "死虫、臀桥、平板支撑膝盖版、呼吸收腹" },
  { id: "q-walk", kind: "quick", icon: "3", title: "饭后散步", scene: "校园路上", duration: "10 min", minutes: 10, xp: 20, tone: "mint", goal: "慢走、轻快走、放松走" },
  { id: "q-wake", kind: "quick", icon: "4", title: "晨间唤醒", scene: "低强度", duration: "10 min", minutes: 10, xp: 20, tone: "mint", goal: "站姿伸展、肩绕环、原地踏步、侧向伸展、深呼吸" },
];

const weeklyQuests = [
  { id: "w-days", title: "完成 4 天运动", currentKey: "weekMoveDays", target: 4 },
  { id: "w-quick", title: "完成 2 次快练", currentKey: "weekQuickCount", target: 2 },
  { id: "w-team", title: "小队贡献 1 次", currentKey: "teamContribution", target: 1 },
];

const dailyQuests = [
  { id: "d-any", step: 1, title: "动一下就算赢", desc: "完成任意 1 个任务", reward: "20 XP", doneWhen: (s) => s.todayTasks >= 1 },
  { id: "d-main", step: 2, title: "稳稳推进一步", desc: "冒险或 10 分钟快练", reward: "40 XP + 5币", doneWhen: (s) => s.todayMainOrQuick >= 1 },
  { id: "d-team", step: 3, title: "今日小挑战", desc: "AI 推荐 + 小队贡献", reward: "80 XP + 钥匙", doneWhen: (s) => s.recommendedDone && s.teamContribution >= 1 },
];

const STORAGE_KEY = "movego-demo-v2";
const legacyStorageKey = "movego-adventure-v1";
const defaultState = {
  xp: 120,
  streak: 3,
  moveCoins: 0,
  league: "青铜动能者",
  currentAdventureTaskId: "a-1-1",
  completedTaskIds: [],
  quickCompletionIds: [],
  todayTasks: 0,
  todayMainOrQuick: 0,
  weekMoveDays: 2,
  weekQuickCount: 1,
  monthTaskCount: 12,
  teamTaskCount: 17,
  teamContribution: 0,
  recommendedDone: false,
  lastQuickTitle: "图书馆肩颈恢复",
  activeView: "adventure",
};

const viewCopy = {
  adventure: ["动动Go", "今天不用很猛，动一下就算赢。"],
  quick: ["快练一下", "没时间也能轻松保住节奏"],
  quest: ["Quest", "日、周、月目标一起推进"],
  league: ["锦标赛", "下一版接上段位排行榜"],
  community: ["社区", "下一版接上好友动态流"],
};

const mapPositions = [
  { x: 50, y: 18 },
  { x: 34, y: 88 },
  { x: 57, y: 158 },
  { x: 36, y: 230 },
  { x: 63, y: 304 },
  { x: 42, y: 378 },
  { x: 67, y: 452 },
  { x: 44, y: 526 },
  { x: 62, y: 600 },
  { x: 47, y: 674 },
];

const dom = {
  screen: document.querySelector("#screen"),
  viewTitle: document.querySelector("#viewTitle"),
  viewSubtitle: document.querySelector("#viewSubtitle"),
  views: document.querySelectorAll(".view"),
  navItems: document.querySelectorAll(".nav-item"),
  adventureMap: document.querySelector("#adventureMap"),
  currentCard: document.querySelector("#currentCard"),
  currentCode: document.querySelector("#currentCode"),
  currentTitle: document.querySelector("#currentTitle"),
  currentGoal: document.querySelector("#currentGoal"),
  currentDuration: document.querySelector("#currentDuration"),
  currentType: document.querySelector("#currentType"),
  currentReward: document.querySelector("#currentReward"),
  streakValue: document.querySelector("#streakValue"),
  xpValue: document.querySelector("#xpValue"),
  leagueValue: document.querySelector("#leagueValue"),
  milestoneTitle: document.querySelector("#milestoneTitle"),
  milestoneCount: document.querySelector("#milestoneCount"),
  startAdventure: document.querySelector("#startAdventure"),
  resetProgress: document.querySelector("#resetProgress"),
  quickGrid: document.querySelector("#quickGrid"),
  recentTitleText: document.querySelector("#recentTitleText"),
  recentMeta: document.querySelector("#recentMeta"),
  weeklyQuestGrid: document.querySelector("#weeklyQuestGrid"),
  dailyQuestList: document.querySelector("#dailyQuestList"),
  monthQuestText: document.querySelector("#monthQuestText"),
  monthQuestProgress: document.querySelector("#monthQuestProgress"),
  teamQuestText: document.querySelector("#teamQuestText"),
  teamQuestProgress: document.querySelector("#teamQuestProgress"),
  completeDialog: document.querySelector("#completeDialog"),
  dialogLabel: document.querySelector("#dialogLabel"),
  dialogTitle: document.querySelector("#dialogTitle"),
  dialogBody: document.querySelector("#dialogBody"),
  closeDialog: document.querySelector("#closeDialog"),
};

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) return { ...defaultState, ...saved };

    const legacy = JSON.parse(localStorage.getItem(legacyStorageKey));
    if (legacy) return { ...defaultState, ...legacy, league: "青铜动能者" };
  } catch {
    return { ...defaultState };
  }
  return { ...defaultState };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function findTask(taskId) {
  return [...adventureLevels, ...quickMoves].find((task) => task.id === taskId);
}

function getCurrentLevel() {
  return adventureLevels.find((level) => level.id === state.currentAdventureTaskId) || adventureLevels[adventureLevels.length - 1];
}

function getLevelStatus(level) {
  const currentIndex = adventureLevels.findIndex((item) => item.id === state.currentAdventureTaskId);
  const levelIndex = adventureLevels.findIndex((item) => item.id === level.id);

  if (state.completedTaskIds.includes(level.id)) return "completed";
  if (level.id === state.currentAdventureTaskId) return "current";
  if (levelIndex < currentIndex) return "completed";
  return "locked";
}

function render() {
  renderShell();
  renderAdventure();
  renderQuickMoves();
  renderQuests();
}

function renderShell() {
  const [title, subtitle] = viewCopy[state.activeView] || viewCopy.adventure;
  dom.viewTitle.textContent = title;
  dom.viewSubtitle.textContent = subtitle;

  dom.views.forEach((view) => {
    view.classList.toggle("active", view.dataset.view === state.activeView);
  });

  dom.navItems.forEach((item) => {
    const isActive = item.dataset.targetView === state.activeView;
    item.classList.toggle("active", isActive);
    item.toggleAttribute("aria-current", isActive);
  });
}

function renderAdventure() {
  const currentLevel = getCurrentLevel();
  const completedCount = state.completedTaskIds.length;

  dom.streakValue.textContent = state.streak;
  dom.xpValue.textContent = state.xp;
  dom.leagueValue.textContent = state.league;
  dom.currentCode.textContent = `${currentLevel.code} 当前关卡`;
  dom.currentTitle.textContent = currentLevel.title;
  dom.currentGoal.textContent = currentLevel.goal;
  dom.currentDuration.textContent = currentLevel.duration;
  dom.currentType.textContent = currentLevel.type;
  dom.currentReward.textContent = `${currentLevel.xp} XP`;
  dom.startAdventure.textContent = completedCount >= adventureLevels.length ? "第一章完成" : "开始";
  dom.startAdventure.disabled = completedCount >= adventureLevels.length;

  renderMilestone(completedCount);
  renderMap();
}

function renderMilestone(completedCount) {
  const nextMilestone = adventureLevels.find((level) => level.milestone && !state.completedTaskIds.includes(level.id));

  if (!nextMilestone) {
    dom.milestoneTitle.textContent = "第一章已完成，徽章墙可以点亮了";
    dom.milestoneCount.textContent = "10/10";
    return;
  }

  const milestoneIndex = adventureLevels.findIndex((level) => level.id === nextMilestone.id) + 1;
  const remaining = milestoneIndex - completedCount;
  const label = nextMilestone.code === "1-5" ? "第一步勇士" : "一周不掉线";

  dom.milestoneTitle.textContent = `再完成 ${remaining} 关，解锁${label}`;
  dom.milestoneCount.textContent = `${completedCount}/${milestoneIndex}`;
}

function renderMap() {
  dom.adventureMap.innerHTML = "";
  const route = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  route.setAttribute("class", "map-route");
  route.setAttribute("viewBox", "0 0 100 720");
  route.setAttribute("preserveAspectRatio", "none");
  route.setAttribute("aria-hidden", "true");
  route.innerHTML = '<path d="M50 34 C26 72 30 112 57 150 S75 246 38 276 S26 360 66 426 S78 528 44 568 S31 650 48 700" />';
  dom.adventureMap.append(route);

  adventureLevels.forEach((level, index) => {
    const status = getLevelStatus(level);
    const item = document.createElement("li");
    item.className = `map-node ${status}${level.milestone ? " milestone" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.disabled = status === "locked";
    button.setAttribute("aria-label", `${level.code} ${level.title}，${statusLabel(status)}`);
    button.innerHTML = `
      <span class="node-icon">${nodeIcon(status, level.milestone)}</span>
      <span class="node-copy">
        <strong>${level.code}</strong>
        <small>${level.title}</small>
      </span>
    `;

    button.addEventListener("click", () => {
      if (status === "locked") return;
      state.currentAdventureTaskId = level.id;
      saveState();
      render();
      dom.currentCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const position = mapPositions[index] || mapPositions[mapPositions.length - 1];
    item.style.setProperty("--node-x", `${position.x}%`);
    item.style.setProperty("--node-y", `${position.y}px`);
    item.append(button);
    dom.adventureMap.append(item);
  });
}

function renderQuickMoves() {
  dom.quickGrid.innerHTML = "";
  quickMoves.forEach((move) => {
    const card = document.createElement("article");
    card.className = "quick-card";
    card.innerHTML = `
      <button class="quick-card__button" type="button" data-complete-task="${move.id}">
        <span class="quick-icon quick-icon--${move.tone}">${move.icon}</span>
        <strong>${move.title}</strong>
        <small>${move.duration} · +${move.xp} XP</small>
        <em>${move.scene}</em>
      </button>
    `;
    dom.quickGrid.append(card);
  });

  dom.recentTitleText.textContent = state.lastQuickTitle || "图书馆肩颈恢复";
  dom.recentMeta.textContent = state.quickCompletionIds.length
    ? `上次完成：刚刚 · 今日已完成 ${state.todayTasks} 个任务`
    : "上次完成：昨天 21:40 · 连续记录已保住";
}

function renderQuests() {
  dom.monthQuestText.textContent = `本月完成 ${state.monthTaskCount} / 20 次运动任务`;
  dom.monthQuestProgress.style.width = `${percent(state.monthTaskCount, 20)}%`;
  dom.teamQuestText.textContent = `${state.teamTaskCount} / 25 次 · 4/5 人参与`;
  dom.teamQuestProgress.style.width = `${percent(state.teamTaskCount, 25)}%`;

  dom.weeklyQuestGrid.innerHTML = "";
  weeklyQuests.forEach((quest) => {
    const current = Math.min(state[quest.currentKey], quest.target);
    const card = document.createElement("article");
    card.className = "week-card";
    card.innerHTML = `
      <h3>${quest.title}</h3>
      <strong>${current}/${quest.target}</strong>
    `;
    dom.weeklyQuestGrid.append(card);
  });

  dom.dailyQuestList.innerHTML = "";
  dailyQuests.forEach((quest) => {
    const done = quest.doneWhen(state);
    const row = document.createElement("article");
    row.className = `daily-row${done ? " completed" : ""}`;
    row.innerHTML = `
      <span>${done ? "✓" : quest.step}</span>
      <div>
        <h3>${quest.title}</h3>
        <p>${quest.desc}</p>
      </div>
      <strong>${quest.reward}</strong>
    `;
    dom.dailyQuestList.append(row);
  });
}

function completeCurrentLevel() {
  completeTask(getCurrentLevel().id);
}

function completeTask(taskId) {
  const task = findTask(taskId);
  if (!task) return;

  const alreadyCompletedAdventure = task.kind === "adventure" && state.completedTaskIds.includes(task.id);
  if (alreadyCompletedAdventure) {
    showDialog(task, false);
    return;
  }

  state.xp += task.xp;
  state.streak += 1;
  state.todayTasks += 1;
  state.todayMainOrQuick += task.kind === "adventure" || task.minutes >= 10 ? 1 : 0;
  state.weekMoveDays = Math.min(state.weekMoveDays + 1, 4);
  state.monthTaskCount = Math.min(state.monthTaskCount + 1, 20);

  if (task.kind === "quick") {
    state.weekQuickCount = Math.min(state.weekQuickCount + 1, 2);
    state.teamContribution = Math.min(state.teamContribution + (task.id === "q-neck" ? 1 : 0), 1);
    state.teamTaskCount = Math.min(state.teamTaskCount + 1, 25);
    state.recommendedDone = state.recommendedDone || task.id === "q-neck";
    state.lastQuickTitle = task.title;
    state.quickCompletionIds = [task.id, ...state.quickCompletionIds].slice(0, 8);
  }

  if (task.kind === "adventure") {
    state.completedTaskIds = [...state.completedTaskIds, task.id];
    const nextLevel = adventureLevels.find((level) => !state.completedTaskIds.includes(level.id));
    state.currentAdventureTaskId = nextLevel?.id || task.id;
  }

  saveState();
  render();
  showDialog(task, true);
}

function showDialog(task, rewarded) {
  dom.dialogLabel.textContent = task.kind === "quick" ? "Quick Move Done" : "Quest Complete";
  dom.dialogTitle.textContent = `${task.title}完成`;
  dom.dialogBody.textContent = rewarded
    ? `获得 ${task.xp} XP，streak +1，Quest 进度已同步。`
    : "这关已经完成过了，本次作为回看练习，不重复结算 XP。";
  dom.closeDialog.textContent = task.kind === "quick" ? "继续快练" : "继续闯关";
  dom.completeDialog.showModal();
}

function switchView(viewName) {
  if (!["adventure", "quick", "quest"].includes(viewName)) {
    showPlaceholder(viewName);
    return;
  }

  state.activeView = viewName;
  saveState();
  render();
  dom.screen.scrollTo({ top: 0, behavior: "smooth" });
}

function showPlaceholder(viewName) {
  const [title, subtitle] = viewCopy[viewName] || viewCopy.adventure;
  dom.dialogLabel.textContent = "Coming Next";
  dom.dialogTitle.textContent = title;
  dom.dialogBody.textContent = `${subtitle}。这次先完成快练和 Quest，后续可以继续接上这个板块。`;
  dom.closeDialog.textContent = "知道了";
  dom.completeDialog.showModal();
}

function resetDemo() {
  state = { ...defaultState, activeView: state.activeView };
  saveState();
  render();
}

function statusLabel(status) {
  return {
    completed: "已完成",
    current: "当前关卡",
    locked: "未解锁",
  }[status];
}

function nodeIcon(status, milestone) {
  if (status === "completed") return "✓";
  if (status === "locked") return "•";
  return milestone ? "★" : "▶";
}

function percent(value, target) {
  return Math.min(100, Math.round((value / target) * 100));
}

dom.startAdventure.addEventListener("click", completeCurrentLevel);
dom.resetProgress.addEventListener("click", resetDemo);
dom.closeDialog.addEventListener("click", () => dom.completeDialog.close());

document.addEventListener("click", (event) => {
  const navButton = event.target.closest("[data-target-view]");
  if (navButton) switchView(navButton.dataset.targetView);

  const completeButton = event.target.closest("[data-complete-task]");
  if (completeButton) completeTask(completeButton.dataset.completeTask);
});

render();
