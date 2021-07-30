const router = require("express").Router();
const { UserAssessment, CPQuestion } = require("../models/index.js");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const { CMQuestion } = require("../models");
const {
  submitCPForm,
  submitCMForm,
} = require("../controller/creativity.scorer");

router.get("/enroll", async (req, res) => {
  const key = res.locals.key;
  const assessment = await fetchAssessmentByKey(key);
  const user_id = req.user._id;

  let userAssessment = await UserAssessment.findOne({
    user_id,
    assessment_id: assessment._id,
  });

  if (!userAssessment) {
    userAssessment = await createUserAssessment(req.user, assessment);
    console.log("User is enrolled in " + assessment.key);
  }

  return res.redirect("/creativity/" + key + "/questions");
});

async function getCPQuestions(req, res) {
  const questions = await CPQuestion.find({});

  res.render("questions/creativity.personality.ejs", {
    ...res.locals,
    user: req.user,
    questions,
  });
}

async function getCMQuestions(req, res) {
  const questions = await CMQuestion.find({});

  questions.shift();

  res.render("questions/creativity.motivation.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: [],
  });
}

router.get("/questions", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await getCPQuestions(req, res);
    case "CM":
      return await getCMQuestions(req, res);
    case "CT":
      return await res.send("Todo");
    default:
      throw new Error("Assessment not found...");
  }
});

router.post("/submit", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await submitCPForm(req, res);
    case "CM":
      return await submitCMForm(req, res);
    case "CT":
      return await res.send("Todo");
    default:
      throw new Error("Assessment not found...");
  }
});

module.exports = router;
