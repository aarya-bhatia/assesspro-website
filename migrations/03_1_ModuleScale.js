const { processCSV } = require(".");
const { connect, connection, dropCollections } = require("../config/db.config");
const { ModuleScale } = require("../models");
const FILE = "resources/csv/ModuleScale.csv";

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["modulescales"]);
    await processCSV(FILE, async (row) => {
      const _id = parseInt(row[0]);
      const name = row[1];
      const type = row[2];
      const scale_factor = parseInt(row[3]);

      const doc = await ModuleScale.create({ _id, name, type, scale_factor });
      console.log("Processed row...");
    });

    console.log("Finished");
  } catch (err) {
    console.log("ERROR RUNNING MIGRATIONS...", err);
  }
});
