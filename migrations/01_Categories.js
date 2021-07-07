const { processCSV } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");
const FILE = "resources/csv/Categories.csv";
const { Category } = require("../models");

const columns = { _id: 0, name: 1, description: 2 };

async function processRow(row) {
  const data = {};
  for (const [key, value] of Object.entries(columns)) {
    data[key] = row[value];
  }
  const category = await Category.create(data);
  console.log("Processed row [category id]: ", category._id);
}

async function down() {
  return new Promise(async (res) => {
    await dropCollections(["categories"]);
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
    await down();
    await up();
  } catch (err) {
    console.log(err);
  }
});
