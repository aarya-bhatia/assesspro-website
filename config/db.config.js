const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let URL = null;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();

  // mongoose.set('debug', Boolean(process.env.SHOW_DEBUG_MONGOOSE));

  URL = process.env.DB_URL; // localhost:27017 FOR DEVELOPMENT
} else {
  URL = process.env.ATLAS_DB_URL;
}

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
  autoIndex: true,
};

// OPEN CONNECTION TO DATABASE
module.exports.connect = () => {
  mongoose
    .connect(URL, options)
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
      process.exit(0);
    });
};

process.on("SIGINT", function () {
  mongoose.connection.close(() => {
    console.log("closing connection with database");
    process.exit(0);
  });
});

// mongoose connection
module.exports.connection = mongoose.connection;

// Accepts an array of collection names
// This function drops collections with those names if they exist
module.exports.dropCollections = (collections) => {
  const connection = mongoose.connection;

  return new Promise((resolve, reject) => {
    connection.db.listCollections().toArray((err, docs) => {
      if (!err) {
        for (i = 0; i < docs.length; i++) {
          const collection = docs[i].name;
          if (collections.includes(collection)) {
            connection.db.dropCollection(collection, (err, res) => {
              if (!err) {
                console.log("Collection dropped: " + collection);
              }
            });
          }
        }
        resolve();
      } else {
        reject(err);
      }
    });
  });
};
