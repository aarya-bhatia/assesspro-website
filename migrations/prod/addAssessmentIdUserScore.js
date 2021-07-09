require("dotenv").config();

const aid_map = {
  "National Employability Skills Test": 1,
  "Career Preference Test": 2,
  "Logical Reasoning": 3,
  "Verbal Reasoning": 4,
  "Creativity Personality": 5,
  "Creativity Motivation": 6,
  "Creativity Temperament": 7,
};

const { connect, connection } = require("../../config/db.config");
const { UserScore } = require("../../models");

connect();
connection.once("open", async function () {
  const user_scores = await UserScore.find({});
  for (const user_score of user_scores) {
    await UserScore.updateOne(
      { _id: user_score._id },
      { $set: { assessment_id: aid_map[user_score.assessment_name] } }
    ).then(() => {
      console.log("Processed row...");
    });
  }
  console.log("Finished...");
});
