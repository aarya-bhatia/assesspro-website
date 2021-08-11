const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: String,
    description: String,
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { _id: false }
);

module.exports = mongoose.model("Category", schema);
