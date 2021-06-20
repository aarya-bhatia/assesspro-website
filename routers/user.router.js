const { Router } = require("express");
const router = Router();
const { updateUserProfile, getProfileUpdateForm, getUserProfile, uploadProfilePicture } = require("../controller/user.profile.js");
const imageUpload = require('../config/multer.config.js');
const { EnrollUser } = require("../controller/user.enroll.js");
const { UserScore, UserAssessment } = require("../models/index.js");

// Get profile update form
router.get("/profile/update", getProfileUpdateForm);

// Post update profile
router.post("/profile/update", updateUserProfile);

// Get current user profile
router.get("/profile", getUserProfile);

// For Single image upload
router.post('/upload', imageUpload.single('fileUpload'), uploadProfilePicture)

// Enroll user in assessment
router.get('/enroll/:assessment_id', async (req, res, next) => {
  res.locals.assessment_id = req.params.assessment_id

  let user_assessment = await UserAssessment.findOne({ user_id: req.user._id, assessment_id: req.params.assessment_id })

  if (user_assessment) {
    console.log('User is enrolled, redirecting to assessment')
    return res.redirect('/forms/' + req.params.assessment_id)
  }

  res.locals.user_assessment = user_assessment
  next()

}, EnrollUser)

// Delete a score
router.get('/scores/delete/:score_id', async (req, res) => {
  await UserScore.findOneAndRemove({ _id: req.params.score_id })
  res.redirect('/users/profile')
})

// Retake Test
// Enrolls user again

module.exports = router;
