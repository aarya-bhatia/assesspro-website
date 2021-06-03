const { PORT } = require("./config");
const express = require("express");
const path = require("path");
const moduleData = require("./data");

require("./mongodb")();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api/assessments", require("./routers/assessment.router"));
app.use("/api/modules", require("./routers/module.router"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", moduleData);
});

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found...");
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err);
});

app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
