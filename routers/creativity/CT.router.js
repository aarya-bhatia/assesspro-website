const {
  RatingStatement,
  UserResponse,
  UserScore,
  UserAssessment,
} = require("../../models");

const router = require("express").Router();

const options = [
  "Does Not Apply",
  "Marginally",
  "Modest Extent",
  "Substantial",
  "Great Extent",
  "Fully Agree",
];

router.get("/questions", async (req, res) => {
  const user_assessment = res.locals.user_assessment;
  const { assessment_key } = user_assessment;
  const user_id = req.user._id;

  const questions = await RatingStatement.find({ assessment_key });

  const user_answers = await UserResponse.find({
    assessment_key,
    user_id,
  });

  res.render("creativity/CT.questions.ejs", {
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

  let total = 0;

  // scaling and total
  for (const module_score of module_scores) {
    let score = module_score.score;
    score /= 5;
    score -= 1;
    score *= 20;
    total += score;
    module_score.score = score;
  }

  // conversion to %
  for (const module_score of module_scores) {
    module_score.score = Math.round((100 * module_score.score) / total);
  }

  const completed = attempted == questions.length;

  await UserScore.create({
    user_id,
    module_scores,
    assessment_name,
    assessment_id,
    assessment_key,
    plot_type: assessment_plot_type,
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
router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
