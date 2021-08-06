const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: Number,
  assessment_key: String,
  category_id: Number,
  category_name: String,
  left_statement: String,
  right_statement: String,
});

module.exports = mongoose.model("LeftRightStatement", schema);
