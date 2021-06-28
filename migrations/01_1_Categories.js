const { processCSV } = require(".");
const { connect, dropCollections } = require("../config/db.config");
const mongoose = require("mongoose");
const FILE = "resources/csv/Categories.csv";
const { Category } = require("../models");

async function processRow(row) {
  const key = row[0];
  const name = row[1];
  const description = row[2];
  const category = await Category.create({ key, name, description });
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
