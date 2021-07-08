const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema({
  assessment_id: Number,
  module_id: Number,
  min_value: Number,
  max_value: Number,
  feedback: String,
});

module.exports = model("Feedback", schema);
