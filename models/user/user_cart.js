const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;
const ObjectId = Schema.Types.ObjectId;

const user_cart_schema = new Schema({
  user_id: ObjectId,
  assessments: [
    {
      name: String,
      id: ObjectId,
      price: Number,
    },
  ],
});

const user_cart = model("user_cart", user_cart_schema);

module.exports = user_cart;
