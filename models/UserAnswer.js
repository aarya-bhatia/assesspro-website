const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  module_id: ObjectId,
  question_id: ObjectId,
  value: String,
});

module.exports = model("UserAnswer", schema);