const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: Number,
  statement: String,
  options: [
    {
      _id: String,
      content: String,
    },
  ],
});

const model = mongoose.model("CMQuestion", schema);

module.exports = model;
