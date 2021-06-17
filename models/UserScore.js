const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  module_id: ObjectId,
  module_name: String,
  score: Number,
});

module.exports = model("UserScores", schema);