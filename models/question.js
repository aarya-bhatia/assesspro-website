const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const question_schema = new Schema({
  module_name: String,
  module_id: ObjectId,
  module_key: Number,
  content: String,
  image: String,
  choices: [
    {
      key: Number,
      text: String,
      image: String,
      points: Number
    }
  ]
});

module.exports = model("question", question_schema);