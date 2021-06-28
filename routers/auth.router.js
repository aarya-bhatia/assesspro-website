const { Router } = require("express");
const passport = require("passport");
const router = Router();
const { CreateUser } = require("../controller/auth");
const { Token } = require("../models");
const { requestPasswordReset } = require("../services/auth.service");
const { sendEmail } = require("../services/send.email");
const bcrypt = require("bcrypt");
const { UserProfile } = require("../models");

// Auth Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", {
    loggedIn: res.locals.loggedIn,
    error: req.flash("error"),
  });
});

// Auth signup page
router.get("/signup", (req, res) => {
  res.render("auth/signup", {
    loggedIn: res.locals.loggedIn,
    error: { name: null, email: null, password: null },
  });
});

// Login with username & password
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/auth/login",
    failureFlash: true,
    successFlash: "Success!",
  })
);

// Sign up with username & password
router.post("/signup", CreateUser);

// Auth Logout/Redirect
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/passwordResetRequest", (req, res) => {
  res.render("auth/reset.password.ejs", {
    loggedIn: res.locals.loggedIn,
    error: null,
    message: null,
  });
});

router.post("/passwordResetRequest", async (req, res) => {
  const email = req.body.email;

  await requestPasswordReset(email).then(() => {
    res.render("auth/reset.password.ejs", {
      loggedIn: res.locals.loggedIn,
      error: null,
      message: "Please check your email info for further instructions.",
    });
  });
});

router.get("/passwordReset", async (req, res) => {
  const { token, id } = req.query;

  const tokenHash = await Token.findOne({ user_id: id });

  if (!tokenHash) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, tokenHash.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }
  res.render("auth/update.password.ejs", {
    loggedIn: res.locals.loggedIn,
    user_id: id,
    token,
  });
});

router.post("/passwordReset", async (req, res) => {
  const user_id = req.body.user_id;
  const token = req.body.token;
  const password = req.body.password;

  const tokenHash = await Token.findOne({ user_id });

  if (!tokenHash) {
    throw new Error("Invalid or expired password reset token");
  }

  const isValid = await bcrypt.compare(token, tokenHash.token);

  if (!isValid) {
    throw new Error("Invalid or expired password reset token");
  }

  user = await UserProfile.findById(user_id);
  user.password = password;
  await user.save();

  await tokenHash.deleteOne();

  await sendEmail(
    user.email,
    "Password Reset Successfully!",
    { name: user.name },
    "./template/reset.password.ejs"
  );

  res.redirect("/auth/login");
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// auth with facebook
router.get("/facebook", passport.authenticate("facebook", { scope: [] }));

// auth with twitter
router.get("/twitter", passport.authenticate("twitter", { scope: [] }));

// auth callback google
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/users/profile");
});

// auth callback facebook
router.get(
  "/facebook/redirect",
  passport.authenticate("facebook"),
  (req, res) => {
    res.redirect("/users/profile");
  }
);

// auth callback twitter
router.get(
  "/twitter/redirect",
  passport.authenticate("twitter"),
  (req, res) => {
    res.redirect("/users/profile");
  }
);

module.exports = router;
