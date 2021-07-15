const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: {
    type: ObjectId,
    required: true,
    ref: "UserProfile",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  type: {
    type: String,
    enum: ["PASSWORD_RESET", "EMAIL_CONFIRMATION"],
    default: "PASSWORD_RESET",
    required: true,
  },
});

const model = mongoose.model("Token", schema);

module.exports = model;
