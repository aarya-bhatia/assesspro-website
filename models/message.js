const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  sender_name: {
    type: String,
    required: true,
  },
  sender_id: {
    type: ObjectId,
    required: true,
  },
  sender_img_url: {
    type: String,
    required: true,
  },
  receiver_name: {
    type: String,
    required: true,
  },
  receiver_id: {
    type: ObjectId,
    required: true,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
  read_at: Date,
  content: {
    type: String,
    trim: true,
    required: true,
    maxLength: 400,
  },
});

const model = mongoose.models.Message || mongoose.model("Message", schema);

module.exports = model;
