const questionContainers = document.querySelectorAll(
  "[data-question-container]"
);
const calculateButtons = document.querySelectorAll("[data-calculate-button]");
const inputFields = document.querySelectorAll("[data-input-field]");
const totalSpans = document.querySelectorAll("[data-total-span]");

const questions = {};

for (const question of questionContainers) {
  const id = question.dataset.questionId;

  questions[id] = {
    id,
    calculateButton: null,
    inputFields: [],
    totalSpan: null,
    total: 0,
  };
}

for (const calcBtn of calculateButtons) {
  const questionId = calcBtn.dataset.questionId;
  if (questions[questionId]) {
    questions[questionId].calculateButton = calcBtn;
  }
}

for (const inputField of inputFields) {
  const questionId = inputField.dataset.questionId;
  if (questions[questionId]) {
    questions[questionId].inputFields.push(inputField);
  }
}

for (const span of totalSpans) {
  const questionId = span.dataset.questionId;
  if (questions[questionId]) {
    questions[questionId].totalSpan = span;
  }
}

for (const id of Object.keys(questions)) {
  const question = questions[id];

  if (question.calculateButton) {
    question.calculateButton.addEventListener("click", () =>
      calculateTotal(id)
    );
  }

  for (const inputField of question.inputFields) {
    inputField.addEventListener("change", () => {
      const key = getKey(id, inputField.dataset.optionId);
      console.log("Input changed: ", key, inputField.value);

      localStorage.setItem(key, inputField.value);

      calculateTotal(id);
    });
  }
}

function calculateTotal(id) {
  let total = 0;

  if (!questions[id]) {
    return;
  }
  for (const inputField of questions[id].inputFields) {
    total += parseInt(inputField.value) || 0;
  }
  questions[id].totalSpan.innerHTML = total;
  questions[id].total = total;
}

function populateTotals() {
  for (const id of Object.keys(questions)) {
    calculateTotal(id);
  }
}

const A = "A".charCodeAt(0);

function populateValue(question_id, option_id, value) {
  const question = questions[question_id];
  const inputFields = question.inputFields;
  for (const inputField of inputFields) {
    if (inputField.dataset.optionId == option_id) {
      inputField.value = value;
      break;
    }
  }
}

function populateUserAnswers(user_answers) {
  console.log("HELLO");
  console.log(user_answers);

  for (const answer of user_answers) {
    const key = answer.key;
    const value = answer.value;
    const { question_id, option_id } = parseKey(key);
    populateValue(question_id, option_id, value);
  }
}

function getKey(question_id, option_id) {
  return question_id + "_" + option_id;
}

function parseKey(key) {
  const parts = key.split("_");
  const question_id = parts[0];
  const option_id = parts[1];
  return { question_id, option_id };
}

function handleSubmit() {
  for (const id of Object.keys(questions)) {
    const question = questions[id];
    calculateTotal(id);
    if (question.total > 0 && question.total != 30) {
      return alert(
        "Please make sure that for all statements the total comes on to excatly 30 points."
      );
    }
  }

  document.myForm.submit();
}

let saving = false;

function handleSave() {
  if (saving) {
    return;
  }

  const data = [];

  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j < 6; j++) {
      const optionId = String.fromCharCode(A + j);
      const key = getKey(i, optionId);
      const value = localStorage.getItem(key);
      if (value) {
        data.push({ key, value });
      }
    }
  }

  fetch("/creativity/CM/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(() => {
    alert("Save successful");
    saving = false;
  });
}

document.myForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

populateTotals();
