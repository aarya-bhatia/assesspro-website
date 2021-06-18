const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = new mongoose.Schema(
  {
    category: String,
    name: String,
    key: String,
    description: String,
    plot_type: {
      type: String,
      enum: ["hbar", "bar", "spider", "line"],
      required: true,
    },
    public: {
      type: Boolean,
      default: true,
    },
    show_average: {
      type: Boolean,
      default: false,
    },
    modules: [{
      id: ObjectId,
      key: Number,
      name: String,
      no_questions: Number,
    }],
    price: Number,
    currency: {
      type: String,
      default: 'usd',
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assessment", schema);