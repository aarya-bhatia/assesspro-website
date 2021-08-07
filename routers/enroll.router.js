const {
  isEnrolled,
  EnrollUser,
  UnenrollUser,
} = require("../controller/user.enroll");

const router = require("express").Router;

router.get("/enroll/:key", isEnrolled, EnrollUser);
router.get("/unenroll/:key", isEnrolled, UnenrollUser);

module.exports = router;
