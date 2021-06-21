const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema({
  name: { type: String, required: true },
  key: Number,
  type: {
    type: String,
    enum: ["Objective", "Subjective"],
    required: true,
  },
  description: String,
  time_limit: Number,
  no_questions: Number,
  no_choices: Number,
  scale_factor: Number,
});

module.exports = model("Module", schema);
