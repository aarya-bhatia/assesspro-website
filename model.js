const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const candidate_schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: Number,
    email: String,
    modules_enrolled: [ObjectId],
    modules_taken: [ObjectId],
    status: {
      type: String,
      enum: ["trial", "premium"],
    },
    answers: [answer_schema],
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const answer_schema = new Schema({
  module_id: ObjectId,
  section_id: ObjectId,
  values: [Number],
});

const module_schema = new Schema({
  name: String,
  time_limit: Number,
  instructions: String,
  sections: [section_schema],
});

const section_schema = new Schema({
  module_id: ObjectId,
  questions: [question_schema],
});

const question_schema = new Schema({
  section_id: {
    type: ObjectId,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  grading_method: {
    type: String,
    enum: ["Rating", "Point"],
  },
  subparts: [question_schema],
});

exports.Candidate = mongoose.model("Candidate", candidate_schema);
exports.Answer = mongoose.model("Answer", answer_schema);
exports.Question = mongoose.model("Question", question_schema);
exports.Section = mongoose.model("Section", section_schema);
exports.Module = mongoose.model("Module", module_schema);
