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
} = require("../controller/user.profile.js");

const {
  EnrollUser,
  UnenrollUser,
  CheckUserEnrolled,
} = require("../controller/user.enroll.js");

const { uploadImage } = require("../config/s3.config");
const { UserScore, UserAnswer, UserModule } = require("../models/index.js");

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

// Delete user assessment
router.get("/unenroll/:assessment_id", UnenrollUser);

// Delete user score
router.get("/scores/delete/:score_id", deleteUserScore);

// Settings page
router.get("/settings", (req, res) => {
  res.render("profile/settings", { loggedIn: true });
});

router.get("/retake/:assessment_id", async (req, res) => {
  const { assessment_id } = req.params;

  // Reeset user modules

  const doc = await UserModule.updateMany(
    {
      user_id: req.user._id,
      assessment_id,
    },
    {
      $set: {
        time_spent: 0,
        status: "Pending",
        no_attempted: 0,
      },
    }
  );

  console.log(doc);

  res.redirect("/forms/" + assessment_id);
});

// Delete all answers
router.get("/delete/answers", async (req, res) => {
  const doc = await UserAnswer.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/");
});

// Delete all scores
router.get("/delete/scores", async (req, res) => {
  const doc = await UserScore.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/");
});

// Delete account
router.get("/delete/account", DeleteAccount);

module.exports = router;

function setLocals(req, res, next) {
  res.locals.assessment_id = req.params.assessment_id;
  next();
}
