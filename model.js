const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const candidate_schema = new Schema(
  {
    name: { type: String, required: true },
    age: Number,
    email: String,
    modules_enrolled: [ObjectId],
    modules_taken: [ObjectId],
    status: { type: String, enum: ["trial", "premium"] },
    answers: [
      {
        module_id: ObjectId,
        values: [
          { section_id: ObjectId, question_id: ObjectId, rating: Number },
        ],
      },
    ],
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const module_schema = new Schema({
  _id: ObjectId,
  name: String,
  time_limit: Number,
  instructions: String,
  num_sections: Number,
  sections: [
    {
      _id: ObjectId,
      name: String,
      module_id: ObjectId,
      num_questions: Number,
      questions: [
        {
          _id: ObjectId,
          section_id: { type: ObjectId, required: true },
          content: { type: String, required: true },
          grading_method: { type: String, enum: ["Rating", "Point"] },
          subparts: [],
        },
      ],
    },
  ],
});

exports.Candidate = mongoose.model("Candidate", candidate_schema);
exports.Module = mongoose.model("Module", module_schema);
