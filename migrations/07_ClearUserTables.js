const { connect, dropCollections } = require("../config/db.config");

connect();

require("mongoose").connection.once("open", async () => {
  await dropCollections([
    "useranswers",
    "userassessments",
    "usermodules",
    "userprofiles",
    "userscores",
  ]);
});
