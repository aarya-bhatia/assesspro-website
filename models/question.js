const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  module_name: String,
  module_id: ObjectId,
  module_key: Number,
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
