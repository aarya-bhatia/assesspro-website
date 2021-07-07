const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  _id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: String,
  description: String,
});

module.exports = mongoose.model("Category", schema);
