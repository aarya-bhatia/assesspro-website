const { formatTimeSpent, shuffleOrder } = require("../../controller/util");
const {
  Module,
  UserModule,
  Question,
  UserAnswer,
  Assessment,
} = require("../../models");
const router = require("express").Router({ mergeParams: true });

// Assessment Home Page
router.get("/", async (req, res) => {
  const user_id = req.user._id;
  const { user_assessment } = res.locals;
  const { assessment_id, assessment_name } = user_assessment;
  const assessment = await Assessment.findById(assessment_id);
  const user_modules = await UserModule.find({ user_id, assessment_id });

  res.render("psychometric/modules.ejs", {
    ...res.locals,
    user_modules,
    title: assessment_name,
    description: assessment.description,
    formatTimeSpent,
  });
});

// Module Questions
router.get("/questions", async (req, res) => {
  const { user_assessment } = res.locals;

  const umid = req.query.umid;

  if (!umid) {
    return res.redirect(user_assessment.assessment_url);
  }

  const user_id = req.user._id;

  const user_module = await UserModule.findById(umid);
  const module_id = user_module.module_id;

  const module = await Module.findById(module_id);
  const questions = await Question.find({ module_id });

  const user_answers = await UserAnswer.find({
    user_id,
    module_id,
  });

  const title = "Module: " + module.name;

  questions.sort(shuffleOrder);

  res.render("psychometric/questions.ejs", {
    ...res.locals,
    title,
    description: module.description,
    instructions: module.instructions,
    questions,
    user_answers,
    user_module,
    formatTimeSpent,
  });
});

// Sumbit Module
// Input names in the module form should be set to the question ids.
// Input values in the module form should be set to the choice id.
router.post("/submit", async function (req, res) {
  const { umid } = req.body;
  const user_id = req.user._id;
  const user_module = await UserModule.findById(umid);
  const module_id = user_module.module_id;
  const module_name = user_module.module_name;

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

      const update = {};

      if (choice) {
        update.choice = choice;
      }
      if (text) {
        update.value = text;
      }

      await UserAnswer.updateOne(
        {
          user_id,
          question_id: _id,
          module_id,
          module_name,
        },
        update,
        { upsert: true }
      );
    }
  });

  await UserModule.updateOne(
    {
      _id: user_module._id,
    },
    {
      $set: {
        no_attempted: attempted,
        status: attempted == user_module.no_questions ? "Completed" : "Pending",
      },
      $inc: {
        time_spent: Number(req.body.time_spent) || 0,
      },
    }
  );

  const user_assessment = await res.locals.user_assessment;

  res.redirect(user_assessment.assessment_url);
});

// Submit Assessment
router.get("/score", require("../../controller/psychometric.scorer"));

module.exports = router;

// UNCOMMENT THIS TO USE REDIS.
// const questions = await getOrSetRedisCache(
//   RedisClient,
//   `questions?module_id=${module_id}`,
//   async () => {
//     return await Question.find({ module_id });
//   }
// );
