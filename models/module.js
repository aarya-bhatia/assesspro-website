const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const module_schema = new Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["objective", "subjective"],
    required: true,
  },
  instructions: String,
  time_limit: Number,
  rating_scale: [String],
});

const module = model("module", module_schema);

module.exports = module;
