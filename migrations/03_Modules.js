/**
 * This migration will create all modules.
 */
const { processCSV, initColumns } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const { Module } = require("../models");
const FILE = "resources/csv/Modules.csv";

const processRow = async function (row) {
  const _id = row[0];
  const name = row[1];
  const description = row[2];
  const instructions = row[3];

  const module = await Module.create({ _id, name, description, instructions });
  console.log("Created module... [id]", module._id);
};

async function down() {
  return new Promise((res) => {
    dropCollections(["modules"]).then(() => {
      res();
    });
  });
}

connect();

connection.once("open", async () => {
  try {
    await down();
    await processCSV(FILE, processRow);
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
