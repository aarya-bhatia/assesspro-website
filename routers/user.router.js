const { Router } = require("express");
const router = Router();
const {
  updateUserProfile,
  getProfileUpdateForm,
  getUserProfile,
  uploadProfilePicture,
} = require("../controller/user.profile.js");
const imageUpload = require("../config/multer.config.js");
const { EnrollUser, UnenrollUser } = require("../controller/user.enroll.js");
const {
  UserScore,
  UserAssessment,
  UserProfile,
} = require("../models/index.js");

const {
  formatTime,
  formatDateString,
  getChartData,
} = require("../controller/util");

// Get profile update form
router.get("/profile/update", getProfileUpdateForm);

// Post update profile
router.post("/profile/update", updateUserProfile);

// View another user's profile
router.get("/profile/:id", async (req, res) => {
  const user_id = req.params.id;
  const user = await UserProfile.findById(user_id);
  const userScores = await UserScore.find({ user_id }).sort("-date").exec();

  res.render("profile/peekProfile", {
    loggedIn: true,
    user,
    userScores,
    formatTime,
    formatDateString,
    getChartData,
  });
});

// View users
router.get("/", async (req, res) => {
  const users = await UserProfile.find();
  res.render("admin/userList", {
    loggedIn: true,
    users,
  });
});

// Get current user profile
router.get("/profile", getUserProfile);

// For Single image upload
router.post("/upload", imageUpload.single("fileUpload"), uploadProfilePicture);

// List user assessments
router.get("/assessments", async (req, res) => {
  const user_id = req.user._id;
  const assessments = await UserAssessment.find({ user_id });
  res.render("forms/assessmentList", {
    loggedIn: true,
    assessments,
    formatDateString,
  });
});

// Enroll user in assessment
router.get(
  "/enroll/:assessment_id",
  async (req, res, next) => {
    res.locals.assessment_id = req.params.assessment_id;

    let user_assessment = await UserAssessment.findOne({
      user_id: req.user._id,
      assessment_id: req.params.assessment_id,
    });

    if (user_assessment) {
      console.log("User is enrolled, redirecting to assessment");
      return res.redirect("/forms/" + req.params.assessment_id);
    }

    res.locals.user_assessment = user_assessment;
    next();
  },
  EnrollUser
);

router.get("/unenroll/:assessment_id", UnenrollUser);

// Delete a score
router.get("/scores/delete/:score_id", async (req, res) => {
  await UserScore.findOneAndRemove({ _id: req.params.score_id });
  res.redirect("/users/profile");
});

// Retake Test
// Enrolls user again? Todo

module.exports = router;
