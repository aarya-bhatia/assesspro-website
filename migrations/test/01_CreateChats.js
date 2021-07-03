const { connect, dropCollections } = require("../../config/db.config");
const { Chat, UserProfile } = require("../../models");

connect();

require("mongoose").connection.once("open", async () => {
  await dropCollections(["chats"]);

  const user = await UserProfile.findOne({
    email: "aarya.bhatia1678@gmail.com",
  });

  const other_user = await UserProfile.findOne({
    email: "mistymelon@gmail.com",
  });

  await Chat.create({
    user_name: user.name,
    user_id: user._id,
    contact_id: other_user._id,
    contact_name: other_user.name,
    contact_email: other_user.email,
    contact_img_url: other_user.img_url,
    messages: [],
  });

  await Chat.create({
    user_name: other_user.name,
    user_id: other_user._id,
    contact_id: user._id,
    contact_name: user.name,
    contact_email: user.email,
    contact_img_url: user.img_url,
    messages: [],
  });
});
