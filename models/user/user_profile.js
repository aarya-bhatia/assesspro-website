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
    dob: {
      day: Number,
      month: Number,
      year: Number,
    },
    address: {
      city: String,
      state: String,
      zip: String,
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    qualifications: {
      grade10: {
        subject: String,
        institution: String,
      },
      grade12: {
        subject: String,
        institution: String,
      },
      bachelors: {
        subject: String,
        institution: String,
      },
      masters: {
        subject: String,
        institution: String,
      },
      other: {
        subject: String,
        institution: String,
      },
    },
  },
  { timestamps: true }
);

const user_profile = model("user_profile", user_profile_schema);

module.exports = user_profile;
