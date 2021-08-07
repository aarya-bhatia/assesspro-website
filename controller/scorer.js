module.exports = {
  scoreAssessment,
};
const { getPointsForAnswerChoice } = require("./api/answers");
const {
  getUserModules,
  getUserAnswersForModule,
  createUserScore,
  updateUserAssessmentOnCompletion,
} = require("./api/user");

async function scaleModuleScore(score, { scale_factor, no_questions }) {
  const maxScore = no_questions * scale_factor;
  if (maxScore === 0) {
    return score;
  }
  const scaledScore = (100 * score) / maxScore;
  return Math.floor(scaledScore);
}

async function scoreAssessment(req, res) {
  const { assessment_id, user_assessment } = res.locals;
  const user_id = req.user._id;
  const module_scores = await score(user_id, assessment_id);
  console.log("Assessment Result ", module_scores);
  await createUserScore(user_id, user_assessment, module_scores);
  await updateUserAssessmentOnCompletion(user_assessment);
  res.redirect("/users/profile");
}

// Scores the assessment and returns the module scores array
async function score(user_id, assessment_id) {
  return new Promise(async (resolve) => {
    // stores the module scores
    let result = [];

    // Get user modules
    const userModules = await getUserModules(user_id, assessment_id);

    for (const userModule of userModules) {
      // Get the module id for current user module
      const { module_id, module_name } = userModule;

      let score = 0;

      // Get user answers for current module
      const userAnswers = await getUserAnswersForModule(user_id, module_id);

      // Sum up total points for module answers.
      for (const { question_id, choice } of userAnswers) {
        score += await getPointsForAnswerChoice(question_id, choice);
      }

      // Scale the score
      const scaled_score = await scaleModuleScore(score, userModule);
      console.log(`Scaled Score from ${score} to ${scaled_score}`);
      score = scaled_score;

      // update module scores
      result.push({
        _id: module_id,
        name: module_name,
        score,
      });
    }

    resolve(result);
  });
}
