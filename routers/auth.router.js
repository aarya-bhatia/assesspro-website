const { Router } = require("express");
//const { User } = require("../model");
const passport = require("passport");
const router = Router();

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  // TODO: Handle with passport
  res.send("Logging out");
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback route for google to redirect to
// hand control to passport to use code and grab profile info
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send("You reached the redirect URL");
});

/* ignore for now

router.post("/login", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then(
      (user) =>
        new Promise((resolve, reject) => {
          if (!user) {
            reject({
              status: 400,
              message: "Username does not exist",
            });
          } else if (user.password != req.body.password) {
            reject({
              status: 400,
              message: "Password not valid",
            });
          } else {
            resolve(user);
          }
        })
    )
    .then((user) => res.status(200).json(user))
    .catch((err) => next(err));
});

router.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((duplicate) => {
      if (duplicate) {
        throw {
          status: 400,
          message: "Username is taken",
        };
      }

      User.create(req.body)
        .then((user) => res.status(201).json(user))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

*/

module.exports = router;
