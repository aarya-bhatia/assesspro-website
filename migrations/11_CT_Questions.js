const { connect, dropCollections, connection } = require("../config/db.config");
const { processCSV } = require(".");
const FILE = "resources/csv/CT_QuestionBank.csv";
const { CTQuestion } = require("../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["ctquestions"]);

    await processCSV(FILE, async function (row) {
      const _id = row[0];
      const statement = row[1];
      const module_name = row[2];
      const module_id = row[3];

      const question = await CTQuestion.create({
        _id,
        statement,
        module_name,
        module_id,
      });

      console.log("Processed row...", question);
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Finished.");
});
