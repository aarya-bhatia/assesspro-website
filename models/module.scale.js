const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: Number,
  name: String,
  type: String,
  scale_factor: Number,
});

const model = mongoose.model("ModuleScale", schema);

module.exports = model;
