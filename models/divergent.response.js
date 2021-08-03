const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: { type: ObjectId, required: true },
  question_id: { type: Number, required: true },
  responses: [
    {
      content: { type: String, required: true, trim: true },
    },
  ],
  time_spent: { type: Number, default: 0 },
});

const model = mongoose.model("DivergentResponse", schema);

module.exports = model;
