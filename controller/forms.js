const {
  formatTimeSpent,
  shuffleOrder,
  getOrSetRedisCache,
} = require("../controller/util");
const { Question, UserAnswer, UserModule } = require("../models");
const RedisClient = require("../config/redis.config");

module.exports = {
  getModuleList,
  getModuleForm,
};

// Get the module list page for an assessment
async function getModuleList(req, res) {
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
}

// Get form questions for user module
async function getModuleForm(req, res) {
  const { assessment_id } = res.locals;
  const { user_module_id } = req.params;

  const user_module = await UserModule.findById(user_module_id);
  const { module_id, module_name } = user_module;

  // const questions = await getOrSetRedisCache(
  //   RedisClient,
  //   `questions?module_id=${module_id}`,
  //   async () => {
  //     return await Question.find({ module_id });
  //   }
  // );

  const questions = await Question.find({ module_id });

  // console.log(questions);

  questions.sort(shuffleOrder);

  console.log("Num questions: ", questions.length);

  const user_answers = await UserAnswer.find({
    user_id: req.user._id,
    module_id,
  });

  res.render("forms/moduleForm.ejs", {
    loggedIn: true,
    title: "Module: " + module_name,
    description: user_module.module_description || "",
    assessment_id,
    questions,
    user_answers,
    user_module: user_module,
    formatTimeSpent,
  });
}
