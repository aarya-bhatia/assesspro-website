const { Question, UserAnswer, UserModule } = require("../models");

/*
 * Input names in the module form should be set to the question ids.
 * Input values in the module form should be set to the choice key.
 */
module.exports.saveAnswers = async function (req, res) {
  const user_id = req.user._id;

  const { assessment_id } = res.locals;

  const { user_module_id } = req.params;

  const user_module = await UserModule.findById(user_module_id);

  const { module_id, module_name, module_key } = user_module;

  const questions = await Question.find({ module_id });

  let attempted = 0;

  questions.map(async (question) => {
    const { _id, choices } = question;

    // Get form input value
    const choice = req.body[_id];

    if (choice) {
      attempted++;

      // Find the value of the selected choice
      const { text } = choices.find(({ _id }) => _id == choice);

      if (text) {
        // Update or create answer for current question
        await UserAnswer.updateOne(
          {
            user_id,
            question_id: _id,
            module_id,
            module_key,
            module_name,
          },
          {
            choice,
            value: text,
          },
          { upsert: true }
        );
      }
    }
  });

  user_module.no_attempted = attempted;
  user_module.time_spent += parseInt(req.body.time_spent) || 0;

  if (attempted === user_module.no_questions) {
    user_module.status = "Completed";
  } else {
    user_module.status = "Pending";
  }

  await user_module.save();

  res.redirect("/forms/" + assessment_id);
};
