const { PORT, DB_URL } = require("./config");
const express = require("express");
const path = require("path");
const moduleData = require("./data");
const mongoose = require("mongoose");

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((err) => {
    console.log("Error connecting to database", err);
    process.exit(0);
  });

process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log("closing connection with database");
    process.exit(0);
  });
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use(express.static("public"));
app.use("/css", express.static(path.join(__dirname, "public/css")));
app.use("/js", express.static(path.join(__dirname, "public/js")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use("/api", require("./routers/auth.router"));
app.use("/api/users", require("./routers/user.router"));
app.use("/api/modules", require("./routers/module.router"));
app.use("/api/questions", require("./routers/question.router"));
app.use("/api/assessments", require("./routers/assessment.router"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", moduleData);
});

app.get("*", (req, res) => {
  res.status(404).send("Page Not Found...");
});

app.use((err, req, res, next) => {
  console.log(JSON.stringify(err));
  res.status(err.status || 500).json(err);
});

app.listen(PORT, () => {
  console.log("Server has started on port " + PORT);
});
