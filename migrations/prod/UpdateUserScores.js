require("dotenv").config();
const { connect, connection } = require("../../config/db.config");
const { UserScore, Assessment } = require("../../models");
const mongoose = require("mongoose");

async function start() {
  const scores = await UserScore.find({});

  for (const score of scores) {
    const {
      user_id,
      status,
      plot_type,
      date,
      assessment_name,
      assessment_key,
    } = score;

    const assessment = await Assessment.findOne({ key: assessment_key });

    const newScore = {
      user_id,
      assessment_name,
      assessment_id: assessment._id,
      assessment_key,
      plot_type,
      date,
      status,
    };

    newScore.module_scores = score.module_scores.map((module_score) => {
      const ms = module_score.toObject();
      const doc = {
        _id: ms.module_key,
        name: ms.name,
        score: ms.score,
      };
      console.log(doc);
      return doc;
    });

    await UserScore.create(newScore).then((doc) => {
      console.log("created new score");
    });

    await score.deleteOne().then((doc) => {
      console.log("Deleted old score");
    });
  }
}

connect();
connection.once("open", start);
