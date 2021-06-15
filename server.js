// Load env vars
require("dotenv").config();

// imports
const express = require("express");
const path = require("path");
const cookieSession = require("cookie-session");
const passport = require("passport");

// connect to mongodb
require("./config/db.config.js");

// set up passport strategy
require("./config/passport.config.js");

// local imports
const moduleData = require("./data.json");
const { isAuth } = require("./controller/auth");

// create express app
const app = express();
const PORT = process.env.PORT || 3000;

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

// routers
app.use("/auth", require("./routers/auth.router"));
app.use("/users", isAuth, require("./routers/user.router"));

/*
app.use("/modules", require("./routers/module.router"));
app.use("/questions", require("./routers/question.router"));
app.use("/assessments", require("./routers/assessment.router"));
*/

// set up view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/assessments/nest", (req, res) => {
  res.render("assessments/nest", { user: req.user });
});

app.get("/assessment/form", (req, res) => {
  res.render("assessment", { ...moduleData, user: req.user });
});

// home route
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// 404
app.get("*", (req, res) => {
  res.status(404).render("404", { user: req.user });
});

// Error handler
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .json({ ...err, message: err.message || "There was an error!" });
});

// start listening on port
app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
