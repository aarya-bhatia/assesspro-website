const router = require("express").Router();
const { CMQuestion } = require("../models");

async function scoreCM(req, res) {}

router.get("/:key/questions", async (req, res) => {
  const { key } = req.params;

  // fetch questions
  const questions = await CMQuestion.find({});

  switch (key) {
    case CM:
      return res.render("forms/cm.moduleForm.ejs", {
        ...res.locals,
        user: req.user,
        questions,
      });
    default:
      throw new Error("Assessment not found");
  }
});

router.post("/:key/submit", async (req, res) => {});

module.exports = router;
