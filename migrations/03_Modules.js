/**
 * This migration will create all modules.
 */
const { processCSV, initColumns } = require(".");
const { connect, dropCollections, connection } = require("../config/db.config");
const { Module, Assessment } = require("../models");
const FILE = "resources/csv/Modules.csv";
const fs = require("fs");

const columns = initColumns(
  Array.from(["_id", "name", "type", "scale_factor", "description"])
);

const processRow = async function (row) {
  const data = {};
  for (const [key, value] of Object.entries(columns)) {
    data[key] = row[value];
  }
  const module = await Module.create(data);
  console.log("Created module... [id]", module._id);
};

const processRowModuleList = async function (row) {
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
  console.log("Processed row...");
};

connect();

async function writeJsonFile() {
  const content = await Module.find({});
  const file =
    "/Users/aarya/Desktop/AssessProWebsite/migrations/json/modules.json";
  const jsonData = JSON.stringify(content);
  fs.writeFileSync(file, jsonData);
  console.log("done");
}

connection.once("open", async () => {
  try {
    console.log("Dropping modules...");
    await dropCollections(["modules"]);
    console.log("Adding modules...");
    await processCSV(FILE, processRow);
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
