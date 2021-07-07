const router = require("express").Router();

const CP_scale = 6;

const CP_modules = [
  "Hunger for knowing",
  "Sensitivity",
  "Complexity",
  "Venturing",
  "Independence and Courage",
  "Reality Contact",
  "Self-sufficiency",
];

const CP_questions = [
  {
    left: "I do not have an unhealthy curiosity and I don't like to show my ignorance by asking questions.",
    right:
      "My curiosity is insatiable; I want to know about everything and I am constantly asking questions.",
  },
];

router.get("/questions/CP", (req, res) => {
  res.render("creativity/CP.Questions.ejs", {
    loggedIn: res.locals.loggedIn,
    questions: CP_questions,
    scale: CP_scale,
    modules: CP_modules,
  });
});

router.post("/submit/CP", async (req, res) => {});

module.exports = router;
