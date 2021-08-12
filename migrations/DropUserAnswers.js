const { connect, dropCollections, connection } = require("../config/db.config");

connect();

connection.once("open", async () => {
  await dropCollections(["useranswers"]);
});
