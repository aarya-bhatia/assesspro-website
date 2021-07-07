const { connect, connection, dropCollections } = require("../config/db.config");

const collections = [
  "categories",
  "assessments",
  "modules",
  "questions",
  "answers",
  "feedbacks",
];

connect();

connection.once("open", async function () {
  await dropCollections(collections);
  console.log("Finished");
});
