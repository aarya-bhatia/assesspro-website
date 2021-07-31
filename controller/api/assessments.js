const { Category, Assessment, Module } = require("../../models");

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
};
