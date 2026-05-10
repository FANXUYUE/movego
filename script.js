const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".tab-panel");
const startQuest = document.querySelector("#startQuest");
const checkinCard = document.querySelector("#checkinCard");
const checkinTitle = document.querySelector("#checkinTitle");
const checkinHint = document.querySelector("#checkinHint");
const progressText = document.querySelector("#progressText");
const energy = document.querySelector("#energy");
const streak = document.querySelector("#streak");
const meStatus = document.querySelector("#meStatus");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => item.classList.remove("active"));
    panels.forEach((panel) => panel.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}`).classList.add("active");
  });
});

function setProgress(value) {
  progressText.textContent = `${value}%`;
  checkinCard.querySelector(".progress-circle").style.background =
    `conic-gradient(var(--green) ${value * 3.6}deg, #e6edf5 0deg)`;
}

startQuest.addEventListener("click", () => {
  startQuest.disabled = true;
  startQuest.textContent = "进行中";
  checkinTitle.textContent = "正在识别肩颈拉伸";
  checkinHint.textContent = "保持节奏，动动正在为你记录本次 Quest";
  meStatus.textContent = "运动中";

  let progress = 0;
  const timer = window.setInterval(() => {
    progress += 20;
    setProgress(progress);

    if (progress >= 100) {
      window.clearInterval(timer);
      checkinCard.classList.add("completed");
      checkinTitle.textContent = "Quest 完成";
      checkinHint.textContent = "获得 18 能量，七日续航徽章进度 +1";
      startQuest.textContent = "已完成";
      energy.textContent = Number(energy.textContent) + 18;
      streak.textContent = Number(streak.textContent) + 1;
      meStatus.textContent = "已完成肩颈解锁";
    }
  }, 520);
});
