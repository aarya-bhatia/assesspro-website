// Catch all async errors
require("express-async-errors");

// Load env vars
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// dependencies
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

// import middleware
const { isAuth, isLoggedIn } = require("./controller/auth");

const {
  isEnrolled,
  EnrollUser,
  UnenrollUser,
} = require("./controller/user.enroll");

// connect to mongodb
require("./config/db.config.js").connect();

// set up passport strategy
require("./config/passport.config.js");

const { PageNotFound, ErrorHandler } = require("./controller/error");

const HomeRouter = require("./routers/home.router");
const AuthRouter = require("./routers/auth.router");
const UserRouter = require("./routers/user.router");
const AssessmentRouter = require("./routers/assessment.router");
const PsychometricAssessmentRouter = require("./routers/psychometric/router");
const CreativityAssessmentRouter = require("./routers/creativity.router");
const LeadershipAssessmentRouter = require("./routers/leadership.router");
const ContactUsRouter = require("./routers/contact.router");

// Middlewares
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());
app.use(flash());
app.use(require("./config/cookie.session.config"));
app.use(passport.initialize());
app.use(passport.session());
app.use(isLoggedIn);

// Routers
app.use("/", HomeRouter);
app.use("/auth", AuthRouter);
app.use("/users", isAuth, UserRouter);
app.use("/assessments", AssessmentRouter);

// Assessment routers
app.use(
  "/psychometric/:key",
  [isAuth, isEnrolled],
  PsychometricAssessmentRouter
);
app.use("/creativity", isAuth, CreativityAssessmentRouter);
app.use("/leadership", isAuth, LeadershipAssessmentRouter);
app.use("/contact-us", ContactUsRouter);

// Enroll and unenroll routes
app.get("/enroll/:key", [isAuth], EnrollUser);
app.get("/unenroll/:key", [isAuth, isEnrolled], UnenrollUser);

// Error handlers
app.get("*", PageNotFound);
app.use(ErrorHandler);

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});
