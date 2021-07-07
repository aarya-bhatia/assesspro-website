const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema(
  {
    _id: {
      type: Number,
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
  },
  { _id: false }
);

module.exports = model("Module", schema);
