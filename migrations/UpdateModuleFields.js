require("dotenv").config();

const { processCSV } = require(".");
const { connect } = require("../config/db.config");
const mongoose = require("mongoose");
const { Module } = require("../models");
const FILE = "resources/csv/ModuleList.csv";

const columns = {
  assessment_key: 0,
  module_name: 1,
  module_key: 2,
  module_type: 3,
  scale_factor: 4,
  time_limit: 5,
  module_description: 6,
  feedback_description: 7,
};

async function processRow(row) {
  let module = await Module.findOne({ key: row[columns.module_key] });
  module.time_limit = row[columns.time_limit];
  module.scale_factor = row[columns.scale_factor];
  module.feedback_description = row[columns.feedback_description];
  await module.save();
  console.log("Updated module: ", module.name);
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
    console.log("Starting");
    await up();
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
