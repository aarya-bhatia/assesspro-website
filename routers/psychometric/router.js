const { Assessment } = require("../../models");
const { scoreAssessment } = require("../controller/scorer");
const { formatTimeSpent, shuffleOrder } = require("../controller/util");
const { Module, UserModule, Question } = require("../models");
const {
  updateOrCreateAnswer,
  updateUserModuleOnSubmit,
} = require("./api/user");

const router = require("express").Router({ mergeParams: true });

/**
 * base url: /psychometric/:key
 */

// Assessment Home Page
router.get("/", async (req, res) => {
  const { assessment_id, user_assessment } = res.locals;
  const { assessment_description, assessment_name } = user_assessment;
  const user_id = req.user._id;
  let user_modules = await UserModule.find({ user_id, assessment_id });

  if (!user_modules) {
    console.log("Initializing user modules...");
    const modules = await Module.find({ assessment_id });

    for (const module of modules) {
      const usermodule = await UserModule.create({
        user_id,
        assessment_id,
        module_id: module._id,
        module_name: module.name,
        no_questions: module.no_questions,
        no_attempted: 0,
        time_spent: 0,
        scale_factor: module.scale_factor,
        status: "Pending",
      });

      user_modules.push(usermodule);
    }
  }

  res.render("psychometric/modules.ejs", {
    ...res.locals,
    assessment_id,
    user_modules,
    title: assessment_name,
    description: assessment_description,
    formatTimeSpent,
  });
});

// Module Questions
router.get("/questions", async (req, res) => {
  const umid = req.query.umid;

  if (!umid) {
    return res.redirect("/:key");
  }

  const user_id = req.user._id;

  const user_module = await UserModule.findById(user_module_id);
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
    assessment_id: user_module.assessment_id,
    questions,
    user_answers,
    user_module,
    formatTimeSpent,
  });
});

// Sumbit Module
/*
 * Input names in the module form should be set to the question ids.
 * Input values in the module form should be set to the choice id.
 */
router.post("/submit", async function (req, res) {
  const { user_module_id } = req.body;

  const user_module = await UserModule.findById(user_module_id);
  const module_id = user_module.module_id;

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

  const user_assessment = await res.locals.user_assessment;

  res.redirect(user_assessment.redirectURL);
});

// Submit Assessment
router.post("/score", scoreAssessment);

module.exports = router;

// UNCOMMENT THIS TO USE REDIS.
// const questions = await getOrSetRedisCache(
//   RedisClient,
//   `questions?module_id=${module_id}`,
//   async () => {
//     return await Question.find({ module_id });
//   }
// );
