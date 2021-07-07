require("dotenv").config();

const { processCSV } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");
const { Feedback, Assessment, Module } = require("../models");
const collections = ["feedbacks"];
const FILE = "resources/csv/NEST_Feedback.csv";

const columns = {
  module_key: 0,
  module_name: 1,
  min_value: 2,
  max_value: 3,
  feedback: 4,
};

const assessment_key = "NEST";
let assessment_id = null;

async function init() {
  const assessment = await Assessment.findOne({ key: assessment_key });
  assessment_id = assessment._id;
}

const moduleIds = [];

async function processRow(row) {
  const module_key = row[columns.module_key];
  const module_name = row[columns.module_name];
  const min_value = row[columns.min_value];
  const max_value = row[columns.max_value];
  const feedback = row[columns.feedback];

  if (!moduleIds[module_key]) {
    const module = await Module.findOne({ key: module_key });
    moduleIds[module_key] = module._id;
  }

  const module_id = moduleIds[module_key];

  const doc = await Feedback.create({
    assessment_id,
    assessment_key,
    module_key,
    module_name,
    module_id,
    min_value,
    max_value,
    feedback,
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

mongoose.connection.once("open", async () => {
  try {
    console.log("Destroying tables");
    await down();

    console.log("Initializing...");
    await init();

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
