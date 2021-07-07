const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: String,
    description: String,
  },
  { _id: false }
);

module.exports = mongoose.model("Category", schema);
