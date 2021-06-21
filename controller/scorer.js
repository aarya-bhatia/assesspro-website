const {
  UserAnswer,
  Question,
  UserAssessment,
  UserScore,
  UserModule,
} = require("../models");

const LOCAL_DEBUG = false;

//
// This function accepts an assessment_id through the request url.
// This function creates the scores for this assessment using the answers
// provided by the user. Assumes the assessment was completed by the user.
// The user cannot undo the result, but can retake the assessment to generate
// new scores. The scoring formula is simple, it fetches the points assigned to
// each choice in each question and udpates the score of the module which that
// question belongs to. It combines all module scores of that assesment into a
// neat object.
///
module.exports.scoreAssessment = async function (req, res) {
  const { assessment_id, user_assessment } = res.locals;
  const user_id = req.user._id;

  // console.log(assessment_id, user_id)

  const user_modules = await UserModule.find({ user_id, assessment_id });
  const result = await score_all_modules(user_modules);

  console.log("Result: ", result);

  const { assessment_name, assessment_key, assessment_plot_type } =
    user_assessment;

  // A score object is created each time the user submits the form,
  // so as to have access to previous attempt scores. The module scores
  // contains the data required to make the plots for the assessment
  // on the client, using the chartjs library.
  const assessment_score = await UserScore.create({
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

  // console.log('Updated user assessment stats')
  // console.log('Finished Scoring: ', assessment_score)

  // res.json(assessment_score)
  res.redirect("/users/profile");
};

async function score_all_modules(user_modules) {
  return new Promise(async function (res) {
    let result = [];

    // Get result for each module synchronously
    for (const user_module of user_modules) {
      const {
        module_name,
        module_id,
        user_id,
        no_questions,
        module_type,
        module_key,
      } = user_module;

      // Get the module answers
      const user_answers = await UserAnswer.find({
        user_id,
        module_id,
      });

      // Get the module score
      const module_score = await get_module_score(user_answers);

      const module_max_score =
        module_type == "Subjective" ? no_questions * 5 : no_questions * 1;
      const module_score_scaled = (module_score * 100) / module_max_score;

      console.log(
        "Scaled Score from",
        module_score,
        " to ",
        module_score_scaled
      );

      if (LOCAL_DEBUG)
        console.log(
          "[score_all_modules]: adding score to result",
          module_score_scaled
        );

      // Add to { module name, module score } to result set
      result.push({
        module_key,
        module_id,
        name: module_name,
        score: Math.floor(module_score_scaled),
      });
    }
    res(result);
  });
}

// Function to score the answers for one module.
// From the user answer collection, it fetches all the answers
// for the module. Then as it loops through the answers,
// it fetches each question from the bank and
// retrieves the points assigned to the answer choice.

async function get_module_score(user_answers) {
  return new Promise(async function (res) {
    let score = 0;
    for (const user_answer of user_answers) {
      const choice = await get_selected_choice(user_answer);
      if (LOCAL_DEBUG)
        console.log("[get_module_score]: Points Awarded: ", choice.points);
      score += choice.points;
    }
    if (LOCAL_DEBUG)
      console.log("[get_moule_score]: Module Total Points: ", score);
    res(score);
  });
}

// Function to retrieve the choice selected by the user for
// a question. The choice object contains the points
// assigned to that choice. The user score is updated with this value.
async function get_selected_choice(user_answer) {
  return new Promise(async function (res) {
    const { choice_id, question_id } = user_answer;
    const question = await Question.findById(question_id);
    const { choices } = question;
    const selected = choices.find(
      (choice) => choice._id.toString() == choice_id
    );
    if (LOCAL_DEBUG) console.log("[get_selected_choice] selected choice found");
    res(selected);
  });
}
