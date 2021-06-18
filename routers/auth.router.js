const { Router } = require("express");
const passport = require("passport");

const router = Router();

// Auth Login Page
router.get("/login", (req, res) => {
  res.render("auth/login", { loggedIn: req.user ? true : false });
});

// Auth Logout/Redirect
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// auth with google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// auth with facebook
router.get("/facebook", passport.authenticate("faceboo", { scope: [] }));

// auth with twitter
router.get("/twitter", passport.authenticate("twitter", { scope: [] }));

// auth with email
router.get("/email", passport.authenticate("email", { scope: [] }));

// auth callback google
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/users/profile");
});

// auth callback facebook
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/users/profile')
})

// auth callback twitter
router.get('/twitter/redirect', passport.authenticate('twitter'), (req, res) => {
  res.redirect('/users/profile')
})

// auth callback email
router.get('/email/redirect', passport.authenticate('main'), (req, res) => {
  res.redirect('/users/profile')
})

module.exports = router;
