const router = require("express").Router();
const { Message, Chat, UserProfile } = require("../../models");

// Get all chats for current user
// GET /chats
router.get("/", async (req, res) => {
  const chats = await Chat.find({
    user_id: req.user._id,
  });

  const users = await UserProfile.find();

  res.render("messages/index", {
    loggedIn: true,
    user: req.user,
    chats,
    users,
  });
});

// Create chat with contact
// POST /chats
router.post("/", async (req, res) => {
  // TODO
});

// Send a message in chat
// POST /chats/:chat_id/message
router.post("/:chat_id/message", async (req, res) => {
  const user = req.user;
  const { content } = req.body;
  const chat = Chat.findById(req.params.chat_id);

  const message = new Message({
    author_name: user.name,
    author_id: user._id,
    content,
    sent_at: new Date(),
    read: false,
  });

  chat.messages.push(message);
  await chat.save();
  res.json(message);
});

// Delete message
// GET /chats/:chat_id/delete/:message_id
router.get("/:chat_id/delete/:message_id", async (req, res) => {
  const chat = await Chat.findById(req.params.chat_id);
  chat.messages = chat.messages.filter((message) => {
    message._id != req.params.message_id;
  });
  await chat.save();
  res.json(chat);
});

// Read messages
// GET /chats/:chat_id/read
router.get("/:chat_id/read", async (req, res) => {
  const chat = await Chat.findById(req.params.chat_id);
  chat.messages.forEach((message) => {
    if (!message.read) {
      message.read = true;
    }
  });
  await chat.save();
  res.json(chat);
});

module.exports = router;
