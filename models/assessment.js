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
      index: true,
    },
    description: String,
    category_id: Number,
    category_name: String,
    plot_type: {
      type: String,
      enum: ["hbar", "vbar", "spider", "line", "pie", "none"],
      required: true,
    },
    price: Number,
    currency: {
      type: String,
      default: "usd",
    },
    short_para: String,
    assessment_url: String,
  },
  { _id: false }
);

module.exports = mongoose.model("Assessment", schema);
