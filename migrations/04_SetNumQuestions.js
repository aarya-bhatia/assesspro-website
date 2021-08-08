const { connect, connection } = require("../config/db.config");

const { Module, Question } = require("../models");

async function SetNumQuestions() {
  const modules = await Module.find({});
  for (const module of modules) {
    const questions = await Question.find({ module_id: module._id });
    module.no_questions = questions.length;
    await module.save();
  }
  console.log("Completed");
}

connect();

connection.once("open", SetNumQuestions);
