/**
 * This migration will create all modules.
 */
const { processCSV } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const { Module } = require("../models");
const FILE = "resources/csv/Modules.csv";

const processRow = async function (row) {
  const module = await Module.create({
    assessment_id: row[0],
    assessment_key: row[1],
    _id: row[2],
    name: row[3],
    description: row[4],
    instructions: row[5],
    type: row[6],
    scale_factor: row[7],
  });

  console.log("processed row", module._id);
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
    console.log("Donek");
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
