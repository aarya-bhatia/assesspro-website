const { capitalize, buildSignupErrorObject } = require("../controller/util");
const { UserAssessment, Assessment } = require("../models");
const { getUserAssessment, createUserProfile } = require("./api/user");

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
  res.locals.loggedIn = req.isAuthenticated();
  next();
};

/**
 * Middleware to check if user is enrolled in assessment before they can access it
 */
module.exports.checkUserEnrolled = async (req, res, next) => {
  const { assessment_id } = req.params;

  res.locals.assessment_id = assessment_id;

  const found = await getUserAssessment(req.user._id, assessment_id);

  if (!found) {
    return res.render("error/index", {
      ...res.locals,
      message: "Access Denied. User is not enrolled in this assessment.",
    });
  }

  res.locals.user_assessment = found;
  next();
};

module.exports.checkUserEnrolledByKey = async (req, res, next) => {
  const { key } = req.params;
  res.locals.key = key;

  // console.log("KEY: ", key);
  // console.log(req.url);

  if (req.url.split("/")[1] == "enroll") {
    // console.log("skipping middleware...");
    return next();
  }

  const found = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_key: key,
  });

  if (!found) {
    console.log("Error");

    return res.status(400).render("error/index", {
      message: "Access Denied. User is not enrolled in this assessment.",
      ...res.locals,
    });
  }

  res.locals.user_assessment = found;
  // console.log("success...");
  next();
};

/*
 * Register new user
 */
module.exports.CreateUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const name = [capitalize(firstname), capitalize(lastname)].join(" ");

  try {
    const user = await createUserProfile(name, email, password);
    console.log("User created [id]", user._id);
    res.redirect("/auth/login");
  } catch (err) {
    console.log(err);
    res.render("auth/signup", {
      loggedIn: res.locals.loggedIn,
      error: buildSignupErrorObject(err),
    });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  if (req.user.role == "admin") {
    return next();
  } else {
    res.render("error/index", {
      ...res.locals,
      message: "Admin access is required.",
    });
  }
};
