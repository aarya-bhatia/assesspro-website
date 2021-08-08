const router = require("express").Router();
const { UserAssessment } = require("../models");

async function isEnrolled(req, res, next) {
  const key = req.baseUrl.split("/")[2];
  console.log(key);

  const user_assessment = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_key: key,
  });

  res.locals.user_assessment = user_assessment;

  if (user_assessment) {
    return next();
  } else {
    console.log("User is not enrolled in: ", key);
    return res.redirect("/assessments/" + key);
  }
}

["CP", "CT"].forEach((key) => {
  router.use("/" + key, isEnrolled, require("./creativity/" + key + ".router"));
});

module.exports = router;
