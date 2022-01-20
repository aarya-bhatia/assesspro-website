/**
 * The user score model contains the result of the assessment.
 * It is created when the user submits the form. The object
 * contains the scores of each module. The score is used to
 * create the plot on the client side.
 */

const mongoose = require("mongoose");
const timezone = require("mongoose-timezone");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessment_name: String,
  assessment_id: Number,
  assessment_key: String,
  description: String,
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
  score: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["private", "public"],
    default: "public",
  },
});

schema.plugin(timezone, { paths: ["date"] });

module.exports = model("UserScore", schema);
