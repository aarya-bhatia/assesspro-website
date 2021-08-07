const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  user_id: ObjectId,
  question_id: Number,
  value: Number,
  category_id: Number,
  category_name: String,
});

const model = mongoose.model("UserResponse", schema);

module.exports = model;
