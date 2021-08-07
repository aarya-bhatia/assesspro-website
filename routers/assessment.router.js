const { Assessment } = require("../models");
const fs = require("fs");
const path = require("path");

const router = require("express").Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const assessment = await Assessment.findById(id);
  const key = assessment.key;
  const file = path.join(__dirname, "..", "views", "assessments", key + ".ejs");

  if (fs.existsSync(file)) {
    res.render("assessments/" + key, {
      loggedId: res.locals.loggedIn,
      assessment,
      assessment_id: id,
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
