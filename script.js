
const TOTAL_TIME = 60;
const HOLE_COUNT = 9;

const MOLE_FRAMES = [
  "mole_01_emerge_start.png",
  "mole_02_head_rising.png",
  "mole_03_eyes_visible.png",
  "mole_04_nose_visible.png",
  "mole_05_fully_emerged.png",
  "mole_06_surprised.png",
  "mole_07_hit_reaction.png",
  "mole_08_stars.png",
  "mole_09_dizzy.png",
  "mole_10_retreat_start.png",
  "mole_11_head_sinking.png",
  "mole_12_retracted.png"
];

const MOLE_PATH = "assets/sprites/moles/";

const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const comboElement = document.getElementById("combo");
const bestElement = document.getElementById("best");
const holesElement = document.getElementById("holes");
const messageElement = document.getElementById("message");
const startButton = document.getElementById("startBtn");
const hammerElement = document.getElementById("hammer");

let score = 0;
let combo = 0;
let timeLeft = TOTAL_TIME;
let bestScore = loadBestScore();
let playing = false;
let timerId = null;
let spawnId = null;
let activeMoles = new Map();
let lastHoleIndex = -1;

bestElement.textContent = bestScore;

function loadBestScore() {
  try {
    return Number(localStorage.getItem("gardenWhackBest")) || 0;
  } catch {
    return 0;
  }
}

function saveBestScore(value) {
  try {
    localStorage.setItem("gardenWhackBest", String(value));
  } catch {
    // 若瀏覽器限制儲存功能，遊戲仍然可以繼續。
  }
}

function createHoles() {
  holesElement.innerHTML = "";

  for (let i = 0; i < HOLE_COUNT; i++) {
    const hole = document.createElement("button");
    hole.type = "button";
    hole.className = "hole";
    hole.setAttribute("aria-label", `地鼠洞 ${i + 1}`);

    const windowEl = document.createElement("span");
    windowEl.className = "mole-window";

    const mole = document.createElement("img");
    mole.className = "mole";
    mole.alt = "";
    mole.draggable = false;

    const dirt = document.createElement("span");
    dirt.className = "hole-dirt";

    windowEl.appendChild(mole);
    hole.append(windowEl, dirt);

    hole.addEventListener("pointerdown", (event) => {
      event.preventDefault();

      if (!playing) return;

      if (activeMoles.has(i)) {
        hitMole(i, event.clientX, event.clientY);
      } else {
        missMole();
      }
    });

    holesElement.appendChild(hole);
  }
}

function setMoleFrame(hole, frameIndex) {
  const img = hole.querySelector(".mole");
  img.src = MOLE_PATH + MOLE_FRAMES[frameIndex];
}

function clearMole(i) {
  const record = activeMoles.get(i);
  if (!record) return;

  record.timeouts.forEach(clearTimeout);

  const hole = holesElement.children[i];
  hole.classList.remove("up", "hit");
  activeMoles.delete(i);
}

function showMole(i) {
  if (!playing || activeMoles.has(i)) return;

  const hole = holesElement.children[i];
  const record = { hit: false, timeouts: [] };
  activeMoles.set(i, record);

  // 逐格播放正常出現動畫。
  for (let frame = 0; frame < 5; frame++) {
    const timeout = setTimeout(() => {
      if (!playing || record.hit || activeMoles.get(i) !== record) return;

      setMoleFrame(hole, frame);

      if (frame === 4) {
        hole.classList.add("up");
      }
    }, frame * 65);

    record.timeouts.push(timeout);
  }

  // 若玩家沒有擊中，地鼠會自行縮回。
  const hideTimeout = setTimeout(() => {
    if (activeMoles.get(i) !== record || record.hit) return;
    retreatMole(i, record);
  }, 1100 + Math.random() * 800);

  record.timeouts.push(hideTimeout);
}

function retreatMole(i, record) {
  const hole = holesElement.children[i];
  record.timeouts.forEach(clearTimeout);

  for (let j = 0; j < 3; j++) {
    const frameIndex = 9 + j;
    const timeout = setTimeout(() => {
      if (activeMoles.get(i) !== record) return;

      setMoleFrame(hole, frameIndex);

      if (j === 2) {
        hole.classList.remove("up", "hit");
        activeMoles.delete(i);
      }
    }, j * 70);

    record.timeouts.push(timeout);
  }
}

function hitMole(i, x, y) {
  const record = activeMoles.get(i);
  if (!record || record.hit) return;

  record.hit = true;
  record.timeouts.forEach(clearTimeout);

  const hole = holesElement.children[i];
  hole.classList.add("up", "hit");

  score += 10;
  combo += 1;

  scoreElement.textContent = score;
  comboElement.textContent = combo;

  messageElement.textContent =
    combo >= 3 ? `太厲害了！${combo} 連擊！` : "命中！ +10 分";

  // 播放被打中的第 6–9 格，再縮回。
  const hitFrames = [5, 6, 7, 8];

  hitFrames.forEach((frameIndex, index) => {
    const timeout = setTimeout(() => {
      if (activeMoles.get(i) !== record) return;
      setMoleFrame(hole, frameIndex);
    }, index * 65);

    record.timeouts.push(timeout);
  });

  const retreatTimeout = setTimeout(() => {
    if (activeMoles.get(i) !== record) return;
    retreatMole(i, record);
  }, 360);

  record.timeouts.push(retreatTimeout);

  animateHammer(x, y);
}

function missMole() {
  combo = 0;
  comboElement.textContent = combo;
  messageElement.textContent = "差一點！再試一次！";
}

function animateHammer(x, y) {
  hammerElement.style.left = `${x - hammerElement.offsetWidth / 2}px`;
  hammerElement.style.top = `${y - hammerElement.offsetHeight / 2}px`;

  hammerElement.classList.remove("swing");
  hammerElement.classList.add("show");

  // 重新觸發 CSS 動畫。
  void hammerElement.offsetWidth;
  hammerElement.classList.add("swing");

  setTimeout(() => {
    hammerElement.classList.remove("swing", "show");
    hammerElement.style.left = "-300px";
    hammerElement.style.top = "-300px";
  }, 400);
}

function chooseHole() {
  const available = [];

  for (let i = 0; i < HOLE_COUNT; i++) {
    if (!activeMoles.has(i)) available.push(i);
  }

  if (available.length === 0) return -1;

  // 盡可能避免連續出現在同一個洞口。
  let choices = available.filter((i) => i !== lastHoleIndex);
  if (choices.length === 0) choices = available;

  const chosen = choices[Math.floor(Math.random() * choices.length)];
  lastHoleIndex = chosen;
  return chosen;
}

function spawnMole() {
  if (!playing) return;

  const index = chooseHole();
  if (index !== -1) showMole(index);

  // 遊戲進行時逐漸加快出現頻率。
  const delay = Math.max(420, 900 - (TOTAL_TIME - timeLeft) * 7);
  spawnId = setTimeout(spawnMole, delay);
}

function updateTimer() {
  timeLeft -= 1;
  timeElement.textContent = timeLeft;

  if (timeLeft <= 0) endGame();
}

function startGame() {
  stopAllTimers();

  score = 0;
  combo = 0;
  timeLeft = TOTAL_TIME;
  lastHoleIndex = -1;
  playing = true;

  scoreElement.textContent = score;
  comboElement.textContent = combo;
  timeElement.textContent = timeLeft;
  messageElement.textContent = "開始！快點擊地鼠！";
  startButton.textContent = "遊戲進行中…";
  startButton.disabled = true;

  for (let i = 0; i < HOLE_COUNT; i++) {
    const hole = holesElement.children[i];
    hole.classList.remove("up", "hit");
    hole.querySelector(".mole").removeAttribute("src");
  }

  activeMoles.clear();

  spawnMole();
  timerId = setInterval(updateTimer, 1000);
}

function stopAllTimers() {
  clearInterval(timerId);
  clearTimeout(spawnId);
  timerId = null;
  spawnId = null;

  activeMoles.forEach((record) => {
    record.timeouts.forEach(clearTimeout);
  });

  activeMoles.clear();
}

function endGame() {
  playing = false;
  stopAllTimers();

  for (let i = 0; i < HOLE_COUNT; i++) {
    holesElement.children[i].classList.remove("up", "hit");
  }

  if (score > bestScore) {
    bestScore = score;
    bestElement.textContent = bestScore;
    saveBestScore(bestScore);
  }

  messageElement.textContent = `時間到！你得到 ${score} 分！`;
  startButton.textContent = "再玩一次";
  startButton.disabled = false;
}

startButton.addEventListener("click", startGame);

createHoles();
timeElement.textContent = TOTAL_TIME;
scoreElement.textContent = "0";
comboElement.textContent = "0";
bestElement.textContent = bestScore;
