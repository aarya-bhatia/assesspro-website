const fs = require("fs");
const path = require("path");
const { Assessment } = require("../models");
const router = require("express").Router();

// Assessment details page
router.get("/:key", async (req, res) => {
  const { key } = req.params;
  const assessment = await Assessment.findOne({ key });
  const file = path.join(__dirname, "..", "views", "details", key + ".ejs");

  if (fs.existsSync(file)) {
    res.render("details/" + key, {
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
