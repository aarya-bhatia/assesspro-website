const { Router } = require("express");
const router = Router();
const user_profile = require("../models/user/user_profile");

// Get profile update form
router.get("/profile/update", (req, res) => {
  res.render("profile.update.ejs", { user: req.user });
});

// Post update profile
router.post("/profile/update", (req, res) => {
  console.log(req.body);

  const user = req.user;

  const data = {
    name: req.body.name || user.name,
    bio: req.body.bio || user.bio,
    address: {
      city: req.body.city || user.address.city,
      state: req.body.state || user.address.state,
      zip: req.body.zip || user.address.zip,
    },
    status: req.body.status === "on" ? "public" : "private",
    qualifications: {
      grade10: {
        subject:
          req.body["grade-10-subject"] || user.qualifications.grade10.subject,
        institution:
          req.body["grade-10-institution"] ||
          user.qualifications.grade10.institution,
      },
      grade12: {
        subject:
          req.body["grade-12-subject"] || user.qualifications.grade12.subject,
        institution:
          req.body["grade-12-institution"] ||
          user.qualifications.grade12.institution,
      },
      bachelors: {
        subject:
          req.body["bachelors-subject"] ||
          user.qualifications.bachelors.subject,
        institution:
          req.body["bachelors-institution"] ||
          user.qualifications.bachelors.institution,
      },
      masters: {
        subject:
          req.body["masters-subject"] || user.qualifications.masters.subject,
        institution:
          req.body["masters-institution"] ||
          user.qualifications.masters.institution,
      },
      other: {
        subject: req.body["other-subject"] || user.qualifications.other.subject,
        institution:
          req.body["other-institution"] ||
          user.qualifications.other.institution,
      },
    },
  };

  user_profile.findById({ _id: req.user._id }).then((user) => {
    Object.assign(user, data);
    user.save().then((user) => {
      req.logIn(user, (err) => {
        if (!err) {
          console.log("updated user");
          console.log(req.user);
          res.redirect("/users/profile");
        }
      });
    });
  });
});

// Get current user profile
router.get("/profile", (req, res) => {
  res.render("profile", { user: req.user });
});

/*

// enroll assessment 

router.post("/:id/enroll/:module_id", (req, res, next) => {
  const id = req.params.id;
  const module_id = req.params.module_id;

  User.findById(id)
    .then((user) => {
      const module = user.modules.find((e) => e.module_id == module_id);
      if (!module) {
        user.modules.push({ module_id, answers: [] });
      } else {
        throw {
          status: 400,
          message: "User is already enrolled in module",
        };
      }
      user.save().then((doc) => {
        res.status(200).json(doc);
      });
    })
    .catch((err) => next(err));
});

router.post("/:id/unenroll/:module_id");

// answer question
router.post("/:id/answer");
*/

module.exports = router;
