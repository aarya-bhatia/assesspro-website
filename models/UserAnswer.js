/**
 * The user answer maintains the user's answers for each
 * question, in each module. The choice_id is the important
 * part, which links the answer to the choice selected by the user
 * in the question. Each choice in the db contains a point which
 * is used to calculate the total score.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  assessment_key: String,
  user_id: { type: ObjectId, required: true },
  question_id: { type: Number, required: true },
  module_id: { type: Number, required: true },
  module_name: String,
  choice: String,
  value: String,
});

module.exports = model("UserAnswer", schema);
