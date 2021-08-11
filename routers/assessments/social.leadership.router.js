const router = require("express").Router();

const {
  RatingStatement,
  UserResponse,
  UserScore,
  UserAssessment,
} = require("../../models");

const options = [
  "I do not have this trait",
  "I rarely exhibit this trait",
  "I fairly frequently exhiit this trait",
  "I exhibit this trait quite often",
  "I exhibit this trait most of the time",
];

router.get("/", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;

  const questions = await RatingStatement.find({ assessment_key });

  const user_answers = await UserResponse.find({
    assessment_key,
    user_id,
  });

  res.render("assessments/rating.questions.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    options,
    user_answers,
  });
});

router.post("/submit", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const {
    assessment_key,
    assessment_name,
    assessment_id,
    assessment_plot_type,
  } = user_assessment;
  const user_id = req.user._id;

  const questions = await RatingStatement.find({ assessment_key });

  const category_scores = {};

  let attempted = 0;

  for (const question of questions) {
    const _id = question._id;
    const category_id = question.category_id;
    const category_name = question.category_name;

    if (req.body[_id]) {
      attempted++;

      const value = parseInt(req.body[_id]);

      // save answer
      await UserResponse.updateOne(
        { assessment_key, user_id, question_id: _id, category_id },
        { value },
        { upsert: true }
      );

      // update points for module
      if (!category_scores[category_id]) {
        category_scores[category_id] = {
          category_id,
          category_name,
          score: 0,
        };
      }

      category_scores[category_id].score += value;
    }
  }

  const module_scores = [];

  // convert scores to array
  for (const key of Object.keys(category_scores)) {
    module_scores.push({
      _id: category_scores[key].category_id,
      name: category_scores[key].category_name,
      score: category_scores[key].score,
    });
  }

  // scaling
  for (const module_score of module_scores) {
    let score = module_score.score;
    score /= 5;
    score -= 1;
    score *= 25;
    module_score.score = Math.round(score);
  }

  const completed = attempted == questions.length;

  const userScore = await UserScore.create({
    user_id,
    module_scores,
    assessment_name,
    assessment_id,
    assessment_key,
    plot_type: assessment_plot_type,
  });

  // console.log(userScore);

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

  const questions = await RatingStatement.find({ assessment_key });

  // console.log(req.body);

  for (const question of questions) {
    const _id = question._id;
    const category_id = question.category_id;

    if (req.body[_id]) {
      const value = parseInt(req.body[_id]);

      // save answer
      await UserResponse.updateOne(
        { assessment_key, user_id, question_id: _id, category_id },
        { value },
        { upsert: true }
      );
    }
  }

  res.send("OK");
});
router.get("/report", async (req, res) => {});

module.exports = router;
