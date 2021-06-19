// Load env vars
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// imports
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const passport = require("passport");

// connect to mongodb
require("./config/db.config.js").connect();

// set up passport strategy
require("./config/passport.config.js");

// create express app
const app = express();
const PORT = process.env.PORT || 3000;

// DB Models
const { Assessment } = require("./models");

// auth middleware
const { isAuth, checkUserEnrolled, isLoggedIn } = require("./controller/auth");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// static assets
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(
  "/favicon_io",
  express.static(path.join(__dirname, "public/favicon_io"))
);

app.use(isLoggedIn)

// routers
app.use("/auth", require("./routers/auth.router"));
app.use('/assessments', require('./routers/assessment.router'))

// Restricted routes
app.use("/users", isAuth, require("./routers/user.router"));
app.use('/forms/:assessment_id', [isAuth, checkUserEnrolled], require('./routers/forms.router'))

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// home route
app.get("/", async (req, res) => {
  const assessments = await Assessment.find({ public: true })
  // console.log('Assessments: ', assessments)
  // console.log(res.locals)
  res.render("index", { assessments, loggedIn: res.locals.loggedIn });
});

// 404
app.get("*", (req, res) => {
  res.status(404).render("error/404", { loggedIn: res.locals.loggedIn });
});

// Error handler
app.use((err, req, res, next) => {
  console.log('==================================================================')
  console.log(err);
  res
    .status(err.status || 500)
    .json({ ...err, message: err.message || "There was an error!" });
});

// start listening on port
app.listen(PORT, () => {
  // console.log("Server has started on port " + PORT);
  console.log("Express server listening on port %d in %s mode", PORT, app.settings.env);
});
