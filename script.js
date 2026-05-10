const adventureLevels = [
  {
    id: "a-1-1",
    code: "1-1",
    title: "下楼走一圈",
    type: "步行启动",
    duration: "5 分钟",
    xp: 20,
    goal: "完成第一次低门槛运动",
  },
  {
    id: "a-1-2",
    code: "1-2",
    title: "宿舍肩颈解锁",
    type: "拉伸恢复",
    duration: "6 分钟",
    xp: 20,
    goal: "缓解久坐肩颈",
  },
  {
    id: "a-1-3",
    code: "1-3",
    title: "饭后校园散步",
    type: "生活运动",
    duration: "10 分钟",
    xp: 25,
    goal: "把运动嵌入日常",
  },
  {
    id: "a-1-4",
    code: "1-4",
    title: "晨间唤醒",
    type: "轻激活",
    duration: "7 分钟",
    xp: 25,
    goal: "起床后低强度激活",
  },
  {
    id: "a-1-5",
    code: "1-5",
    title: "第一座能量桥",
    type: "Milestone",
    duration: "10 分钟",
    xp: 50,
    goal: "综合轻运动挑战",
    milestone: true,
  },
  {
    id: "a-1-6",
    code: "1-6",
    title: "图书馆久坐修复",
    type: "久坐恢复",
    duration: "8 分钟",
    xp: 25,
    goal: "自习后修复肩背髋",
  },
  {
    id: "a-1-7",
    code: "1-7",
    title: "核心入门",
    type: "基础力量",
    duration: "10 分钟",
    xp: 30,
    goal: "建立轻力量训练体验",
  },
  {
    id: "a-1-8",
    code: "1-8",
    title: "校园快走挑战",
    type: "心肺入门",
    duration: "12 分钟",
    xp: 30,
    goal: "稍微提高心肺强度",
  },
  {
    id: "a-1-9",
    code: "1-9",
    title: "睡前舒缓",
    type: "放松恢复",
    duration: "8 分钟",
    xp: 25,
    goal: "睡前低压力拉伸",
  },
  {
    id: "a-1-10",
    code: "1-10",
    title: "一周不掉线",
    type: "Milestone",
    duration: "12 分钟",
    xp: 80,
    goal: "完成第一章总结挑战",
    milestone: true,
  },
];

const STORAGE_KEY = "movego-adventure-v1";
const defaultState = {
  xp: 120,
  streak: 3,
  league: "青铜 III",
  currentAdventureTaskId: "a-1-1",
  completedTaskIds: [],
};

const adventureMap = document.querySelector("#adventureMap");
const currentCard = document.querySelector("#currentCard");
const currentCode = document.querySelector("#currentCode");
const currentTitle = document.querySelector("#currentTitle");
const currentGoal = document.querySelector("#currentGoal");
const currentDuration = document.querySelector("#currentDuration");
const currentType = document.querySelector("#currentType");
const currentReward = document.querySelector("#currentReward");
const streakValue = document.querySelector("#streakValue");
const xpValue = document.querySelector("#xpValue");
const leagueValue = document.querySelector("#leagueValue");
const milestoneTitle = document.querySelector("#milestoneTitle");
const milestoneCount = document.querySelector("#milestoneCount");
const startAdventure = document.querySelector("#startAdventure");
const resetProgress = document.querySelector("#resetProgress");
const completeDialog = document.querySelector("#completeDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const dialogBody = document.querySelector("#dialogBody");
const closeDialog = document.querySelector("#closeDialog");
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

let state = loadState();

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultState, ...saved } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentLevel() {
  return (
    adventureLevels.find((level) => level.id === state.currentAdventureTaskId) ||
    adventureLevels[adventureLevels.length - 1]
  );
}

function getLevelStatus(level) {
  const currentIndex = adventureLevels.findIndex(
    (item) => item.id === state.currentAdventureTaskId,
  );
  const levelIndex = adventureLevels.findIndex((item) => item.id === level.id);

  if (state.completedTaskIds.includes(level.id)) return "completed";
  if (level.id === state.currentAdventureTaskId) return "current";
  if (levelIndex < currentIndex) return "completed";
  return "locked";
}

function render() {
  const currentLevel = getCurrentLevel();
  const completedCount = state.completedTaskIds.length;

  streakValue.textContent = state.streak;
  xpValue.textContent = state.xp;
  if (leagueValue) leagueValue.textContent = state.league;

  currentCode.textContent = `${currentLevel.code} 当前关卡`;
  currentTitle.textContent = currentLevel.title;
  currentGoal.textContent = currentLevel.goal;
  currentDuration.textContent = currentLevel.duration;
  currentType.textContent = currentLevel.type;
  currentReward.textContent = `${currentLevel.xp} XP`;
  startAdventure.textContent =
    completedCount >= adventureLevels.length ? "第一章完成" : "开始";
  startAdventure.disabled = completedCount >= adventureLevels.length;

  renderMilestone(completedCount);
  renderMap();
}

function renderMilestone(completedCount) {
  const nextMilestone = adventureLevels.find(
    (level) =>
      level.milestone && !state.completedTaskIds.includes(level.id),
  );

  if (!nextMilestone) {
    milestoneTitle.textContent = "第一章已完成，徽章墙可以点亮了";
    milestoneCount.textContent = "10/10";
    return;
  }

  const milestoneIndex =
    adventureLevels.findIndex((level) => level.id === nextMilestone.id) + 1;
  const remaining = milestoneIndex - completedCount;
  const label =
    nextMilestone.code === "1-5" ? "第一步勇士" : "一周不掉线";

  milestoneTitle.textContent = `再完成 ${remaining} 关，解锁${label}`;
  milestoneCount.textContent = `${completedCount}/${milestoneIndex}`;
}

function renderMap() {
  adventureMap.innerHTML = "";
  const route = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  route.setAttribute("class", "map-route");
  route.setAttribute("viewBox", "0 0 100 720");
  route.setAttribute("preserveAspectRatio", "none");
  route.setAttribute("aria-hidden", "true");
  route.innerHTML = `
    <path d="M50 34 C26 72 30 112 57 150 S75 246 38 276 S26 360 66 426 S78 528 44 568 S31 650 48 700" />
  `;
  adventureMap.append(route);

  adventureLevels.forEach((level, index) => {
    const status = getLevelStatus(level);
    const item = document.createElement("li");
    item.className = `map-node ${status}${level.milestone ? " milestone" : ""}`;

    const button = document.createElement("button");
    button.type = "button";
    button.disabled = status === "locked";
    button.setAttribute(
      "aria-label",
      `${level.code} ${level.title}，${statusLabel(status)}`,
    );
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
      currentCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    const position = mapPositions[index] || mapPositions[mapPositions.length - 1];
    item.style.setProperty("--node-x", `${position.x}%`);
    item.style.setProperty("--node-y", `${position.y}px`);
    item.append(button);
    adventureMap.append(item);
  });
}

function completeCurrentLevel() {
  const currentLevel = getCurrentLevel();

  if (state.completedTaskIds.includes(currentLevel.id)) {
    showDialog(currentLevel, false);
    return;
  }

  state.completedTaskIds = [...state.completedTaskIds, currentLevel.id];
  state.xp += currentLevel.xp;
  state.streak += 1;

  const nextLevel = adventureLevels.find(
    (level) => !state.completedTaskIds.includes(level.id),
  );

  state.currentAdventureTaskId = nextLevel?.id || currentLevel.id;
  saveState();
  render();
  showDialog(currentLevel, true);
}

function showDialog(level, rewarded) {
  dialogTitle.textContent = `${level.title}完成`;
  dialogBody.textContent = rewarded
    ? `获得 ${level.xp} XP，${getCurrentLevel().id === level.id ? "第一章已全部完成。" : "下一关已解锁。"}`
    : "这关已经完成过了，本次作为回看练习，不重复结算 XP。";
  completeDialog.showModal();
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

startAdventure.addEventListener("click", completeCurrentLevel);

resetProgress.addEventListener("click", () => {
  state = { ...defaultState };
  saveState();
  render();
});

closeDialog.addEventListener("click", () => {
  completeDialog.close();
});

render();
