const { capitalize } = require("../controller/util");
const { createUserProfile } = require("./api/user");

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

/*
 * check if user is authenticated
 */
module.exports.isLoggedIn = (req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  next();
};

/*
 * Check if user role is admin
 */
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

    res.render("auth/signup", {
      loggedIn: res.locals.loggedIn,
      error,
    });
  }
};
