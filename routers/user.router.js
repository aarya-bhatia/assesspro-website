const {
  updateUserProfile,
  getProfileUpdateForm,
  getUserProfile,
  getUserScores,
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

// Get user scores
router.get("/scores", getUserScores);

router.get("/reports/:user_score_id", openReport);

// Upload profile image to s3 bucket
router.post("/upload", uploadImage.single("fileUpload"), uploadProfilePicture);

// Download profile image from s3 bucket
router.get("/images/:key", downloadProfilePicture);

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

module.exports = router;
