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

// middleware
const { isAuth, isAdmin, isLoggedIn } = require("./controller/auth");

const {
  isEnrolled,
  EnrollUser,
  UnenrollUser,
} = require("./controller/user.enroll");

// connect to mongodb
require("./config/db.config.js").connect();

// set up passport strategy
require("./config/passport.config.js");

const PsychometricAssessmentRouter = require("./routers/psychometric/router");
const CreativityAssessmentRouter = require("./routers/creativity.router");
const LeadershipAssessmentRouter = require("./routers/leadership.router");

// middleware and routers
app
  .use(express.static(path.join(__dirname, "public")))
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(require("cors")())
  .use(flash())
  .use(require("./config/cookie.session.config"))
  .use(passport.initialize())
  .use(passport.session())
  .use(isLoggedIn)
  .use("/auth", require("./routers/auth.router"))
  .use("/users", isAuth, require("./routers/user.router"))
  .use("/assessments", require("./routers/assessment.router"))
  .get("/enroll/:key", [isAuth], EnrollUser)
  .get("/unenroll/:key", [isAuth, isEnrolled], UnenrollUser)
  .use("/psychometric/:key", [isAuth, isEnrolled], PsychometricAssessmentRouter)
  .use("/creativity", isAuth, CreativityAssessmentRouter)
  .use("/leadership", isAuth, LeadershipAssessmentRouter)
  .use(require("./routers/index.router"));

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});
