const timeDisplay = document.querySelector(".time");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const lapBtn = document.getElementById("lap");
const resetBtn = document.getElementById("reset");
const progress = document.querySelector(".progress-ring__circle");
const lapsList = document.querySelector(".laps");

let startTime, updatedTime, difference, timer;
let running = false;
let elapsedTime = 0;

// Circle progress setup
const radius = progress.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progress.style.strokeDasharray = circumference;
progress.style.strokeDashoffset = circumference;

// Format time
function formatTime(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return (
    (minutes < 10 ? "0" : "") + minutes + ":" +
    (seconds < 10 ? "0" : "") + seconds + "." +
    (centiseconds < 10 ? "0" : "") + centiseconds
  );
}

// Update stopwatch
function updateTime() {
  updatedTime = Date.now();
  difference = updatedTime - startTime + elapsedTime;
  timeDisplay.textContent = formatTime(difference);

  const progressOffset = circumference - (difference / 60000 % 1) * circumference;
  progress.style.strokeDashoffset = progressOffset;
}

// Start
startBtn.addEventListener("click", () => {
  startTime = Date.now();
  timer = setInterval(updateTime, 10);
  running = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  lapBtn.disabled = false;
  resetBtn.disabled = false;
});

// Stop
stopBtn.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  elapsedTime = difference;
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Lap
lapBtn.addEventListener("click", () => {
  if (running) {
    const li = document.createElement("li");
    li.textContent = timeDisplay.textContent;
    lapsList.appendChild(li);

    // Confetti burst 🎉
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0 } });
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1 } });

    celebrate();
  }
});

// Reset
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  running = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;
  resetBtn.disabled = true;
  elapsedTime = 0;
  timeDisplay.textContent = "00:00.00";
  progress.style.strokeDashoffset = circumference;

  // Animate lap removal
  const laps = document.querySelectorAll(".laps li");
  laps.forEach((lap, index) => {
    setTimeout(() => {
      lap.classList.add("removing");
      lap.addEventListener("animationend", () => lap.remove());
    }, index * 150);
  });

  // Subtle confetti
  confetti({ particleCount: 50, spread: 40, origin: { y: 0.7 } });
});

// Celebrate pulse
function celebrate() {
  document.querySelector(".stopwatch").classList.add("celebrate");
  setTimeout(() => {
    document.querySelector(".stopwatch").classList.remove("celebrate");
  }, 500);
}

// Particle stars background
const canvas = document.createElement("canvas");
document.getElementById("particles").appendChild(canvas);
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];
for (let i = 0; i < 100; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    d: Math.random() * 1
  });
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.beginPath();
  stars.forEach(s => {
    ctx.moveTo(s.x, s.y);
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2, true);
  });
  ctx.fill();
  updateStars();
}

function updateStars() {
  stars.forEach(s => {
    s.y += s.d;
    if (s.y > canvas.height) {
      s.y = 0;
      s.x = Math.random() * canvas.width;
    }
  });
}

setInterval(drawStars, 50);