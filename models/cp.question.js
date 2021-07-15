const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  module_id: Number,
  module_name: String,
  left: String,
  right: String,
});

const model = mongoose.model("CPQuestion", schema);

module.exports = model;
