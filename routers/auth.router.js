const { Router } = require("express");
const { User } = require("../model");

const router = Router();

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

module.exports = router;
