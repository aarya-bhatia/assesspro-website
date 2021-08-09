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

const FileLogger = require("log-to-file");

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
  .use("/contacts", isAuth, require("./routers/chats/contacts.router"))
  .use("/chats", isAuth, require("./routers/chats/chat.router"))
  .use("/assessments", require("./routers/assessment.router"))
  .get("/enroll/:key", [isAuth], EnrollUser)
  .get("/unenroll/:key", [isAuth, isEnrolled], UnenrollUser)
  .use(
    "/psychometric/:key",
    [isAuth, isEnrolled],
    require("./routers/psychometric/router")
  )
  .use("/creativity", isAuth, require("./routers/creativity.router"))
  .use(
    "/manager/assessments",
    [isAuth, isAdmin],
    require("./routers/admin/assessment.manager.router")
  )
  .use(require("./routers/index.router"));

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );

  // FileLogger(
  //   `Express server listening on port ${PORT} in ${app.settings.env}, mode`,
  //   "test.log"
  // );
});
