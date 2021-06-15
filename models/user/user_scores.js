const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const user_scores_schema = new Schema({
  user_id: ObjectId,
  module_id: ObjectId,
  module_name: String,
  score: Number,
});

const user_scores = model("user_scores", user_scores_schema);

module.exports = user_scores;
