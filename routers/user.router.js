const { Router } = require("express");
const router = Router();

router.get("/profile", (req, res) => {
  res.render("profile.ejs", { user: req.user });
});

/*
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
router.post("/:id/answer");
*/

module.exports = router;
