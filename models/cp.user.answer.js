const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  user_id: ObjectId,
  _id: ObjectId, // question id
  value: Number, // from 1 to 6
  module_id: Number,
});

const model = mongoose.model("CPUserAnswer", schema);

module.exports = model;
