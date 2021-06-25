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
    "srNo",
    "category_key",
    "category_name",
    "name",
    "key",
    "plot_type",
    "price",
    "public",
    "description",
  ])
);

const assessment_keys = [
  {
    key: "category_key",
    type: Number,
  },
  {
    key: "category_name",
    type: String,
  },
  {
    key: "name",
    type: String,
  },
  {
    key: "key",
    type: String,
  },
  {
    key: "plot_type",
    type: String,
  },
  {
    key: "price",
    type: Number,
  },
  {
    key: "public",
    type: Boolean,
  },
  {
    key: "description",
    type: String,
  },
];

const processRow = async function (row) {
  const data = {};

  assessment_keys.map(({ key, type }) => {
    data[key] = type(row[Columns[key]]);
  });

  const doc = await Assessment.create(data);
  console.log("Created assessment: ", doc);
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
