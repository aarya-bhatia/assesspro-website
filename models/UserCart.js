const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessments: [
    {
      name: String,
      key: String,
      id: ObjectId,
      price: Number,
    },
  ],
});

module.exports = model("UserCart", schema);