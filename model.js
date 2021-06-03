const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const assessment_schema = new Schema({
  name: String,
  modules: [ObjectId],
});

const user_schema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    age: Number,
    email: String,
    modules: [
      {
        module_id: ObjectId,
        answers: [{ question_id: ObjectId, value: Number }],
      },
    ],
  },
  { timestamps: true }
);

const module_schema = new Schema({
  name: String,
  time_limit: Number,
  instructions: String,
  type: {
    type: String,
    enum: ["subjective", "objective"],
    default: "subjective",
  },
  rating_scale: {
    min: Number,
    max: Number,
  },
});

const question_schema = new Schema({
  module_id: { type: ObjectId, required: true },
  content: { type: String, required: true },
  rating_direction: { type: Boolean, default: true }, // For rating questions
  answer_key: Number, // For scoring objective
});

exports.Assessment = mongoose.model("Assessment", assessment_schema);
exports.User = mongoose.model("User", user_schema);
exports.Module = mongoose.model("Module", module_schema);
exports.Question = mongoose.model("Question", question_schema);
