const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const user_answers_schema = new Schema({
  user_id: ObjectId,
  module_id: ObjectId,
  question_id: ObjectId,
  value: String,
});

const user_answers = model("user_answers", user_answers_schema);

module.exports = user_answers;
