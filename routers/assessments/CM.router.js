const { KeyValueResponse, UserScore, UserAssessment } = require("../../models");

const questions = require("../../resources/json/cm.questions.json");
const Motives = require("../../resources/json/CM.motives.json");

const router = require("express").Router();

const score_description =
  "Your preference measures the strength of 6 competing motives, namely, safety motive, achievement/competence motive, status/power/prominence motive, pioneering and innovating motive, altruistic/conscientiousness motive, and self-actualization motive.";

router.get("/", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;

  const user_answers = await KeyValueResponse.find({ assessment_key });

  const keyvalues = user_answers.map((answer) => {
    return {
      key: answer.key,
      value: answer.value,
    };
  });

  res.render("assessments/CM.questions.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: keyvalues,
  });
});

router.post("/submit", async (req, res) => {
  const user_id = req.user._id;
  const user_assessment = res.locals.user_assessment;

  const {
    assessment_key,
    assessment_id,
    assessment_name,
    assessment_plot_type,
  } = user_assessment;

  console.log(req.body);

  const module_scores = [];
  let index = 0;

  for (const motive of Motives) {
    module_scores[index++] = {
      _id: motive._id,
      name: motive.name,
      score: 0,
    };
  }

  const A = "A".charCodeAt(0);

  for (let i = 1; i <= 10; i++) {
    for (let j = 0; j <= 6; j++) {
      const module = module_scores[j];
      const optionId = String.fromCharCode(A + j);
      const key = `${i}_${optionId}`;
      const value = req.body[key];

      if (value) {
        module.score += parseInt(value);
      }
    }
  }

  console.log(module_scores);

  let total = 0;

  for (const module_score of module_scores) {
    let score = module_score.score;
    score -= 10;
    score /= 3;
    total += score;
    module_score.score = score;
  }

  for (const module_score of module_scores) {
    module_score.score = Math.round((module_score.score * 100) / total);
  }

  await UserScore.create({
    user_id,
    assessment_name,
    assessment_id,
    assessment_key,
    plot_type: assessment_plot_type,
    module_scores,
  });

  await UserAssessment.updateOne(
    {
      user_id,
      assessment_key,
    },
    {
      $set: {
        completed: true,
      },
      $inc: {
        attempts: 1,
      },
    }
  );

  res.redirect("/users/scores");
});

router.post("/save", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;
  // console.log(req.body);

  for (const answer of req.body) {
    await KeyValueResponse.updateOne(
      { user_id, key: answer.key, assessment_key },
      { value: answer.value },
      { upsert: true }
    );
  }

  res.send("OK");
});
router.get("/report", async (req, res) => {});

module.exports = router;
