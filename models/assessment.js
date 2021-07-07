const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    name: String,
    key: String,
    description: String,
    category_id: Number,
    category_name: String,
    plot_type: {
      type: String,
      enum: ["hbar", "bar", "spider", "line"],
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
