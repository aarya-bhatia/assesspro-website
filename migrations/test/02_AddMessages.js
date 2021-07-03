const { connect } = require("../../config/db.config");
const { Chat, UserProfile } = require("../../models");

connect();

require("mongoose").connection.once("open", async () => {
  const user = await UserProfile.findOne({
    email: "aarya.bhatia1678@gmail.com",
  });

  const other_user = await UserProfile.findOne({
    email: "mistymelon@gmail.com",
  });

  const chat1 = await Chat.findOne({
    user_id: user._id,
    contact_id: other_user._id,
  });

  const chat2 = await Chat.findOne({
    user_id: other_user._id,
    contact_id: user._id,
  });

  chat1.messages = [];
  chat2.messages = [];

  const messages = [
    {
      author_id: user._id,
      author_name: user.name,
      content: "Hello, friend",
    },
    {
      author_id: user._id,
      author_name: user.name,
      content: "how are you",
    },
    {
      author_id: other_user._id,
      author_name: other_user.name,
      content: "I am having breakfast.",
    },
    {
      author_id: other_user._id,
      author_name: other_user.name,
      content: "Let's play a game of chess",
    },
    {
      author_id: user._id,
      author_name: user.name,
      content: "Okay",
    },
  ];

  for (const message of messages) {
    chat1.messages.push(message);
    chat2.messages.push(message);
    console.log("Adding message...");
  }

  await chat1.save();
  await chat2.save();

  console.log("Completed.");
});
