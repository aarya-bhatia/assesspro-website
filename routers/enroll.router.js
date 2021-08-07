const router = require("express").Router;

router.get("/enroll/:key", async (req, res) => {
  const assessment = await Assessment.findOne({ key: req.params.key });

  let userAssessment = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_id: assessment._id,
  });

  if (!userAssessment) {
    userAssessment = await createUserAssessment(req.user, assessment);

    console.log("Enrolled user in assessment: " + assessment.key);
  }

  console.log("Redirecting to assessment start page: ", assessment.redirectURL);

  if (!assessment.redirectURL) {
    return res.render("error/index", {
      ...res.locals,
      message: "Assessment unavailable at this time...",
    });
  }

  res.redirect(assessment.redirectURL);
});

module.exports = router;
