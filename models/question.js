const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema({
  module_name: String,
  module_id: Number,
  content: String,
  image: String,
  choices: [
    {
      _id: String, // Choice id is the key, i.e A,B,C,D or E.
      text: String,
      image: String,
    },
  ],
});

module.exports = model("Question", schema);
