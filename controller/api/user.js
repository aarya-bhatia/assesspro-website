const { fetchModuleById } = require("./assessments");

const {
  UserAssessment,
  UserModule,
  UserScore,
  UserAnswer,
} = require("../../models");

module.exports = {
  async createUserModule(user_id, assessment_id, module) {
    await UserModule.create({
      user_id,
      assessment_id,
      module_id: module._id,
      module_name: module.name,
      module_key: module.key,
      module_type: module.type,
      module_description: module.description,
      no_questions: module.no_questions,
      no_attempted: 0,
      time_spent: 0,
      time_limit: module.time_limit,
      scale_factor: module.scale_factor,
      status: "Pending",
    });
  },

  async createUserModules(user_id, assessment) {
    const msg = `Initialising ${modules.length} modules for user [id] ${user_id}...`;
    console.log(msg);

    const assessment_id = assessment._id;
    const modules = assessment.modules;

    return new Promise(async function (res) {
      for (const _module of modules) {
        const module = await fetchModuleById(_module._id);
        await this.createUserModule(user_id, assessment_id, module);
      }
      res();
    });
  },

  async createUserAssessment(user, assessment) {
    return await UserAssessment.create({
      user_id: user._id,
      user_name: user.name,
      assessment_id: assessment._id,
      assessment_key: assessment.key,
      assessment_name: assessment.name,
      assessment_category: assessment.category,
      assessment_plot_type: assessment.plot_type,
      assessment_description: assessment.description,
      date_purchased: new Date(),
      attempts: 0,
      completed: false,
    });
  },

  async createUserScore(user_id, user_assessment, module_scores) {
    return await UserScore.create({
      user_id: user_id,
      assessment_id: user_assessment.assessment_id,
      assessment_name: user_assessment.assessment_name,
      assessment_key: user_assessment.assessment_key,
      plot_type: user_assessment.assessment_plot_type,
      module_scores: module_scores,
      date: new Date(),
    });
  },

  async getUserScores(user_id) {
    return await UserScore.find({
      user_id,
    });
  },

  async fetchUserModuleById(umid) {
    return await UserModule.findById(umid);
  },

  async getUserModules(uid, aid) {
    return await UserModule.find({
      user_id: uid,
      assessment_id: aid,
    });
  },

  async getUserAssessment(uid, aid) {
    return await UserAssessment.findOne({
      user_id: uid,
      assessment_id: aid,
    });
  },

  async getUserAnswersForModule(uid, mid) {
    return await UserAnswer.find({
      user_id: uid,
      module_id: mid,
    });
  },

  async unenrollUserFromAssessment(user_id, assessment_id) {
    const assessment_id = assessment._id;
    const modules = assessment.modules.map((module) => module._id);
    await UserAssessment.deleteOne({ user_id, assessment_id });
    await UserModule.deleteMany({ user_id, assessment_id });
    await UserAnswer.deleteMany({ user_id, module_id: { $in: modules } });
  },

  async updateUserAssessmentOnRetake(user_id, assessment_id) {
    await UserAssessment.updateOne(
      {
        user_id,
        assessment_id,
      },
      {
        $set: {
          completed: false,
        },
      }
    );
  },

  async updateUserAssessmentOnCompletion(user_assessment) {
    user_assessment.attempts = (user_assessment.attempts || 0) + 1;
    user_assessment.completed = true;
    await user_assessment.save();
  },

  async deleteUserAccount(user_id) {
    console.log("Deleting profile...");
    await UserProfile.findByIdAndRemove(user_id);
    console.log("Deleting modules...");
    await UserModule.deleteMany({ user_id });
    console.log("Deleting User answers...");
    await UserAnswer.deleteMany({ user_id });
  },
};
