const router = require("express").Router();
const { UserAssessment } = require("../models/index.js");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const { CMQuestion } = require("../models");

async function scoreCM(req, res) {}

// Enroll in creativity motivation
router.get("/enroll/CM", async (req, res) => {
  const assessment = await fetchAssessmentByKey("CM");
  const userAssessmentFound = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_id: assessment._id,
  });
  if (!userAssessmentFound) {
    const userAssessment = await createUserAssessment(req.user, assessment);
    console.log("User enrolled in CM: ", userAssessment);
  } else {
    console.log("User is Enrolled...");
  }
  return res.redirect("/creativity/CM/questions");
});

router.get("/:key/questions", async (req, res) => {
  const { key } = req.params;

  // fetch questions
  const questions = await CMQuestion.find({});

  switch (key) {
    case "CM":
      return res.render("forms/cm.moduleForm.ejs", {
        ...res.locals,
        user: req.user,
        questions,
      });
    default:
      throw new Error("Assessment not found");
  }
});

router.post("/:key/submit", async (req, res) => {});

module.exports = router;
