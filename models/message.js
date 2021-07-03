const mongoose = require("mongoose");
const MessageSchema = require("./schema/message");
module.exports =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
