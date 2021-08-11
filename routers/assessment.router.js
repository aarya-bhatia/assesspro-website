const fs = require("fs");
const path = require("path");
const { Assessment } = require("../models");
const { isAuth } = require("../controller/auth");
const { isEnrolled } = require("../controller/user.enroll");
const router = require("express").Router();

// Assessment details page
router.get("/details/:key", async (req, res) => {
  const { key } = req.params;
  const assessment = await Assessment.findOne({ key });
  const file = path.join(__dirname, "..", "views", "details", key + ".ejs");

  if (fs.existsSync(file)) {
    res.render("details/" + key, {
      ...res.locals,
      assessment,
    });
  } else {
    console.log("Assessment not found: ", key);
    res.render("error/index", {
      loggedIn: res.locals.loggedIn,
      message: "Sorry, this assessment is not currently available!",
    });
  }
});

module.exports = function () {
  return new Promise(function (resolve, reject) {
    // Set up Assessment routers
    Assessment.find({})
      .then((assessments) => {
        assessments.forEach((assessment) => {
          const key = assessment.key;

          let file = `./assessments/${key}.router.js`;

          if (key == "NEST" || key == "CPT") {
            file = "./assessments/psychometric.router.js";
          }

          if (fs.existsSync(path.join(__dirname, file))) {
            router.use(
              `/assessments/${key}`,
              [isAuth, isEnrolled(key)],
              require(file)
            );

            console.log(key, " router is initialised");
          }
        });

        resolve(router);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
