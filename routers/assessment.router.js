const fs = require("fs");
const path = require("path");
const { Assessment } = require("../models");
const router = require("express").Router();

router.get("/:key", async (req, res) => {
  const { key } = req.params;
  const assessment = await Assessment.findOne({ key });
  const file = path.join(__dirname, "..", "views", "assessments", key + ".ejs");

  if (fs.existsSync(file)) {
    res.render("assessments/" + key, {
      ...res.locals,
      assessment,
    });
  } else {
    console.log("Assessment not found: ", key);
    res.render("error/index", {
      loggedIn: res.locals.loggedIn,
      message: "Sorry, this assessment is not currently available!",
    });
  }
});

module.exports = router;
