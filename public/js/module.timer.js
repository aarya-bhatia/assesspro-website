const element = document.getElementById("time_spent");
const timerDisplay = document.getElementById("timer_display");
const module_id = document.getElementById("user_module_id").value;
console.log("user module id: ", module_id);

let prev_time = null,
  timer = null,
  accum = null;

function updateTimerDisplay(elapsedTimeMilli) {
  let seconds = Math.round((elapsedTimeMilli / 1000) % 60);
  let minutes = Math.round(elapsedTimeMilli / 1000 / 60);
  if (minutes.length === 1) {
    minutes = `0${minutes}`;
  }
  if (seconds.length === 1) {
    seconds = `0${seconds}`;
  }
  timerDisplay.innerText = `${minutes} min: ${seconds} sec`;
  element.value = elapsedTimeMilli;
}

function handleTimer() {
  const delta_time = Date.now() - prev_time;
  accum += delta_time;
  prev_time += delta_time;
  updateTimerDisplay(accum);
}

// start timer
window.onload = function () {
  prev_time = Date.now();
  accum =
    Number(localStorage.getItem(module_id)) ||
    Number("<%= user_module.time_spent %>") ||
    0;
  console.log("total elapsed time milli: ", accum);
  updateTimerDisplay(accum);
  timer = setInterval(handleTimer, 1000);
};

// end timer
window.onunload = function () {
  if (timer) {
    clearInterval(timer);
  }
  localStorage.setItem(module_id, accum);
  console.log(localStorage);
};
