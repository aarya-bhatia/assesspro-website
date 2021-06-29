require("dotenv").config();
require("../../config/db.config").connect();

const { UserScore, Assessment, Module } = require("../../models");

require("mongoose").connection.once("open", async () => {
  const scores = await UserScore.find({});

  for (const score of scores) {
    const { assessment_key } = score;
    const assessment = await Assessment.findOne({ key: assessment_key });
    score.assessment_id = assessment._id;

    for (const module_score of score.module_scores) {
      const { name } = module_score;
      const module = await Module.findOne({ name });
      module_score.module_key = module.key;
      module_score.module_id = module._id;
    }

    await score.save();
    console.log("Processed row.");
  }
});
