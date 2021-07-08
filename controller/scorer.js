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

function scaleModuleScore(score, module) {
  const maxScore = module.no_questions * module.scale_factor;
  const scaledScore = (100 * score) / maxScore;
  return Math.floor(scaledScore);
}

async function scoreAssessment(req, res) {
  const { assessment_id, user_assessment } = res.locals;
  const user_id = req.user._id;

  const module_scores = await score(user_id, assessment_id);

  await createUserScore(user_id, user_assessment, module_scores);
  await updateUserAssessmentOnCompletion(user_assessment);

  console.log("Assessment Result ", module_scores);

  res.redirect("/users/profile");
}

// Scores the assessment and returns the module scores array
async function score(user_id, assessment_id) {
  return new Promise(async (resolve) => {
    let result = [];

    // Get user modules
    const userModules = await getUserModules(user_id, assessment_id);

    for (const userModule of userModules) {
      // Get user answers for current module
      const userAnswers = await getUserAnswersForModule(
        user_id,
        userModule.module_id
      );

      // Module Score
      let score = 0;

      for (const userAnswer of userAnswers) {
        score += await getPointsForAnswerChoice(
          userAnswer.question_id,
          userAnswer.choice
        );
      }

      // Scale module score
      const scaled_score = scaleModuleScore(score, userModule);
      console.log("Scaled Score from", score, " to ", scaled_score);

      // Add the score to result
      result.push({
        module_id: userModule.module_id,
        name: userModule.module_name,
        score: scaled_score,
      });
    }

    resolve(result);
  });
}
