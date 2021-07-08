const { Category, Assessment, Module, Feedback } = require("../../models");

// local cache
const moduleFeedbackDescriptions = {};
const moduleFeedbacks = {};

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

  async fetchModuleById(id) {
    return await Module.findById(id);
  },

  async getModuleScoreFeedback(module_id, score) {
    if (!moduleFeedbacks[module_id]) {
      moduleFeedbacks[module_id] = await Feedback.find({ module_id });
    }

    const found = moduleFeedbacks[module_id].find(
      (module_feedback) =>
        score >= module_feedback.min_value && score <= module_feedback.max_value
    );

    return found ? found.feedback : null;
  },

  async getModuleFeedbackDescription(module_id) {
    if (!moduleFeedbackDescriptions[module_id]) {
      const module = await this.fetchModuleById(module_id);
      moduleFeedbackDescriptions[module_id] = module.feedback_description;
    }

    return moduleFeedbackDescriptions[module_id];
  },
};
