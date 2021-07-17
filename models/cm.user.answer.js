const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: Number,
  user_id: Schema.Types.ObjectId,
  points_assigned: [
    {
      _id: String, // option id
      points: Number, // option points
    },
  ],
});

schema.pre("save", async function (next) {
  let total = 0;
  for (const { points } of this.points_assigned) {
    total += points;
  }
  if (total > 30) {
    throw new Error("Total points exceeded 30...");
  } else {
    next();
  }
});

const model = mongoose.model("CMUserAnswer", schema);

module.exports = model;
