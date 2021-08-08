const {
  KeyValueResponse,
  UserScore,
  UserAssessment,
  Assessment,
} = require("../../models");

const questions = require("../../resources/json/cm.questions.json");

const router = require("express").Router();

const score_description =
  "Your preference measures the strength of 6 competing motives, namely, safety motive, achievement/competence motive, status/power/prominence motive, pioneering and innovating motive, altruistic/conscientiousness motive, and self-actualization motive.";

router.get("/questions", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_answers = await KeyValueResponse.find({ assessment_key });

  res.render("creativity/CM.questions.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: user_answers.map((answer) => {
      return {
        key: answer.key,
        value: answer.value,
      };
    }),
  });
});

router.post("/submit", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;

  Assessment.findOne({ key: assessment_key }).then(async (assessment) => {
    const module_scores = [];
    let index = 0;

    for (const module of assessment.modules) {
      module_scores[index++] = {
        _id: module._id,
        name: module.name,
        score: 0,
      };
    }

    const A = "A".charCodeAt(0);

    for (let i = 1; i <= 10; i++) {
      for (let j = 0; j <= 6; j++) {
        const code = `${i}${String.fromCharCode(A + j)}`;
        if (req.body[code]) {
          const points = parseInt(req.body[code]) || 0;
          module_scores[j].score += points;
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

    const userScore = await UserScore.create({
      user_id: req.user._id,
      assessment_name: assessment.name,
      assessment_id: assessment._id,
      assessment_key: assessment.key,
      plot_type: assessment.plot_type,
      module_scores,
    });

    await UserAssessment.updateOne(
      {
        user_id: req.user._id,
        assessment_id: assessment._id,
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

    res.redirect("/users/profile");
  });
});

router.post("/save", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;
  console.log(req.body);

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
