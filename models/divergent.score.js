const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  scores: [
    {
      _id: Number,
      question: String,
      score: Number,
    },
  ],
});

const model = mongoose.model("DivergentScore", schema);

module.exports = model;
