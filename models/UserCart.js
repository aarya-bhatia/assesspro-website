const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const schema = new Schema({
  user_id: ObjectId,
  assessments: [
    {
      _id: Number,
      key: String,
      name: String,
      price: Number,
    },
  ],
});

module.exports = model("UserCart", schema);
