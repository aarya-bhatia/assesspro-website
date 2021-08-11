const router = require("express").Router();
const { isEnrolled } = require("../controller/user.enroll");

router.use(
  "/SL",
  isEnrolled("SL"),
  require("./assessments/social.leadership.router")
);

router.use(
  "/CT",
  isEnrolled("CT"),
  require("./assessments/temperament.router")
);

router.use(
  "/CP",
  isEnrolled("CP"),
  require("./assessments/personality.router")
);

router.use("/CM", isEnrolled("CM"), require("./assessments/motivation.router"));

router.use(
  "/CE",
  isEnrolled("CE"),
  require("./assessments/environment.router")
);

router.use(
  "/CDT",
  isEnrolled("CDT"),
  require("./assessments/divergent.thinking.router")
);

router.use(
  "/CCT",
  isEnrolled("CCT"),
  require("./assessments/convergent.thinking.router")
);

router.use(
  "/NEST",
  isEnrolled("NEST"),
  require("./assessments/psychometric.router")
);

router.use(
  "/CPT",
  isEnrolled("CPT"),
  require("./assessments/psychometric.router")
);

module.exports = router;
