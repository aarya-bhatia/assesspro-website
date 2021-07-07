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
    "name",
    "_id",
    "type",
    "scale_factor",
    "time_limit",
    "description",
    "feedback_description",
  ])
);

const processRow = async function (row) {
  const data = {};

  for (const [key, value] of Object.entries(columns)) {
    data[key] = row[value];
  }

  const module = await Module.create(data);

  await Assessment.updateOne(
    { key: assessment_key },
    {
      $addToSet: {
        modules: {
          _id: module._id,
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
