const { saveAnswers } = require("../controller/user.answers");
const { scoreAssessment } = require("../controller/scorer");
const { formatTimeSpent } = require("../controller/util");
const { Question, UserAnswer, UserModule } = require("../models");
const router = require("express").Router();

// Get the module list page for an assessment
// GET /forms/:assessment_id
router.get("/", async (req, res) => {
  const { assessment_id, user_assessment } = res.locals;
  const { assessment_description, assessment_name } = user_assessment;

  const user_modules = await UserModule.find({
    user_id: req.user._id,
    assessment_id,
  });

  let description = assessment_description.replace("\\n", " ");

  res.render("forms/moduleList.ejs", {
    loggedIn: true,
    assessment_id,
    user_modules,
    title: assessment_name,
    description,
    formatTimeSpent,
  });
});

// Get form questions for user module
// Get /forms/:assessment_id/questions/:user_module_id
router.get("/questions/:user_module_id", async (req, res) => {
  const { assessment_id } = res.locals;
  const { user_module_id } = req.params;

  const user_module = await UserModule.findById(user_module_id);
  const { module_id, module_name } = user_module;

  const questions = await Question.find({ module_id });

  // console.log("QUESTIONS", questions)

  const prevAnswers = await UserAnswer.find({
    user_id: req.user._id,
    module_id,
  });
  const choices = prevAnswers.map(({ choice_id }) => choice_id);

  res.render("forms/moduleForm.ejs", {
    loggedIn: true,
    title: "Module: " + module_name,
    description: user_module.module_description || "",
    assessment_id,
    questions,
    user_answers: choices,
    user_module: user_module,
    formatTimeSpent,
  });
});

// Sumbit user's answers for the questions in a module
// POST /forms/:assessment_id/submit
router.post("/submit/:user_module_id", saveAnswers);

// Submit the form and score all questions
// POST /forms/:assessment_id/score
router.post("/score", scoreAssessment);

module.exports = router;
