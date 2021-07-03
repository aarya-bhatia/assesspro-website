const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

module.exports = new Schema({
  author_id: {
    type: ObjectId,
    required: true,
  },
  author_name: {
    type: String,
    required: true,
  },
  sent_at: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  content: {
    type: String,
    trim: true,
    required: true,
    maxLength: 400,
  },
});
