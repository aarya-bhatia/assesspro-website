const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  contact_id: ObjectId,
  contact_name: String,
  contact_img_url: String,
  status: {
    type: String,
    enum: ["Pending", "Blocked", "Active"],
  },
});

const model = mongoose.models.Contact || mongoose.model("Contact", schema);

module.exports = model;
