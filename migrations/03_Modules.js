/**
 * This migration will create all modules.
 */
const { processCSV } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const { Module, Question } = require("../models");
const FILE = "resources/csv/Modules.csv";

const processRow = async function (row) {
  const module = new Module({
    assessment_id: row[0],
    assessment_key: row[1],
    _id: row[2],
    name: row[3],
    description: row[4],
    instructions: row[5],
    type: row[6],
    scale_factor: row[7],
  });

  const questions = await Question.find({ module_id: module._id });
  module.no_questions = questions.length;

  await module.save();

  console.log("processed row", module._id);
};

async function down() {
  return new Promise((res) => {
    dropCollections(["modules"]).then(() => {
      res();
    });
  });
}

connect();

connection.once("open", async () => {
  try {
    await down();
    await processCSV(FILE, processRow);
    console.log("Done");
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
