const { connect, dropCollections, connection } = require("../config/db.config");
const { processCSV } = require(".");
const FILE = "resources/csv/XXX.csv";
const { CMQuestion } = require("../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["cpquestions"]);

    await processCSV(FILE, async function (row) {
      console.log("Processed row...");
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Finished.");
});
