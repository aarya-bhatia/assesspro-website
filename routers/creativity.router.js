const router = require("express").Router();
const {
  UserAssessment,
  CPQuestion,
  UserScore,
  Assessment,
} = require("../models/index.js");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const { CMQuestion } = require("../models");

async function scoreCM(req, res) {}

async function scoreCP(req, res) {}

router.get("/enroll/:key", async (req, res) => {
  const key = req.params.key;
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

router.get("/personality/questions", async (req, res) => {
  const questions = await CPQuestion.find({});

  res.render("questions/creativity.personality.ejs", {
    ...res.locals,
    user: req.user,
    questions,
  });
});

router.get("/motivation/questions", async (req, res) => {
  const questions = await CMQuestion.find({});

  res.render("questions/creativity.personality.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: [],
  });
});

router.get("/temperament/questions", async (req, res) => {});

router.post("/personality/submit", async (req, res) => {
  console.log(req.body);
  const questions = await CPQuestion.find({});
  console.log(questions.splice(1, 5));

  let total = 0;
  let attempted = 0;

  const scale = {
    1: 0,
    2: 0.2,
    3: 0.4,
    4: 0.6,
    5: 0.8,
    6: 1,
  };

  const module_scores = {};

  for (const question of questions) {
    const id = question._id;
    const module_id = question.module_id;
    const module_name = question.module_name;
    if (req.body[id]) {
      const answer = parseInt(req.body[id]);
      const scale_factor = scale[answer] || 0;
      const points = answer * scale_factor;

      if (module_scores[module_id]) {
        module_scores[module_id].score += points;
      } else {
        module_scores[module_id] = {
          _id: module_id,
          name: module_name,
          score: points,
        };
      }

      attempted++;
    }
  }

  const module_score_array = [];

  for (const key of Object.keys(module_scores)) {
    module_scores[key].score /= 4;
    module_scores[key].score *= 100;
    module_score_array.push({ ...module_scores[key] });
  }

  const completed = attempted == questions.length;

  const user_id = req.user._id;
  const assessment = await Assessment.findOne({ key: "CP" });

  const userScore = await UserScore.create({
    user_id,
    assessment_name: assessment.name,
    assessment_id: assessment._id,
    assessment_key: assessment.key,
    plot_type: assessment.plot_type,
    module_scores: module_score_array,
  });

  await UserAssessment.updateOne(
    {
      user_id: req.user._id,
      assessment_id: assessment._id,
    },
    {
      $set: {
        completed,
      },
      $inc: {
        attempts: 1,
      },
    }
  );

  res.redirect("/users/profile");
});

router.post("/motivation/submit", async (req, res) => {});

router.post("/temperament/submit", async (req, res) => {});
module.exports = router;
