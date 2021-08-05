/**
 * This migration will create the assessments without the modules list
 */

const { processCSV, initColumns } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");

const FILE = "resources/csv/Assessments.csv";
const { Assessment } = require("../models");

const Columns = initColumns(
  Array.from([
    "_id",
    "key",
    "category_id",
    "category_name",
    "name",
    "plot_type",
    "price",
    "description",
    "shortPara",
    "enrollURL",
    "redirectURL",
  ])
);

const processRow = async function (row) {
  const data = {};

  for (const [key, value] of Object.entries(Columns)) {
    data[key] = row[value];
  }

  const assessment = await Assessment.create(data);
  console.log("Created assessment [id] ", assessment._id);
};

async function down() {
  return new Promise(async (res) => {
    await dropCollections(["assessments"]);
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
