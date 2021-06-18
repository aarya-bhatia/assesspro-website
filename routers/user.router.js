const { Router } = require("express");
const router = Router();
// const { isEnrolled, EnrollUser } = require('../controller/user.enroll');
const { updateUserProfile, getProfileUpdateForm, getUserProfile } = require("../controller/user.profile.js");
const imageUpload = require('../config/multer.config.js');
const UserProfile = require("../models/UserProfile.js");

const { UserAssessment, Assessment, UserModule, Module } = require('../models')

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

// Enroll user in assessment
// router.get('/enroll/:assessment_id', [isEnrolled], EnrollUser)
router.get('/enroll/:assessment_id', async (req, res) => {

  res.locals.assessment_id = req.params.assessment_id
  console.log(res.locals)

  try {
    const user = req.user
    const { assessment_id } = res.locals

    if (await UserAssessment.findOne({ user_id: user._id, assessment_id })) {
      console.log('User is already enrolled')
      return res.redirect('/forms/' + assessment_id)
    }

    const assessment = await Assessment.findById(assessment_id)
    const { modules } = assessment

    await UserAssessment.create({
      user_id: user._id,
      user_name: user.name,
      assessment_id: assessment._id,
      assessment_key: assessment.key,
      assessment_name: assessment.name,
      assessment_category: assessment.category,
      assessment_plot_type: assessment.plot_type,
      assessment_description: assessment.description,
      date_purchased: new Date(),
      attempts: 0,
      completed: false
    })

    modules.map(async ({ id }) => {

      const m = await Module.findById(id)

      await UserModule.create({
        user_id: user._id,
        assessment_id,
        module_id: id,
        module_name: m.name,
        module_key: m.key,
        module_type: m.type,
        no_questions: m.no_questions,
        no_attempted: 0,
        time_spent: 0,
        time_limit: m.time_limit,
        status: 'Pending'
      })

    })

    res.redirect('/forms/' + assessment._id)

  }

  catch (err) {

    console.log('==================================================================')
    console.log(err);
    res
      .status(err.status || 500)
      .json({ ...err, message: err.message || "There was an error!" });

  }
})

module.exports = router;
