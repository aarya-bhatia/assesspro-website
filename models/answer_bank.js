const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const answer_bank_schema = new Schema({
  question_id: ObjectId,
  value: String,
});

const answer_bank = model("answer_bank", answer_bank_schema);

module.exports = answer_bank;
