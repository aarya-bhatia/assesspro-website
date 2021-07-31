const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: Number,
  module_id: Number,
  module_name: String,
  statement: String,
});

const model = mongoose.model("CTQuestion", schema);

module.exports = model;
