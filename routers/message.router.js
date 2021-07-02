const router = require("express").Router();
const { Message } = require("../models");

// GET /messages/:sender_id
router.get("/:sender_id", async (req, res) => {
  const query = {
    sender_id: req.params.sender_id,
    receiver_id: req.user._id,
  };

  if (req.query.older_than_date) {
    query.sent_at = {
      $lt: req.query.older_than || Date.now,
    };
  }

  const messages = await Message.find(query)
    .sort({ sent_at: -1 })
    .limit(req.query.limit || 100)
    .exec();

  res.render("messages/index", {
    loggedIn: res.locals.loggedIn,
    user: req.user,
    messages,
  });
});

// GET /messages
router.get("/", async (req, res) => {
  const query = {
    receiver_id: req.user._id,
  };

  if (req.query.older_than_date) {
    query.sent_at = {
      $lt: req.query.older_than || Date.now,
    };
  }

  let messages = await Message.find(query)
    .sort({ sent_at: -1 })
    .limit(req.query.limit || 100)
    .exec();

  const senderList = messages.reduce((acc, message) => {
    if (!acc.message.sender_id) {
      acc.message.sender_id = {
        name: message.sender_name,
        id: message.sender_id,
        img_url: message.sender_img_url,
        messages: [],
      };
    }
  }, {});

  const contacts = Object.keys(senderList).map((key) => senderList[key]);

  res.render("messages/index", {
    loggedIn: res.locals.loggedIn,
    user: req.user,
    messages,
    contacts,
  });
});

module.exports = router;
