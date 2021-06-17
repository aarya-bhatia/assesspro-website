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
  instructions: String,
  time_limit: Number,
});

module.exports = model("Module", schema);