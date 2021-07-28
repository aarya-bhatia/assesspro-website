const { Assessment } = require("../models");

const idToKey = {};
const keyToId = {};
const keys = require("../config/assessmentKeys");

module.exports = {
  ...keys,
  async getAssessmentKey(id) {
    if (!idToKey[id]) {
      const assessment = await Assessment.findById(id);
      idToKey[id] = assessment.key;
    }
    return idToKey[id];
  },

  async getAssessmentId(key) {
    if (!keyToId[key]) {
      const assessment = await Assessment.findOne({ key });
      keyToId[key] = assessment._id;
    }
    return keyToId[key];
  },
};
