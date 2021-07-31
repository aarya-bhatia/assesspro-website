const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  module_id: Number,
  min_value: Number,
  max_value: Number,
  feedback: String,
  description: String,
});

module.exports = mongoose.model("NESTFeedback", schema);
