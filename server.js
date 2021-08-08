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
const {
  isAuth,
  isAdmin,
  checkUserEnrolled,
  isLoggedIn,
} = require("./controller/auth");

const {
  isEnrolled,
  EnrollUser,
  UnenrollUser,
} = require("../controller/user.enroll");

// connect to mongodb
require("./config/db.config.js").connect();

// set up passport strategy
require("./config/passport.config.js");

// middleware
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
app.use("/auth", require("./routers/auth.router"));
app.use("/assessments", require("./routers/assessment.router"));

router.get("/enroll/:key", [isAuth, isEnrolled], EnrollUser);
router.get("/unenroll/:key", [isAuth, isEnrolled], UnenrollUser);

app.use("/users", isAuth, require("./routers/user.router"));
app.use("/contacts", isAuth, require("./routers/contacts.router"));
app.use("/chats", isAuth, require("./routers/chat.router"));

app.use(
  "/assessments/:key",
  [isAuth, isEnrolled],
  require("./routers/forms.router")
);

app.use(
  "/psychometric/:key",
  [isAuth, isEnrolled],
  require("./routers/psychometric/router")
);
app.use("/creativity", isAuth, require("./routers/creativity.router"));

app.use(
  "/manager/assessments",
  [isAuth, isAdmin],
  require("./routers/admin/assessment.manager.router")
);

app.use(require("./routers/index.router"));

// start listening on port
app.listen(PORT, () => {
  console.log(
    "Express server listening on port %d in %s mode",
    PORT,
    app.settings.env
  );
});
