const { connect, dropCollections, connection } = require("../config/db.config");
const { processCSV } = require(".");
const FILE = "resources/csv/CM_QuestionBank.csv";
const { CMQuestion } = require("../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["cmquestions"]);

    await processCSV(FILE, async function (row) {
      const _id = row[0];
      const statement = row[1];
      const options = [];
      const offset = 2;
      const initCharCode = String("A").charCodeAt(0);
      for (let i = 0; i < 6; i++) {
        const _id = String.fromCharCode(initCharCode + i);
        const content = row[offset + i];
        options.push({
          _id,
          content,
        });
      }

      const question = await CMQuestion.create({
        _id,
        statement,
        options,
      });

      console.log("Processed row...", question);
    });
  } catch (err) {
    console.log(err);
  }

  console.log("Finished.");
});
