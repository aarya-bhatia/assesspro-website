const { formatTimeSpent, shuffleOrder } = require("../controller/util");
const { Module, UserModule, Question } = require("../models");

module.exports = {
  // Get the module list page for an assessment
  async getModuleList(req, res) {
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
    const user_id = req.user._id;
    const { assessment_id } = res.locals;
    const { user_module_id } = req.params;

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

    res.render("forms/moduleForm.ejs", {
      ...res.locals,
      title,
      description: module.description,
      instructions: module.instructions,
      assessment_id,
      questions,
      user_answers,
      user_module,
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
