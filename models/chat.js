const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const MessageSchema = require("./schema/message");

const schema = new Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_id: {
    type: ObjectId,
    required: true,
  },
  contact_id: {
    type: ObjectId,
    required: true,
  },
  contact_email: {
    type: String,
    required: true,
  },
  contact_name: {
    type: String,
    required: true,
  },
  contact_img_url: {
    type: String,
    required: true,
  },
  messages: {
    type: [MessageSchema],
    validate: [(arr) => arr.length < 1000, "Maximum messages limit reached"],
  },
});

const model = mongoose.models.Chat || mongoose.model("Chat", schema);

module.exports = model;
