/**
 * This migration will create the questions and answers from the question bank
 */
const { processCSV, initColumns } = require("..");
const { connect, dropCollections } = require("../../config/db.config");
const mongoose = require("mongoose");
const { capitalize } = require("../../controller/util");
const { Question, Answer } = require("../../models");
const FILE = "resources/csv/QuestionBank.csv";

const Columns = initColumns(
  Array.from([
    "_id",
    "assessment_key",
    "module_id",
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
  ])
);

function getChoicesArray(row) {
  const suffixs = ["A", "B", "C", "D", "E"];

  let choices = [];

  for (const suffix of suffixs) {
    const choiceKey = "choice" + suffix;
    const pointKey = "points" + suffix;

    if (!row[Columns[choiceKey]] || row[Columns[pointKey]].length <= 0) {
      break;
    }

    const choiceText = capitalize(row[Columns[choiceKey]]);
    const choicePoints = parseInt(row[Columns[pointKey]]);

    choices.push({
      _id: suffix,
      text: choiceText,
      points: choicePoints,
    });
  }

  return choices;
}

const processRow = async (row) => {
  // Create question
  const _id = parseInt(row[Columns._id]);
  const assessment_key = row[Columns.assessment_key];
  const module_id = parseInt(row[Columns.module_id]);
  const module_name = row[Columns.module_name];
  const content = row[Columns.content];
  const choices = getChoicesArray(row);

  const question = await Question.create({
    _id,
    assessment_key,
    module_id,
    module_name,
    content,
    choices,
  });

  console.log("Added question [id]", question._id);

  // Create answers for each choice
  for (const choice of choices) {
    await Answer.create({
      assessment_key,
      question_id: question._id,
      choice: choice._id,
      points: choice.points,
    });
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
