const {
  LeftRightStatement,
  UserResponse,
  UserScore,
  UserAssessment,
} = require("../../models");
const router = require("express").Router();

router.get("/questions", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const questions = await LeftRightStatement.find({
    assessment_key: user_assessment.assessment_key,
  });
  const user_answers = await UserResponse.find({
    assessment_key: user_assessment.assessment_key,
    user_id: req.user._id,
  });

  res.render("questions/CP.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers,
  });
});

router.post("/save", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const user_id = req.user._id;

  let c = 0;

  // req.body: [{ question_id, value }]

  for (const question of req.body) {
    const question_id = question.question_id;
    const value = question.value;
    c++;
    await UserResponse.updateOne(
      {
        assessment_key: user_assessment.assessment_key,
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

  console.log(c + " answers saved...");

  res.redirect("/creativity/personality/questions");
});

router.post("/submit", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const {
    assessment_key,
    assessment_name,
    assessment_id,
    assessment_plot_type,
  } = user_assessment;
  const questions = await LeftRightStatement.find({ assessment_key });

  let attempted = 0;

  const scale = {
    1: 0,
    2: 20,
    3: 40,
    4: 60,
    5: 80,
    6: 100,
  };

  const category_scores = {};

  for (const question of questions) {
    const id = question._id;
    const category_id = question.category_id;
    const category_name = question.category_name;

    if (req.body[id]) {
      const answer = parseInt(req.body[id]);
      const points = scale[answer] || 0;

      await UserResponse.updateOne(
        {
          assessment_key,
          user_id: req.user._id,
          question_id: id,
        },
        {
          value: answer,
        },
        {
          upsert: true,
        }
      );

      if (!category_scores[category_id]) {
        category_scores[category_id] = {
          _id: category_id,
          name: category_name,
          score: 0,
        };
      }

      category_scores[category_id].score += points;

      attempted++;
    }
  }

  // console.log(category_scores);

  const module_scores = [];

  for (const key of Object.keys(category_scores)) {
    let { score } = category_scores[key];
    score = Math.round(score / 4);
    category_scores[key].score = score;
    module_scores.push({ ...category_scores[key] });
  }

  const completed = attempted == questions.length;

  const user_id = req.user._id;

  const userScore = await UserScore.create({
    user_id,
    module_scores,
    assessment_name,
    assessment_id,
    assessment_key,
    plot_type: assessment_plot_type,
  });

  await UserAssessment.updateOne(
    {
      user_id: req.user._id,
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

router.get("/report/:userscoreid", async (req, res) => {});

module.exports = router;
