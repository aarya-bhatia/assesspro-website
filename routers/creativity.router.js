const router = require("express").Router();
const fs = require("fs");
const { Assessment } = require("../models");
const { isEnrolled } = require("../controller/user.enroll");

function createRouter(key) {
  const file = `./creativity/${key}.router.js`;
  if (fs.existsSync(file)) {
    console.log("Added router for " + key);
    router.use("/" + key, isEnrolled, require(file));
  }
}

Assessment.find({ category_id: 3 }).then((assessments) => {
  assessments.map((assessment) => {
    createRouter(assessment.key);
  });
});

module.exports = router;
