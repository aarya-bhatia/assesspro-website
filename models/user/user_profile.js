const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const user_profile_schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    img_url: String,
    provider: {
      type: {
        name: String,
        id: String,
      },
      required: true,
    },
    bio: String,
    dob: String,
    city: String,
    state: String,
    country: String,
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    qualifications: [
      {
        title: String,
        subjects: [String],
        institution: String,
      },
    ],
  },
  { timestamps: true }
);

const user_profile = model("user_profile", user_profile_schema);

module.exports = user_profile;
