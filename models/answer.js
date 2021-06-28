const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  question_id: ObjectId,
  choice: String,
  points: Number,
});

module.exports = model("Answer", schema);
