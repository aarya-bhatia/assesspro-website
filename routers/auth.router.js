const { Router } = require("express");
const passport = require("passport");
const router = Router();

// auth login
router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

// auth logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// auth with google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google auth callback route
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.redirect("/users/profile");
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
