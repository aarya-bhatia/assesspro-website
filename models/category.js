const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  key: Number,
  name: String,
  description: String,
});

module.exports = mongoose.model("Category", schema);
