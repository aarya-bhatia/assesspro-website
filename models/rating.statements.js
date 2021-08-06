const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: Number,
  assessment_key: String,
  category_id: Number,
  category_name: String,
  statement: String,
});

module.exports = mongoose.model("RatingStatement", schema);
