const { UserScore, UserAnswer, Answer, Module } = require("../models");

module.exports = async function (req, res) {
  const user_id = req.user._id;
  const user_assessment = res.locals.user_assessment;
  const assessment_key = user_assessment.assessment_key;

  const modules = await Module.find({ assessment_key }).lean();
  const answers = await Answer.find({ assessment_key }).lean();
  const user_answers = await UserAnswer.find({
    user_id,
    assessment_key,
  }).lean();

  const module_score_map = [];

  for (const user_answer of user_answers) {
    const answer = answers.find(function (answer) {
      return (
        answer.question_id == user_answer.question_id &&
        answer.choice == user_answer.choice
      );
    });

    if (!module_score_map[user_answer.module_id]) {
      module_score_map[user_answer.module_id] = {
        _id: user_answer.module_id,
        name: user_answer.module_name,
        score: 0,
      };
    }

    module_score_map[user_answer.module_id].score += answer.points;
  }

  const module_scores = [];

  for (const module_id of Object.keys(module_score_map)) {
    const score_data = module_score_map[module_id];

    const current_module = modules.find(function (module) {
      return module._id == score_data._id;
    });

    if (current_module) {
      const maxScore =
        current_module.no_questions * current_module.scale_factor;

      if (maxScore != 0) {
        const scaled_score = Math.round((100 * score_data.score) / maxScore);
        console.log(
          `scaled score for module ${score_data.name} from ${score_data.score} to ${scaled_score}...`
        );
        score_data.score = scaled_score;
      }
    }

    module_scores.push(score_data);
  }

  const user_score = await UserScore.create({
    user_id,
    assessment_key,
    module_scores,
    assessment_id: user_assessment.assessment_id,
    assessment_name: user_assessment.assessment_name,
    plot_type: user_assessment.assessment_plot_type,
  });

  console.log(user_score);

  user_assessment.attempts = (user_assessment.attempts || 0) + 1;
  user_assessment.completed = true;
  await user_assessment.save();

  res.redirect("/users/scores");
};
