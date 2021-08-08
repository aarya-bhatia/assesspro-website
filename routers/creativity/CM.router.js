const router = require("express").Router;

router.get("/questions", async (req, res) => {
  const questions = await CMQuestion.find({});

  questions.shift();

  res.render("questions/creativity.motivation.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: [],
  });
});
router.post("/submit", async (req, res) => {});
router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
