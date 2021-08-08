const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessment_key: String,
  key: String,
  value: String,
});

const model = mongoose.model("KeyValueResponse", schema);

module.exports = model;
