const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  user_id: ObjectId,
  question_id: Number,
  value: Number,
  module_id: Number,
});

const model = mongoose.model("UserResponse", schema);

module.exports = model;
