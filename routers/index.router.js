const { sendEmail } = require("../services/send.email");
const { Category, Assessment } = require("../models");
const router = require("express").Router();

// Home page
router.get("/", async (req, res) => {
  const categories = await Category.find({});

  const data = [];

  for (const category of categories) {
    const assessments = await Assessment.find({ category_id: category._id });

    data.push({
      category_name: category.name,
      category_description: category.description,
      assessments,
    });
  }

  res.render("index", {
    data,
    ...res.locals,
  });
});

// Contact us
router.get("/contact-us", (req, res) => {
  res.render("contact.us.ejs", {
    loggedIn: res.locals.loggedIn,
    success: null,
    error: null,
  });
});

// Send Message
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

// 404 Handler
router.get("*", (req, res) => {
  res.status(404).render("error/404", { ...res.locals });
});

// Error handler
router.use((err, req, res, next) => {
  console.log(
    "=================================================================="
  );
  console.log(JSON.stringify(err));

  res.render("error/index", {
    message: err.message || "There was an error!",
    ...res.locals,
  });
});

module.exports = router;
