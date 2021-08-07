const {
  UserProfile,
  UserAssessment,
  UserModule,
  UserScore,
  UserAnswer,
} = require("../../models");

module.exports = {
  async createUserProfile(name, email, password) {
    return await UserProfile.create({ name, email, password });
  },

  async createUserScore(user_id, user_assessment, module_scores) {
    return await UserScore.create({
      user_id: user_id,
      assessment_id: user_assessment.assessment_id,
      assessment_name: user_assessment.assessment_name,
      assessment_key: user_assessment.assessment_key,
      plot_type: user_assessment.assessment_plot_type,
      module_scores: module_scores,
    });
  },

  async getUserScores(user_id) {
    return await UserScore.find({
      user_id,
    });
  },

  async getUserModules(uid, aid) {
    return await UserModule.find({
      user_id: uid,
      assessment_id: aid,
    });
  },

  async updateUserModuleOnSubmit(umid, no_attempted, status, time_spent) {
    await UserModule.updateOne(
      {
        _id: umid,
      },
      {
        $set: {
          no_attempted,
          status,
        },
        $inc: {
          time_spent,
        },
      }
    );
  },

  async updateOrCreateAnswer(user_module, question_id, choice, value) {
    const { user_id, module_id, module_name } = user_module;

    const update = {};

    if (choice) {
      update.choice = choice;
    }
    if (value) {
      update.value = value;
    }

    await UserAnswer.updateOne(
      {
        user_id,
        question_id,
        module_id,
        module_name,
      },
      update,
      { upsert: true }
    );
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
    await UserProfile.findByIdAndRemove(user_id);
    await UserModule.deleteMany({ user_id });
    await UserAnswer.deleteMany({ user_id });
  },

  async updateUserModulesOnRetake(user_id, assessment_id) {
    const doc = await UserModule.updateMany(
      {
        user_id,
        assessment_id,
      },
      {
        $set: {
          time_spent: 0,
          status: "Pending",
          no_attempted: 0,
        },
      }
    );
    console.log(doc);
  },
};
