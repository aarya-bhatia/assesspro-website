const fs = require("fs");
const path = require("path");
const { Assessment } = require("../models");
const { isAuth } = require("../controller/auth");
const { isEnrolled } = require("../controller/user.enroll");
const router = require("express").Router();

module.exports = function () {
  return new Promise(function (resolve, reject) {
    Assessment.find({})
      .then((assessments) => {
        assessments.forEach((assessment) => {
          const key = assessment.key;

          let file = `./assessments/${key}.router.js`;

          if (key == "NEST" || key == "CPT") {
            file = "./assessments/psychometric.router.js";
          }

          if (fs.existsSync(path.join(__dirname, file))) {
            router.use("/" + key, [isAuth, isEnrolled(key)], require(file));

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
