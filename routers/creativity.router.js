const router = require("express").Router();
const {
  UserAssessment,
  CPQuestion,
  CMQuestion,
  CTQuestion,
  CTUserAnswer,
} = require("../models");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const {
  submitCPForm,
  submitCMForm,
  submitCTForm,
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

async function getCTQuestions(req, res) {
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
}

router.get("/questions", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await getCPQuestions(req, res);
    case "CM":
      return await getCMQuestions(req, res);
    case "CT":
      return await getCTQuestions(req, res);
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
      return await submitCTForm(req, res);
    default:
      throw new Error("Assessment not found...");
  }
});

module.exports = router;
