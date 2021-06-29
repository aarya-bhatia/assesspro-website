const { Assessment } = require("../models");
const fs = require("fs");
const path = require("path");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { key } = await Assessment.findById(id);

  const file = path.join(__dirname, "..", "views", "assessments", key + ".ejs");
  // console.log("Looking for assessment: ", file.toString());

  if (fs.existsSync(file)) {
    res.render("assessments/" + key, {
      loggedId: res.locals.loggedIn,
      assessment_id: id,
    });
  } else {
    res.render("error/index", {
      loggedIn: res.locals.loggedIn,
      message: "Sorry, this assessment is not currently available!",
    });
  }
});

module.exports = router;
