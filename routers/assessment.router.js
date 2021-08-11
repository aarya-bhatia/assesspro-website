const fs = require("fs");
const path = require("path");
const { Assessment, UserAssessment } = require("../models");

const router = require("express").Router();

const { isAuth } = require("../controller/auth");

router.get("/details/:key", async (req, res) => {
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

function isEnrolled(key) {
  return async function (req, res, next) {
    const user_assessment = await UserAssessment.findOne({
      user_id: req.user._id,
      assessment_key: key,
    });

    res.locals.user_assessment = user_assessment;

    if (user_assessment) {
      return next();
    } else {
      console.log("User is not enrolled in: ", key);
      return res.redirect("/details/" + key);
    }
  };
}

router.use(
  "/assessments/NEST",
  [isAuth, isEnrolled("NEST")],
  require("./psychometric.router")
);

router.use(
  "/assessments/CPT",
  [isAuth, isEnrolled("CPT")],
  require("./psychometric.router")
);

const assessments = ["CP", "CT", "CE", "CM", "CDT", "SL"];

assessments.forEach((key) => {
  router.use(
    "/assessments/" + key,
    [isAuth, isEnrolled(key)],
    require("./assessments/" + key + ".router.js")
  );
});

module.exports = router;
