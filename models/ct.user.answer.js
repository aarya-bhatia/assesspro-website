const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  user_id: ObjectId,
  question_id: Number,
  value: Number, // from 1 to 6
  module_id: Number,
});

const model = mongoose.model("CTUserAnswer", schema);

module.exports = model;
