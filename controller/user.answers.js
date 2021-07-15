const { getCPAssessmentId } = require("../config/globals");
const { CPUserAnswer } = require("../models");
const {
  fetchQuestionsForModule,
  fetchCPQuestionsForModule,
} = require("./api/answers");
const {
  fetchUserModuleById,
  updateOrCreateAnswer,
  updateUserModuleOnSubmit,
} = require("./api/user");

async function saveCPAnswers(req, res) {
  const assessment_id = await getCPAssessmentId();
  const { user_module_id } = req.params;
  const user_module = await fetchUserModuleById(user_module_id);
  const { module_id } = user_module;
  const questions = await fetchCPQuestionsForModule(module_id);

  let attempted = 0;

  console.log(req.body);

  answers = [];

  for (const question of questions) {
    const question_id = question._id;
    if (req.body[question_id]) {
      const value = parseInt(req.body[question_id]);
      attempted++;

      let answer = await CPUserAnswer.findOne({ _id: question_id });

      if (!answer) {
        answer = await CPUserAnswer.create({
          _id: question_id,
          user_id: req.user._id,
          module_id,
          value,
        });
      } else {
        answer.value = value;
        await answer.save();
      }

      answers.push(answer);
    }
  }

  console.log(answers);

  const time_spent = parseInt(req.body.time_spent) || 0;
  const status =
    attempted == user_module.no_questions ? "Completed" : "Pending";

  await updateUserModuleOnSubmit(
    user_module._id,
    attempted,
    status,
    time_spent
  );

  res.redirect("/forms/" + assessment_id);
}

/*
 * Input names in the module form should be set to the question ids.
 * Input values in the module form should be set to the choice id.
 */
module.exports.saveAnswers = async function (req, res) {
  console.log("Saving answers...", req.body);

  const { assessment_id } = res.locals;

  if (assessment_id == (await getCPAssessmentId())) {
    return saveCPAnswers(req, res);
  }

  console.log("Assessment Id: ", assessment_id);

  const { user_module_id } = req.params;

  const user_module = await fetchUserModuleById(user_module_id);
  const { module_id } = user_module;
  const questions = await fetchQuestionsForModule(module_id);

  let attempted = 0;

  questions.map(async (question) => {
    const { _id, choices } = question;

    // Get form input value
    const choice = req.body[_id];

    if (choice) {
      attempted++;

      // Find the value of the selected choice
      const { text } = choices.find(({ _id }) => _id == choice);

      await updateOrCreateAnswer(user_module, _id, choice, text);
    }
  });

  const time_spent = parseInt(req.body.time_spent) || 0;
  const status =
    attempted == user_module.no_questions ? "Completed" : "Pending";

  await updateUserModuleOnSubmit(
    user_module._id,
    attempted,
    status,
    time_spent
  );

  res.redirect("/forms/" + assessment_id);
};
