const { formatTimeSpent, shuffleOrder } = require("../controller/util");

const { fetchQuestionsForModule } = require("./api/answers");
const {
  getUserAnswersForModule,
  getUserModules,
  fetchUserModuleById,
} = require("./api/user");

module.exports = {
  // Get the module list page for an assessment
  async getModuleList(req, res) {
    const { assessment_id, user_assessment } = res.locals;
    const { assessment_description, assessment_name } = user_assessment;
    const user_id = req.user._id;

    const user_modules = await getUserModules(user_id, assessment_id);

    res.render("forms/moduleList.ejs", {
      loggedIn: true,
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
    const { user_module_id } = req.params;
    const { module_id, module_name } = await fetchUserModuleById(
      user_module_id
    );

    // UNCOMMENT THIS TO USE REDIS.
    // const questions = await getOrSetRedisCache(
    //   RedisClient,
    //   `questions?module_id=${module_id}`,
    //   async () => {
    //     return await Question.find({ module_id });
    //   }
    // );

    const questions = await fetchQuestionsForModule(module_id);
    questions.sort(shuffleOrder);
    console.log("Num questions: ", questions.length);

    const user_answers = await getUserAnswersForModule(req.user._id, module_id);

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
  },
};
