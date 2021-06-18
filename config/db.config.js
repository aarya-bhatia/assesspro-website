require("dotenv").config();

const mongoose = require("mongoose");

mongoose.Promise = global.Promise

// mongoose.set('debug', true);

module.exports.connect = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((err) => {
      console.log("Error connecting to database", err);
      process.exit(0);
    });
}

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("closing connection with database");
    process.exit(0);
  });
});


module.exports.dropCollections = (collections) => {
  const connection = mongoose.connection

  return new Promise((resolve, reject) => {
    connection.db.listCollections().toArray((err, docs) => {
      if (!err) {
        for (i = 0; i < docs.length; i++) {
          const collection = docs[i].name
          console.log(collection)
          if (collections.includes(collection)) {
            connection.db.dropCollection(collection, (err, res) => {
              if (!err) {
                console.log('Collection dropped: ' + collection)
              }
            })
          }
        }
        resolve()
      }
      else {
        reject(err)
      }
    })
  })
}