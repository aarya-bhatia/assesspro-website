require("dotenv").config();

const path = require("path");
const fs = require("fs");

const pathname = path.join("resources", "backup");

const { connect } = require("../config/db.config");
const mongoose = require("mongoose");

const { UserProfile, UserScore } = require("../models");

connect();

async function fetch_profiles(arr, scores) {
  return new Promise(async (res) => {
    for (const score of scores) {
      const user_id = score.user_id;
      const user_profile = await UserProfile.findById(user_id);
      const { name, email } = user_profile;
      const { assessment_key, assessment_name, module_scores, date, status } =
        score;

      const user_scores = module_scores.map(({ module_key, name, score }) => {
        return { module_key, name, score };
      });

      const data = {
        user_id,
        name,
        email,
        assessment_name,
        assessment_key,
        date,
        user_scores,
        status,
      };

      //   console.log(data);
      console.log("Processed row");

      arr.push(data);
    }
    res();
  });
}

mongoose.connection.once("open", async () => {
  const scores = await UserScore.find({}); //.limit(5).exec();
  const arr = [];

  await fetch_profiles(arr, scores).then(() => {
    console.log(arr.length);
    const json = JSON.stringify(arr);
    const filename = path.join(pathname, Date.now() + ".json");
    fs.writeFile(filename, json, "utf-8", (err) => {
      if (!err) {
        console.log("File Written Successfully!");
      }
    });
  });
});
