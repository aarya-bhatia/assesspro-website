const {
  LeftRightStatement,
  UserResponse,
  UserScore,
  UserAssessment,
} = require("../../models");

const router = require("express").Router();

const score_description =
  "If your score is below 50% for any trait of the environment, you need to go into high gear and try to change that trait.";

const traits = require("../../resources/json/ce.traits.json");

router.get("/", async (req, res) => {
  const { user_assessment } = res.locals;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;
  const questions = await LeftRightStatement.find({ assessment_key });
  const user_answers = await UserResponse.find({ user_id, assessment_key });

  res.render("assessments/CE.questions.ejs", {
    ...res.locals,
    user_id: req.user._id,
    questions,
    user_answers,
  });
});

router.post("/submit", async (req, res) => {
  const user_id = req.user._id;
  const user_assessment = res.locals.user_assessment;

  const {
    assessment_key,
    assessment_name,
    assessment_id,
    assessment_plot_type,
  } = user_assessment;

  const questions = await LeftRightStatement.find({ assessment_key });

  const table = {};

  let attempted = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 10; j++) {
      const question = questions[i * 10 + j];
      const id = question._id;
      const answer = parseInt(req.body[id]);
      const trait = traits[j];

      if (!table[trait._id]) {
        table[trait._id] = {
          _id: trait._id,
          name: trait.name,
          score: 0,
        };
      }

      if (answer) {
        attempted++;

        table[trait._id].score += answer;

        await UserResponse.updateOne(
          {
            assessment_key,
            user_id,
            question_id: id,
          },
          {
            value: answer,
          },
          {
            upsert: true,
          }
        );
      }
    }
  }

  const module_scores = [];

  for (const _id of Object.keys(table)) {
    table[_id].score = Math.round((table[_id].score * 10) / 4);
    module_scores.push({ ...table[_id] });
  }
  console.log(module_scores);

  const completed = attempted == questions.length;

  const userScore = await UserScore.create({
    user_id,
    module_scores,
    assessment_name,
    assessment_id,
    assessment_key,
    plot_type: assessment_plot_type,
    description: score_description,
  });

  await UserAssessment.updateOne(
    {
      user_id,
      assessment_key,
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

  res.redirect("/users/scores");
});

router.post("/save", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;

  // [{ question_id, value }]
  for (const question of req.body) {
    const question_id = question.question_id;
    const value = question.value;

    await UserResponse.updateOne(
      {
        assessment_key,
        user_id,
        question_id,
      },
      {
        value,
      },
      {
        upsert: true,
      }
    );
  }

  res.send();
});
router.get("/report", async (req, res) => {});

module.exports = router;
