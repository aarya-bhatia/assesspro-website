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

async function init() {
  const creativityAssessments = await Assessment.find({ category_id: 3 });
  creativityAssessments.map((assessment) => {
    createRouter(assessment.key);
  });
}

init();

module.exports = router;
