const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  assessment_key: String,
  question_id: Number,
  choice: String,
  points: Number,
});

module.exports = model("Answer", schema);
