const { sendEmail } = require("../services/send.email");
const router = require("express").Router();

// Contact us
router.get("/", (req, res) => {
  res.render("contact.us.ejs", {
    loggedIn: res.locals.loggedIn,
    success: null,
    error: null,
  });
});

// Send Message
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.render("contact.us.ejs", {
      ...res.locals,
      success: null,
      error: "Please provide a name, email and message.",
    });
  }

  try {
    console.log("Sending email to: ", process.env.CONTACT_US_EMAIL);

    await sendEmail(
      process.env.CONTACT_US_EMAIL,
      "Someone sent a message!",
      {
        name,
        email,
        message,
      },
      "./template/contact.us.ejs"
    );

    res.render("contact.us.ejs", {
      ...res.locals,
      success: "Message sent successfully...",
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.render("contact.us.ejs", {
      ...res.locals,
      success: null,
      error: err.message,
    });
  }
});

module.exports = router;
