const { Router } = require("express");
const router = Router();
// const { isEnrolled, EnrollUser } = require('../controller/user.enroll');
const { updateUserProfile, getProfileUpdateForm, getUserProfile } = require("../controller/user.profile.js");
const imageUpload = require('../config/multer.config.js');
const UserProfile = require("../models/UserProfile.js");

const { UserAssessment, Assessment, UserModule, Module } = require('../models');
const { EnrollUser } = require("../controller/user.enroll.js");

// Get profile update form
router.get("/profile/update", getProfileUpdateForm);

// Post update profile
router.post("/profile/update", updateUserProfile);

// Get current user profile
router.get("/profile", getUserProfile);

// For Single image upload
router.post('/upload', imageUpload.single('fileUpload'), (req, res) => {
  UserProfile.findById(req.user._id)
    .then(found => {
      found.img_url = `/images/uploads/${req.file.filename}`
      found.save().then(user => {
        req.logIn(user, (err) => {
          if (!err) {
            console.log("updated user", req.user);
            res.redirect("/users/profile/update");
          }
        });
      })
    })
}, (err, req, res, next) => {
  console.log(err);
  res.status(400).json({ message: err.message })
})

function getAssessmentId(req, res, next) {
  res.locals.assessment_id = req.params.assessment_id
  console.log(res.locals)
  next()
}

// Enroll user in assessment
router.get('/enroll/:assessment_id', getAssessmentId, EnrollUser)

module.exports = router;
