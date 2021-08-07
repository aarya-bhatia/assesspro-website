const router = require("express").Router;

router.get("/questions", async (req, res) => {
  const questions = await CTQuestion.find({});
  const options = [
    "Does Not Apply",
    "Marginally",
    "Modest Extent",
    "Substantial",
    "Great Extent",
    "Fully Agree",
  ];

  const user_answers = await CTUserAnswer.find({ user_id: req.user._id });

  res.render("questions/creativity.temperament.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    options,
    user_answers,
  });
});

router.post("/submit", async (req, res) => {});
router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
