/*
 * Input names in the module form should be set to the question ids.
 * Input values in the module form should be set to the choice id.
 */
const { fetchQuestionsForModule } = require("./api/answers");
const {
  fetchUserModuleById,
  updateOrCreateAnswer,
  updateUserModuleOnSubmit,
} = require("./api/user");

module.exports.saveAnswers = async function (req, res) {
  const { assessment_id } = res.locals;
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
