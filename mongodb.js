const mongoose = require("mongoose");

const { DB_URL } = require("./config");

module.exports = function () {
  mongoose.connection.on("connected", function () {
    console.log("Successfully connected to database");
  });
  mongoose.connection.on("disconnected", function () {
    console.log("Disconnected from database");
  });
  mongoose.connection.on("error", function () {
    console.log("Error while connecting to database");
    process.exit();
  });

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log(
        "Mongoose default connection is disconnected due to application termination"
      );
      process.exit(0);
    });
  });

  mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};
