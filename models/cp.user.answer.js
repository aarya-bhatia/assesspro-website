const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  user_id: ObjectId,
  question_id: ObjectId,
  value: Number, // from 1 to 6
});

const model = mongoose.model("CPUserAnswer", schema);

module.exports = model;
