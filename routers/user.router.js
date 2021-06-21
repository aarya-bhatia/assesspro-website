const {
  updateUserProfile,
  getProfileUpdateForm,
  getUserProfile,
  peekProfile,
  listUsers,
  openReport,
  uploadProfilePicture,
  downloadProfilePicture,
  listUserAssessments,
  deleteUserScore,
} = require("../controller/user.profile.js");

const {
  EnrollUser,
  UnenrollUser,
  CheckUserEnrolled,
} = require("../controller/user.enroll.js");

const { uploadImage } = require("../config/s3.config");

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

// List user assessments
router.get("/assessments", listUserAssessments);

// Enroll user in assessment
router.get(
  "/enroll/:assessment_id",
  [setLocals, CheckUserEnrolled],
  EnrollUser
);

// Delete user assessment
router.get("/unenroll/:assessment_id", UnenrollUser);

// Delete user score
router.get("/scores/delete/:score_id", deleteUserScore);

module.exports = router;

function setLocals(req, res, next) {
  res.locals.assessment_id = req.params.assessment_id;
  next();
}
