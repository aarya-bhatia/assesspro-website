/**
 * The user assessment model is used to track
 * the assessments enrolled by the user. The id of the
 * object is the access code for this assessment.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
  {
    user_id: ObjectId,
    user_name: String,
    assessment_id: Number,
    assessment_key: String,
    assessment_name: String,
    assessment_category: String,
    assessment_plot_type: String,
    assessment_description: String,
    date_purchased: {
      type: Date,
      default: Date.now,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = model("UserAssessment", schema);
