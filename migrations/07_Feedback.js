require("dotenv").config();

const { processCSV } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const { Feedback } = require("../models");
const collections = ["feedbacks"];
const FILE = "resources/csv/NEST_Feedback.csv";

const columns = {
  module_id: 0,
  module_name: 1,
  min_value: 2,
  max_value: 3,
  feedback: 4,
};

const assessment_id = 1;

async function processRow(row) {
  const data = {};
  for (const [key, value] of Object.entries(columns)) {
    data[key] = row[value];
  }

  const doc = await Feedback.create({
    ...data,
    assessment_id,
  });

  console.log("Process row [feedback id]: ", doc._id);
}

async function down() {
  return new Promise(async (res) => {
    await dropCollections(collections);
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

connection.once("open", async () => {
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
