const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessment_id: Number,
  assessment_key: String,
  module_id: Number,
  module_name: String,
  no_questions: Number,
  no_attempted: Number,
  time_spent: Number,
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
});

module.exports = model("UserModule", schema);
