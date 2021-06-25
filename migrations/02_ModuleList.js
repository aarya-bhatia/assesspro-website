/**
 * This migration will fill the list of modules for each assessment
 */
const { processCSV, initColumns } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");
const { Assessment, Module } = require("../models");
const FILE = "resources/csv/ModuleList.csv";

const columns = initColumns(
  Array.from([
    "assessment_key",
    "module_name",
    "module_key",
    "module_type",
    "scale_factor",
    "time_limit",
    "module_description",
    "feedback_description",
  ])
);

const processRow = async function (row) {
  const assessment_key = row[columns.assessment_key];
  const module_name = row[columns.module_name];
  const module_key = row[columns.module_key];
  const module_type = row[columns.module_type];
  const scale_factor = row[columns.scale_factor];
  const time_limit = row[columns.time_limit];
  const module_description = row[columns.module_description];
  const feedback_description = row[columns.feedback_description];

  const module = await Module.create({
    name: module_name,
    key: module_key,
    type: module_type,
    scale_factor,
    time_limit,
    feedback_description,
    description: module_description,
  });

  await Assessment.updateOne(
    { key: assessment_key },
    {
      $addToSet: {
        modules: {
          _id: module._id,
          key: module.key,
          name: module.name,
        },
      },
    }
  );
};

async function up() {
  return new Promise(async (res) => {
    await processCSV(FILE, processRow);
    res();
  });
}

async function down() {
  return new Promise(async (res) => {
    await dropCollections(["modules"]);
    res();
  });
}

connect();

mongoose.connection.once("open", async () => {
  try {
    console.log("Deleting modules...");
    await down();
    console.log("Adding modules...");
    await up();
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});

module.exports = {
  up,
  down,
};
