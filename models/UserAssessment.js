const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  username: String,
  enrollment_id: ObjectId,
  assessment_id: ObjectId,
  assessment_name: String,
  data_purchased: {
    type: Date,
    default: Date.now,
  },
  date_taken: Date,
  attempts: {
    type: Number,
    default: 0,
  },
  completed: Boolean,
  status: {
    type: String,
    enum: ["private", "public"],
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