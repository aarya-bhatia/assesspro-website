const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema(
  {
    _id: { type: Number },
    assessment_id: { type: Number, required: true },
    assessment_key: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, trim: true },
    instructions: { type: String, trim: true, required: false },
    no_questions: Number,
    type: { type: String, enum: ["Objective", "Subjective"] },
    scale_factor: Number,
  },
  { _id: false }
);

module.exports = model("Module", schema);
