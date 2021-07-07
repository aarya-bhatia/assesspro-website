/**
 * This migration will create the questions and answers from the question bank
 */
const { processCSV, initColumns } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");
const { capitalize } = require("../controller/util");
const { Module, Question, Answer } = require("../models");
const FILE = "resources/csv/QuestionBank.csv";

let ModuleCache = {};

const Columns = initColumns(
  Array.from([
    "sr_no",
    "module_key",
    "module_name",
    "content",
    "choiceA",
    "choiceB",
    "choiceC",
    "choiceD",
    "choiceE",
    "pointsA",
    "pointsB",
    "pointsC",
    "pointsD",
    "pointsE",
    "answer",
  ])
);

function getChoicesArray(row) {
  const suffixs = ["A", "B", "C", "D", "E"];

  let choices = [];

  for (const suffix of suffixs) {
    const choiceKey = "choice" + suffix;
    const pointKey = "points" + suffix;

    const choiceText = capitalize(row[Columns[choiceKey]]);
    const choicePoints = parseInt(row[Columns[pointKey]]);

    if (!choiceText || choiceText.length <= 0) {
      break;
    }

    choices.push({
      key: suffix,
      text: choiceText,
      points: choicePoints,
    });
  }

  return choices;
}

async function getModuleId(key) {
  if (!ModuleCache[key]) {
    const { _id } = await Module.findOne({ key });
    ModuleCache[key] = _id;
  }

  return ModuleCache[key];
}

const processRow = async (row) => {
  // Create question

  const module_key = parseInt(row[Columns.module_key]);
  const module_name = row[Columns.module_name];
  const content = row[Columns.content];
  const module_id = await getModuleId(module_key);
  const choices = getChoicesArray(row);

  const question = await Question.create({
    module_id,
    module_name,
    module_key,
    content,

    // Get the id and text for each choice
    choices: choices.map((choice) => {
      return {
        _id: choice.key,
        text: choice.text,
      };
    }),
  });

  console.log("Added question...[id]", question._id);

  // Create answers for each choice

  const question_id = question._id;

  for (const choice of choices) {
    const answer = await Answer.create({
      question_id,
      choice: choice.key,
      points: choice.points,
    });

    // console.log("Added answer...[id]", answer._id);
  }
};

async function down() {
  return new Promise(async (res) => {
    await dropCollections(["questions", "answers"]);
    res();
  });
}

async function up() {
  return new Promise(async (res) => {
    await processCSV(FILE, processRow);
    res();
  });
}

connect();

mongoose.connection.once("open", async () => {
  try {
    console.log("Destroying tables");
    await down();
    console.log("Creating tables");
    await up();
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});

module.exports = {
  up,
  down,
};
