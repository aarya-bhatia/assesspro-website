const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const assessments_schema = new Schema(
  {
    category_name: String,
    category_id: ObjectId,
    name: String,
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
        id: ObjectId,
        name: String,
      },
    ],
    price: Number,
  },
  { timestamps: true }
);

const assessment = model("assessment", assessments_schema);

module.exports = assessment;
