const mongoose = require("mongoose");

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = mongoose.Schema({
  user_id: {
    type: ObjectId,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  assessment_id: {
    type: ObjectId,
    required: true,
  },
  assessment_key: {
    type: String,
    required: true,
  },
  assessment_name: {
    type: String,
    required: true,
  },
  module_id: {
    type: ObjectId,
    required: true,
  },
  module_key: {
    type: Number,
    required: true,
  },
  module_name: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },
});

const model = mongoose.models.Score || mognosee.model("Score", schema);

module.exports = model;
