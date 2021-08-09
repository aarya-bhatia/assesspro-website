const {
  connect,
  dropCollections,
  connection,
} = require("../../config/db.config");
const { processCSV } = require("..");
const FILE = "resources/csv/RatingStatements.csv";
const { RatingStatement } = require("../../models");

connect();

connection.once("open", async () => {
  try {
    await dropCollections(["ratingstatements"]);

    await processCSV(FILE, async function (row) {
      const question = await RatingStatement.create({
        _id: row[0],
        assessment_key: row[1],
        category_name: row[2],
        category_id: row[3],
        statement: row[4],
      });

      console.log("Processed row:", question._id);
    });
  } catch (err) {
    console.log(err);
  } finally {
    console.log("Finished");
  }
});
