const {
  connect,
  dropCollections,
  connection,
} = require("../../config/db.config");
const { processCSV } = require("..");
const FILE = "resources/csv/LeftRightStatements.csv";
const { LeftRightStatement } = require("../../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["leftrightstatements"]);

    await processCSV(FILE, async function (row) {
      const question = await LeftRightStatement.create({
        _id: row[0],
        assessment_key: row[1],
        category_id: row[2],
        category_name: row[3],
        left_statement: row[4],
        right_statement: row[5],
      });

      console.log("Processed row:", question._id);
    });
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Finished");
  }
});
