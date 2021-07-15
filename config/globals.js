const { Assessment } = require("../models");

let CPAssessmentId = null;

module.exports = {
  async getCPAssessmentId() {
    if (!CPAssessmentId) {
      const assessment = await Assessment.findOne({ key: "CP" });
      CPAssessmentId = assessment._id;
    }

    return CPAssessmentId;
  },
};
