/**
 * The user score model contains the result of the assessment.
 * It is created when the user submits the form. The object
 * contains the scores of each module. The score is used to
 * create the plot on the client side.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessment_name: String,
  assessment_id: ObjectId,
  assessment_key: String,
  plot_type: {
    type: String,
    default: "spider",
  },
  module_scores: [
    {
      _id: Number,
      name: String,
      score: Number,
    },
  ],
  date: Date,
  status: {
    type: String,
    enum: ["private", "public"],
    default: "public",
  },
});

module.exports = model("UserScore", schema);
