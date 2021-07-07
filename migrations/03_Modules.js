/**
 * This migration will create all modules.
 */
const { processCSV, initColumns } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const mongoose = require("mongoose");
const { Module } = require("../models");
const FILE = "resources/csv/Modules.csv";

const columns = initColumns(
  Array.from([
    "_id",
    "name",
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
  console.log("Created module... [id]", module._id);
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

connection.once("open", async () => {
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
