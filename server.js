// Catch all async errors
require("express-async-errors");

// Load env vars
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// set up dependencies
const express = require("express");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");

// create express app
const app = express();
const PORT = process.env.PORT || 3000;

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// auth middleware
const { isAuth, checkUserEnrolled, isLoggedIn } = require("./controller/auth");

// connect to mongodb
require("./config/db.config.js").connect();

// set up passport strategy
require("./config/passport.config.js");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());
app.use(flash());
app.use(require("./config/cookie.session.config"));
app.use(passport.initialize());
app.use(passport.session());
app.use(isLoggedIn);

// static assets
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(
  "/favicon_io",
  express.static(path.join(__dirname, "public/favicon_io"))
);

// Auth Router
app.use("/auth", require("./routers/auth.router"));

// Assessment Router
app.use("/assessments", require("./routers/assessment.router"));

// Creativity assessments router
app.use("/creativity", require("./routers/creativity.assessment.router"));

// User Router
app.use("/users", isAuth, require("./routers/user.router"));

// Forms Router
app.use(
  "/forms/:assessment_id",
  [isAuth, checkUserEnrolled],
  require("./routers/forms.router")
);

// Root route
app.use(require("./routers/index.router"));

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});
