const { Assessment, Category } = require("../models");
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
    await sendEmail(
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
      res.render("contact.us.ejs", {
        loggedIn: res.locals.loggedIn,
        success: "Message sent successfully...",
        error: null,
      });
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

// root route
router.get("/", async (req, res) => {
  const categories = await Category.find({});
  const data = [];

  for (const category of categories) {
    const assessments = await Assessment.find({ category_key: category.key });
    data.push({
      category_name: category.name,
      category_description: category.description,
      assessments,
    });
  }

  res.render("index", {
    data,
    loggedIn: res.locals.loggedIn,
  });
});

// 404 Handler
router.get("*", (req, res) => {
  res.status(404).render("error/404", { loggedIn: res.locals.loggedIn });
});

// Error handler
router.use((err, req, res, next) => {
  console.log(
    "=================================================================="
  );
  console.log(err);

  res.render("error/index", {
    loggedIn: res.locals.loggedIn,
    message: err.message || "There was an error!",
  });
});

module.exports = router;
