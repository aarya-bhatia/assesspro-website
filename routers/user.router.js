const { Router } = require("express");
const router = Router();

const { updateUserProfile, getProfileUpdateForm } = require("../controller/user.profile.js");
const imageUpload = require('../config/multer.config.js');
const user_profile = require("../models/user_profile.js");

// Get profile update form
router.get("/profile/update", getProfileUpdateForm);

// Post update profile
router.post("/profile/update", updateUserProfile);

// Get current user profile
router.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

// For Single image upload
router.post('/upload', imageUpload.single('fileUpload'), (req, res) => {
  user_profile.findById(req.user._id)
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

module.exports = router;
