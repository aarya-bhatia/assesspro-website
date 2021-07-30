const { sendEmail } = require("../services/send.email");
const router = require("express").Router();

router.get("/contact-us", (req, res) => {
  res.render("contact.us.ejs", {
    loggedIn: res.locals.loggedIn,
    success: null,
    error: null,
  });
});

router.post("/contact-us", async (req, res) => {
  const { name, email, message } = req.body;
  console.log(req.body);
  try {
    sendEmail(
      process.env.CONTACT_US_EMAIL,
      "Someone sent a message!",
      {
        name,
        email,
        message,
      },
      "./template/contact.us.ejs"
    ).then(() => {
      console.log("email sent.");
    });

    res.render("contact.us.ejs", {
      loggedIn: res.locals.loggedIn,
      success: "Message sent successfully...",
      error: null,
    });
  } catch (err) {
    console.log(err);
    res.render("contact.us.ejs", {
      loggedIn: res.locals.loggedIn,
      success: null,
      error: err.message,
    });
  }
});

module.exports = router;
