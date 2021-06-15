// library imports
const express = require("express");
const path = require("path");
const fs = require("fs");

// connect to mongodb
require("./init.db");

// set up passport strategy
require("./config/passport_setup.js");

// local imports
const moduleData = require("./data.json");

// create express app
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

// static assets
app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// routers
app.use("/auth", require("./routers/auth.router"));
// app.use("/api/users", require("./routers/user.router"));
// app.use("/api/modules", require("./routers/module.router"));
// app.use("/api/questions", require("./routers/question.router"));
// app.use("/api/assessments", require("./routers/assessment.router"));

// set up view engine
//app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/assessments/nest", (req, res) => {
  res.render("assessments/nest");
});

// home route
app.get("/assessment/form", (req, res) => {
  res.render("index", moduleData);
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

// 404 route
app.get("*", (req, res) => {
  res.status(404).send("Sorry, page was not found.");
});

// Error handler
app.use((err, req, res, next) => {
  console.log("ERROR: ", err);
  res.status(err.status || 500).send("Error: " + JSON.stringify(err));
});

// start listening on port
app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
