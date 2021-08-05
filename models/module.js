const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const schema = new Schema(
  {
    _id: {
      type: Number,
    },
    name: { type: String, required: true },
    description: { type: String, trim: true },
    instructions: { type: String, trim: true, required: false },
    no_questions: Number,
  },
  { _id: false }
);

module.exports = model("Module", schema);
