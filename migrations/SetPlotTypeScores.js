require("dotenv").config();

const mongoose = require("mongoose");

require("../config/db.config").connect();

const { UserScore } = require("../models");

mongoose.connection.once("open", async function () {
  const userscores = await UserScore.find();
  for (let userscore of userscores) {
    if (userscore.assessment_key == "CPT") {
      userscore.plot_type = "hbar";
    } else {
      userscore.plot_type = "spider";
    }
    await userscore.save();
    console.log("Processed score");
  }
});
