const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: String,
    key: {
      type: String,
      unique: true,
    },
    description: String,
    category_id: Number,
    category_name: String,
    plot_type: {
      type: String,
      enum: ["hbar", "vbar", "spider", "line", "pie", "none"],
      required: true,
    },
    modules: [
      {
        _id: Number,
        name: String,
      },
    ],
    price: Number,
    currency: {
      type: String,
      default: "usd",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

module.exports = mongoose.model("Assessment", schema);
