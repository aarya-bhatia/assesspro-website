const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
  {
    user_name: { type: String, required: true },
    user_id: { type: ObjectId, required: true },
    question_id: { type: Number, required: true },
    content: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const model = mongoose.model("DivergentResponse", schema);

module.exports = model;
