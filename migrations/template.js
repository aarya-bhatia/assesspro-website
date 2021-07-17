const { connect, dropCollections, connection } = require("../config/db.config");
const { processCSV } = require(".");
const FILE = "resources/csv/XXX.csv"; // Specify csv file path
const {} = require("../models"); // Import models

connect(); // connect to db

connection.once("open", async () => {
  try {
    await dropCollections([]);

    await processCSV(FILE, async function (row) {
      // Process row data
      console.log("Processed row...");
    });
  } catch (err) {
    console.log(err);
  }
  console.log("Finished.");
});
