const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
      unique: true,
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
    public: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", schema);
