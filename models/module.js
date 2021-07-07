const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["Objective", "Subjective"],
    required: true,
  },
  description: String,
  feedback_description: String,
  time_limit: Number,
  no_questions: Number,
  scale_factor: Number,
});

module.exports = model("Module", schema);
