const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/**
 * The user assessment model is used to track
 * the assessments enrolled by the user. The id of the
 * object is the access code for this assessment.
 */

const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  user_name: String,
  assessment_id: ObjectId,
  assessment_key: ObjectId,
  assessment_name: String,
  data_purchased: {
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
  reports: {
    created: Boolean,
    file_url: String,
    date_created: Date,
    prev_file_urls: [String],
  },
  plots: {
    created: Boolean,
    file_url: String,
    date_created: Date,
    prev_file_urls: [String],
  },
});

module.exports = model("UserAssessment", schema);