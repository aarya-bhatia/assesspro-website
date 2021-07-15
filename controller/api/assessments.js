const { Category, Assessment, Module, Feedback } = require("../../models");

// local cache
const moduleFeedbackDescriptions = {};
const FeedbackTable = {};

module.exports = {
  async fetchCategories() {
    return await Category.find({});
  },

  async fetchAssessmentsInCategory(category_id) {
    return await Assessment.find({ category_id });
  },

  async fetchAssessmentById(id) {
    return await Assessment.findById(id);
  },

  async fetchAssessmentByKey(key) {
    return await Assessment.findOne({ key });
  },

  async fetchModuleById(id) {
    return await Module.findById(id);
  },

  async getModuleScoreFeedback(aid, mid, score) {
    if (!FeedbackTable[aid]) {
      FeedbackTable[aid] = {};
    }

    if (!FeedbackTable[aid][mid]) {
      FeedbackTable[aid][mid] = await Feedback.find({
        assessment_id: aid,
        module_id: mid,
      });
    }

    function cb({ min_value, max_value }) {
      return score >= min_value && score <= max_value;
    }

    return FeedbackTable[aid][mid].find(cb).feedback;
  },

  async getModuleFeedbackDescription(module_id) {
    if (!moduleFeedbackDescriptions[module_id]) {
      const { feedback_description } = await Module.findById(module_id);
      moduleFeedbackDescriptions[module_id] = feedback_description;
    }
    return moduleFeedbackDescriptions[module_id];
  },
};
