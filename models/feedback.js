const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  assessment_id: ObjectId,
  assessment_key: String,
  module_key: Number,
  module_id: ObjectId,
  min_value: Number,
  max_value: Number,
  feedback: String,
});

module.exports = model("Feedback", schema);
