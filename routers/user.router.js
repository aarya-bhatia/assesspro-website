const {
  updateUserProfile,
  getProfileUpdateForm,
  getUserProfile,
  peekProfile,
  listUsers,
  openReport,
  uploadProfilePicture,
  downloadProfilePicture,
  deleteUserScore,
  DeleteAccount,
  getSettings,
  RetakeAssessment,
  DeleteScores,
  DeleteAnswers,
} = require("../controller/user.profile.js");

const {
  EnrollUser,
  UnenrollUser,
  CheckUserEnrolled,
} = require("../controller/user.enroll.js");

const { uploadImage } = require("../config/s3.config");
const { UserAssessment } = require("../models/index.js");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");

// Router
const router = require("express").Router();

// Get profile update form
router.get("/profile/update", getProfileUpdateForm);

// Post update profile
router.post("/profile/update", updateUserProfile);

// View another user's profile
router.get("/profile/:id", peekProfile);

// View all users
router.get("/", listUsers);

// Get current user profile
router.get("/profile", getUserProfile);

router.get("/reports/:user_score_id", openReport);

// Upload profile image to s3 bucket
router.post("/upload", uploadImage.single("fileUpload"), uploadProfilePicture);

// Download profile image from s3 bucket
router.get("/images/:key", downloadProfilePicture);

// Enroll user in assessment
router.get(
  "/enroll/:assessment_id",
  [setLocals, CheckUserEnrolled],
  EnrollUser
);

// Enroll in creativity motivation
router.get("/enroll-CM", async (req, res) => {
  const assessment = await fetchAssessmentByKey("CM");
  const userAssessmentFound = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_id: assessment._id,
  });
  if (!userAssessmentFound) {
    const userAssessment = await createUserAssessment(req.user, assessment);
    console.log("User enrolled in CM: ", userAssessment);
  } else {
    console.log("User is Enrolled...");
  }
  return res.redirect("creativity/CM/questions");
});

// Delete user assessment
router.get("/unenroll/:assessment_id", UnenrollUser);

// Delete user score
router.get("/scores/delete/:score_id", deleteUserScore);

// Settings page
router.get("/settings", getSettings);

router.get("/retake/:assessment_id", RetakeAssessment);

// Delete all answers
router.get("/delete/answers", DeleteAnswers);

// Delete all scores
router.get("/delete/scores", DeleteScores);

// Delete account
router.get("/delete/account", DeleteAccount);

function setLocals(req, res, next) {
  res.locals.assessment_id = req.params.assessment_id;
  next();
}

module.exports = router;
