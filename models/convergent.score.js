const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema(
  {
    user_id: ObjectId,
    score: Number
  },
  { timestamps: true }
);

const model = mongoose.model("ConvergentScore", schema);

module.exports = model;
