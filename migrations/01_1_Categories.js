const { processCSV } = require(".");
const { connect, connection } = require("../config/db.config");
const FILE = "resources/csv/Categories.csv";
const { Category } = require("../models");

async function processRow(row) {
  const key = row[0];
  const name = row[1];
  const description = row[2];
  const category = await Category.create({ key, name, description });
  console.log("Processed row [category id]: ", category._id);
}

connect();

connection.once("open", async () => {
  try {
    await processCSV(FILE, processRow);
  } catch (err) {
    console.log(err);
  }
});
