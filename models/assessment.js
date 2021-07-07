const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    category_key: Number,
    category_name: String,
    name: String,
    key: String,
    description: String,
    plot_type: {
      type: String,
      enum: ["hbar", "bar", "spider", "line"],
      required: true,
    },
    show_average: {
      type: Boolean,
      default: false,
    },
    modules: [
      {
        _id: ObjectId,
        key: Number,
        name: String,
      },
    ],
    price: Number,
    currency: {
      type: String,
      default: "usd",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", schema);
