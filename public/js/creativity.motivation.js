console.log("Hello world");

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
  };

  for (const calcBtn of calculateButtons) {
    if (calcBtn.dataset.questionId == id) {
      questions[id].calculateButton = calcBtn;
      break;
    }
  }

  for (const inputField of inputFields) {
    if (inputField.dataset.questionId == id) {
      questions[id].inputFields.push(inputField);
    }
  }

  for (const span of totalSpans) {
    if (span.dataset.questionId == id) {
      questions[id].totalSpan = span;
      break;
    }
  }

  questions[id].calculateButton.addEventListener("click", () => {
    let total = 0;
    for (const inputField of questions[id].inputFields) {
      total += parseInt(inputField.value) || 0;
    }
    questions[id].totalSpan.innerHTML = total;
  });

  for (const inputField of questions[id].inputFields) {
    inputField.addEventListener("change", () => {
      localStorage.setItem(
        "cm_" + id + inputField.dataset.optionId,
        inputField.value
      );
    });
  }
}

const A = "A".charCodeAt(0);

//populate previous values
for (let i = 1; i <= 10; i++) {
  for (let j = 0; j < 6; j++) {
    const optionId = String.fromCharCode(A + j);
    const key = "cm_" + i + optionId;
    if (localStorage.getItem(key)) {
      const inputFields = questions[i].inputFields;
      for (const inputField of inputFields) {
        if (inputField.dataset.optionId == optionId) {
          inputField.value = localStorage.getItem(key);
          break;
        }
      }
    }
  }
}
