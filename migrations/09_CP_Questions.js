const { connect, dropCollections, connection } = require("../config/db.config");
const { processCSV } = require(".");
const FILE = "resources/csv/CP_QuestionBank.csv";
const { CPQuestion } = require("../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["cpquestions"]);

    await processCSV(FILE, async function (row) {
      const module_id = row[0];
      const module_name = row[1];
      const left = row[2];
      const right = row[3];

      await CPQuestion.create({
        module_id,
        module_name,
        left,
        right,
      });

      console.log("Processed row...");
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Finished.");
});
