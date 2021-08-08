const router = require("express").Router;

router.get("/questions", async (req, res) => {
  const questions = await LeftRightStatement.find({ assessment_key: "CE" });
  const userAnswers = [];

  res.render("questions/creativity.environment.ejs", {
    ...res.locals,
    user_id: req.user._id,
    questions,
    userAnswers,
  });
});

router.post("/submit", async (req, res) => {});
router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
