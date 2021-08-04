const timerDisplay = document.getElementById("timer");
const timePerQuestionMins = 1;
const totalQuestions = 4;

let startTime = new Date();
let timer = null;
let timeSpent = 0;
let totalTime = 180 * 1000;
let timeLeft = totalTime;

function setTimerDisplay() {
  timeLeft = totalTime - timeSpent;
  timerDisplay.innerHTML = Math.round(Math.max(0, timeLeft / 1000)) + "s";
}

function updateTimer() {
  if (timeLeft <= 0) {
    // alert("Time's up");
    console.log("Time's up");
    clearInterval(timer);
    return;
  }
  const now = new Date();
  const timeELapsed = now - startTime;
  timeSpent += timeELapsed;
  startTime = now;
  setTimerDisplay();
}

function getKey() {
  const element = document.getElementById("cdt_key");
  return element.value;
}

// localStorage.setItem(getKey(), 0);

window.onload = function () {
  if (localStorage.getItem(getKey())) {
    timeSpent = parseInt(localStorage.getItem(getKey()));
    console.log("time spent", timeSpent);
  }
  setTimerDisplay();
  timer = setInterval(updateTimer, 1000);
};

window.onunload = function () {
  localStorage.setItem(getKey(), timeSpent);
  clearInterval(timer);
};

console.log("key", getKey());
