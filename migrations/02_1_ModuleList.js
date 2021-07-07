/**
 * This migration will fill the list of modules for each assessment
 */
const { processCSV } = require(".");
const { connect, connection } = require("../config/db.config");
const { Assessment } = require("../models");
const FILE = "resources/csv/ModuleList.csv";

const processRow = async function (row) {
  await Assessment.updateOne(
    { key: row[0] },
    {
      $addToSet: {
        modules: {
          _id: row[1],
          name: row[2],
        },
      },
    }
  );
};

connect();

connection.once("open", async () => {
  try {
    await processCSV(FILE, processRow);
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
