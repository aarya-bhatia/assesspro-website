const router = require("express").Router();
const {
  UserAssessment,
  CPQuestion,
  CMQuestion,
  CTQuestion,
  CTUserAnswer,
  CPUserAnswer,
} = require("../models");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const {
  submitCPForm,
  submitCMForm,
  submitCTForm,
  saveCPForm,
} = require("../controller/creativity.scorer");

router.get("/enroll", async (req, res) => {
  const key = res.locals.key;
  const assessment = await fetchAssessmentByKey(key);
  const user_id = req.user._id;

  let userAssessment = await UserAssessment.findOne({
    user_id,
    assessment_id: assessment._id,
  });

  if (!userAssessment) {
    userAssessment = await createUserAssessment(req.user, assessment);
    console.log("User is enrolled in " + assessment.key);
  }

  return res.redirect("/creativity/" + key + "/questions");
});

async function getCPQuestions(req, res) {
  const questions = await CPQuestion.find({});
  const user_answers = await CPUserAnswer.find({ user_id: req.user._id });

  res.render("questions/creativity.personality.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers,
  });
}

async function getCMQuestions(req, res) {
  const questions = await CMQuestion.find({});

  questions.shift();

  res.render("questions/creativity.motivation.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: [],
  });
}

async function getCTQuestions(req, res) {
  const questions = await CTQuestion.find({});
  const options = [
    "Does Not Apply",
    "Marginally",
    "Modest Extent",
    "Substantial",
    "Great Extent",
    "Fully Agree",
  ];

  const user_answers = await CTUserAnswer.find({ user_id: req.user._id });

  res.render("questions/creativity.temperament.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    options,
    user_answers,
  });
}

router.get("/approve", async (req, res) => {
  const key = res.locals.key;

  if (key == "Divergent") {
    const user_id = req.query.user_id;
    const question_id = req.query.question_id;
    const response_id = req.query.response_id;

    const result = await DivergentResponse.updateOne(
      { user_id, question_id, "responses._id": response_id },
      { $set: { status: "approved" } }
    );

    console.log(result);

    res.redirect("/creativity/Divergent/responses");
  }
});

router.get("/reject", async (req, res) => {
  const key = res.locals.key;
  if (key == "Divergent") {
    const user_id = req.query.user_id;
    const question_id = req.query.question_id;
    const response_id = req.query.response_id;

    const result = await DivergentResponse.updateOne(
      { user_id, question_id, "responses._id": response_id },
      { $set: { status: "rejected" } }
    );
  }
});

router.get("/publish", async (req, res) => {
  const key = res.locals.key;
  if (key == "Divergent") {
    const user_id = req.query.user_id;
    const question_id = req.query.question_id;

    const responses = await DivergentResponse.findOne({ user_id, question_id });

    let score = 0;
    let rejectCount = 0;

    for (const value of responses.responses) {
      if (value.status == "approved") {
        score++;
      } else if (value.status == "rejected") {
        rejectCount++;
      }
    }
  }
});

router.get("/responses", async (req, res) => {
  const key = res.locals.key;

  if (key == "Divergent") {
    const responses = await DivergentResponse.find({});
    const questions = {};
    for (const q of divergent_questions) {
      questions[q._id] = q.content;
    }

    res.render("admin/divergent.responses.ejs", {
      ...res.locals,
      responses,
      questions,
    });
  }
});

router.get("/questions", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await getCPQuestions(req, res);
    case "CM":
      return await getCMQuestions(req, res);
    case "CT":
      return await getCTQuestions(req, res);
    case "Convergent":
    case "SL":
    default:
      throw new Error("Assessment not found...");
  }
});

router.post("/submit", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await submitCPForm(req, res);
    case "CM":
      return await submitCMForm(req, res);
    case "CT":
      return await submitCTForm(req, res);
    case "Convergent":
    case "SL":
    default:
      throw new Error("Assessment not found...");
  }
});

router.post("/save", async (req, res) => {
  const key = res.locals.key;

  switch (key) {
    case "CP":
      return await saveCPForm(req, res);
    default:
      res.send("Unavailable");
  }
});

module.exports = router;
