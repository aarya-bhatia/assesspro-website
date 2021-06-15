const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const question_bank_schema = new Schema({
  module_name: String,
  module_id: ObjectId,
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["rating", "choice"],
  },
  options: [String],
  difficulty: Number,
});

const question_bank = model("question_bank", question_bank_schema);

module.exports = question_bank;
