const { UserAnswer, UserScore, UserModule, Answer } = require("../models");

module.exports.scoreAssessment = async function (req, res) {
  const { assessment_id, user_assessment } = res.locals;
  const user_id = req.user._id;
  const result = await score(user_id, assessment_id);

  console.log("Assessment Result ", result);

  const { assessment_name, assessment_key, assessment_plot_type } =
    user_assessment;

  await UserScore.create({
    user_id,
    assessment_id,
    assessment_name,
    assessment_key,
    plot_type: assessment_plot_type,
    module_scores: result,
    date: new Date(),
  });

  user_assessment.attempts = (user_assessment.attempts || 0) + 1;
  user_assessment.completed = true;

  await user_assessment.save();

  res.redirect("/users/profile");
};

// Scores the assessment and returns the module scores array
async function score(user_id, assessment_id) {
  return new Promise(async (resolve) => {
    let result = [];

    // Get user modules
    const userModules = await UserModule.find({ user_id, assessment_id });

    for (const userModule of userModules) {
      const { module_key, module_name, module_id, no_questions, scale_factor } =
        userModule;

      // Get user answers for current module
      const userAnswers = await UserAnswer.find({ user_id, module_id });

      // Module Score
      let score = 0;

      for (const userAnswer of userAnswers) {
        const { question_id, choice } = userAnswer;

        // console.log(userAnswer);

        // Get points for current answer
        const answer = await Answer.findOne({ question_id, choice });
        const { points } = answer;
        score += points;
      }

      // Scale module score
      const scaled_score = (score / (no_questions * scale_factor)) * 100;
      console.log("Scaled Score from", score, " to ", scaled_score);

      // Add the score to result
      result.push({
        module_key,
        module_id,
        name: module_name,
        score: Math.floor(scaled_score),
      });
    }

    resolve(result);
  });
}
