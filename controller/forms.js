const { formatTimeSpent, shuffleOrder } = require("../controller/util");
const { CPUserAnswer } = require("../models");

const {
  fetchQuestionsForModule,
  fetchCPQuestionsForModule,
} = require("./api/answers");
const { fetchAssessmentByKey } = require("./api/assessments");
const {
  getUserAnswersForModule,
  getUserModules,
  fetchUserModuleById,
} = require("./api/user");

const { getCPAssessmentId } = require("../config/globals");

module.exports = {
  // Get the module list page for an assessment
  async getModuleList(req, res) {
    const { assessment_id, user_assessment } = res.locals;
    const { assessment_description, assessment_name } = user_assessment;
    const user_id = req.user._id;

    const user_modules = await getUserModules(user_id, assessment_id);

    res.render("forms/moduleList.ejs", {
      ...res.locals,
      assessment_id,
      user_modules,
      title: assessment_name,
      description: assessment_description,
      formatTimeSpent,
    });
  },

  // Get form questions for user module
  async getModuleForm(req, res) {
    const { assessment_id } = res.locals;

    if (assessment_id == (await getCPAssessmentId())) {
      return getCPQuestionForm(req, res);
    }

    const { user_module_id } = req.params;
    const user_module = await fetchUserModuleById(user_module_id);
    const { module_id, module_name, module_description } = user_module;

    const questions = await fetchQuestionsForModule(module_id);
    questions.sort(shuffleOrder);
    console.log("Num questions: ", questions.length);

    const user_answers = await getUserAnswersForModule(req.user._id, module_id);

    res.render("forms/moduleForm.ejs", {
      ...res.locals,
      title: "Module: " + module_name,
      description: module_description || "",
      assessment_id,
      questions,
      user_answers,
      user_module: user_module,
      formatTimeSpent,
    });
  },
};

// UNCOMMENT THIS TO USE REDIS.
// const questions = await getOrSetRedisCache(
//   RedisClient,
//   `questions?module_id=${module_id}`,
//   async () => {
//     return await Question.find({ module_id });
//   }
// );

async function getCPQuestionForm(req, res) {
  const { user_module_id } = req.params;
  const user_module = await fetchUserModuleById(user_module_id);
  const { module_id, module_name } = user_module;
  const questions = await fetchCPQuestionsForModule(module_id);
  console.log("Num questions: ", questions.length);

  const user_answers = await CPUserAnswer.find({
    user_id: req.user._id,
    module_id,
  });

  // console.log(user_answers);

  res.render("forms/cp.moduleForm.ejs", {
    ...res.locals,
    title: "Module: " + module_name,
    assessment_id: await getCPAssessmentId(),
    questions,
    user_answers,
    user_module,
    formatTimeSpent,
  });
}
