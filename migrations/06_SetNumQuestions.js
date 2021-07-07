const mongoose = require("mongoose");
const { Module, Question } = require("../models");

async function SetNumQuestions() {
  const modules = await Module.find({});

  for (const module of modules) {
    console.log("module: ", module.name);
    const questions = await Question.find({ module_id: module._id });
    module.no_questions = questions.length;
    await module.save();
  }
  console.log("Completed");
}

require("../config/db.config").connect();
mongoose.connection.once("open", SetNumQuestions);
