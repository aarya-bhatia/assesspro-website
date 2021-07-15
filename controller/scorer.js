module.exports = {
  scoreAssessment,
};

const { getCPAssessmentId } = require("../config/globals");
const { CPUserAnswer } = require("../models");
const { getPointsForAnswerChoice } = require("./api/answers");

const {
  getUserModules,
  getUserAnswersForModule,
  createUserScore,
  updateUserAssessmentOnCompletion,
} = require("./api/user");

function scaleModuleScore(score, { no_questions, scale_factor }) {
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

  let module_scores = [];

  if (assessment_id == (await getCPAssessmentId())) {
    module_scores = await scoreCP(user_id, assessment_id);
  } else {
    module_scores = await score(user_id, assessment_id);
  }

  console.log("Assessment Result ", module_scores);

  await createUserScore(user_id, user_assessment, module_scores);
  await updateUserAssessmentOnCompletion(user_assessment);

  res.redirect("/users/profile");
}

// Scores the assessment and returns the module scores array
async function score(user_id, assessment_id) {
  return new Promise(async (resolve) => {
    let result = [];

    // Get user modules
    const userModules = await getUserModules(user_id, assessment_id);

    for (const userModule of userModules) {
      const { module_id, module_name } = userModule;

      let score = 0;

      // Get user answers for current module
      const userAnswers = await getUserAnswersForModule(user_id, module_id);

      // Sum up total points for module answers.
      for (const { question_id, choice } of userAnswers) {
        score += await getPointsForAnswerChoice(question_id, choice);
      }

      const scaled_score = scaleModuleScore(score, userModule);
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

// Scores the assessment and returns the module scores array
async function scoreCP(user_id, assessment_id) {
  return new Promise(async (resolve) => {
    console.log("Scoring CP...");
    let result = [];

    // Get user modules
    const userModules = await getUserModules(user_id, assessment_id);

    for (const userModule of userModules) {
      const { module_id, module_name } = userModule;

      let score = 0;

      // Get user answers for current module
      const userAnswers = await CPUserAnswer.find({ user_id, module_id });

      // Sum up total points for module answers.
      for (const { value } of userAnswers) {
        score += value;
      }

      const scaled_score = scaleModuleScore(score, userModule);
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
