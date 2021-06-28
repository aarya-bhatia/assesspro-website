const { UserAssessment, UserProfile } = require("../models");
const bcrypt = require("bcrypt");
const { capitalize } = require("../controller/util");

/*
 * Middleware to check if user is logged in
 */
module.exports.isAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  res.locals.loggedIn = req.user ? true : false;
  next();
};

/**
 * Middleware to check if user is enrolled in assessment before they can access it
 */
module.exports.checkUserEnrolled = async (req, res, next) => {
  const { assessment_id } = req.params;

  res.locals.assessment_id = assessment_id;

  const found = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_id,
  });

  if (found) {
    res.locals.user_assessment = found;
    next();
  } else {
    next({
      status: 400,
      message: "Access Denied. User is not enrolled in this assessment.",
    });
  }
};

/*
 * Register new user
 */
module.exports.CreateUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const name = [capitalize(firstname), capitalize(lastname)].join(" ");

  let user = new UserProfile({ name, email, password });

  console.log(req.body);
  console.log(name);

  try {
    user = await user.save();
    console.log("Saved user.");
    res.redirect("/auth/login");
  } catch (err) {
    const error = {};

    if (err.name === "ValidationError") {
      const { errors } = err;
      if (errors.name) {
        error.name = errors.name.message;
      }
      if (errors.email) {
        error.email = errors.email.message;
      }
      if (errors.password) {
        error.password = errors.password.message;
      }
    }

    error.other = err.message;

    console.log(error);

    res.render("auth/signup", {
      loggedIn: res.locals.loggedIn,
      error,
    });
  }
};
