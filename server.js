const express = require("express");
const path = require("path");
const port = 3000 || process.env.PORT;
const app = express();
const moduleData = require("./data");

require("./mongodb")();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/images", express.static(__dirname + "public/images"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index", moduleData);
});

// Routers
app.use("/api", require("./routes"));

// Start server
app.listen(port, () => {
  console.log("Server has started on port " + port);
});
