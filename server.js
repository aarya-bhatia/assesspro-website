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
const FileLogger = require("log-to-file");

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
const { connect, connection } = require("./config/db.config.js");

connect();

// set up passport strategy
require("./config/passport.config.js");

const { PageNotFound, ErrorHandler } = require("./controller/error");

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

const HomeRouter = require("./routers/home.router");
const AuthRouter = require("./routers/auth.router");
const UserRouter = require("./routers/user.router");
const ContactUsRouter = require("./routers/contact.router");
const DetailsRouter = require("./routers/details.router");
const AssessmentRouter = require("./routers/assessment.router");

// Routers
app.use("/", HomeRouter);
app.use("/auth", AuthRouter);
app.use("/users", isAuth, UserRouter);
app.use("/contact-us", ContactUsRouter);
app.use("/details", DetailsRouter);
app.use("/assessments", AssessmentRouter);

// Enroll and unenroll routes
app.get("/enroll/:key", [isAuth], EnrollUser);
app.get("/unenroll/:key", [isAuth, isEnrolled], UnenrollUser);

// Run after connecting with db
// connection.once("open", function () {
//   require("./routers/assessment.router")()
//     .then((router) => {
//       app.use("/assessments", router);
//     })
//     .catch((err) => {
//       FileLogger(JSON.stringify(err), "error.log");
//     });
// });

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
