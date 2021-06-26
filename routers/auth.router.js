const { Router } = require("express");
const passport = require("passport");
const router = Router();
const { CreateUser } = require("../controller/auth");

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
