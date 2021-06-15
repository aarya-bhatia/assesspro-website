const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const category_schema = new Schema({
  name: String,
  description: String,
});

const category = model("category", category_schema);

module.exports = category;
