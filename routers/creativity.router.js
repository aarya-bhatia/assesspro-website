const router = require("express").Router();

const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const { redirect } = require("../config/local.strategy.js");

router.get("/enroll/:key", async (req, res) => {
  const assessment = await fetchAssessmentByKey(req.params.key);

  let userAssessment = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_id: assessment._id,
  });

  if (!userAssessment) {
    userAssessment = await createUserAssessment(req.user, assessment);
    console.log("Enrolled user in assessment: " + assessment.key);
  }

  console.log("Redirecting to assessment start page: ", assessment.redirectURL);
  return res.redirect(
    assessment.redirectURL || "/creativity/" + assessment.key + "/questions"
  );
});

async function isEnrolled(key) {
  return function (req, res, next) {
    const userAssessment = await UserAssessment.findOne({
      user_id: req.user._id,
      assessment_key: key,
    });

    if (!userAssessment) {
      return res.redirect("/creativity/enroll/" + key);
    }

    next();
  };
}

router.use(
  "/convergent",
  () => isEnrolled("CCT"),
  require("./assessments/creativity/convergent.router")
);

router.use(
  "/environment",
  () => isEnrolled("CE"),
  require("./assessments/creativity/environment.router")
);

router.use(
  "/motivation",
  () => isEnrolled("CM"),
  require("./assessments/creativity/motivation.router")
);

router.use(
  "/personality",
  () => isEnrolled("CP"),
  require("./assessments/creativity/personality.router")
);

router.use(
  "/temperament",
  () => isEnrolled("CT"),
  require("./assessments/creativity/temperament.router")
);

router.use(
  "/social-leadership",
  () => isEnrolled("SL"),
  require("./assessments/creativity/social.leadership.router")
);

router.use(
  "/divergent",
  () => isEnrolled("CDT"),
  require("./assessments/creativity/divergent.router")
);

module.exports = router;
