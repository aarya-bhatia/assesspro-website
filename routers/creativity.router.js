const router = require("express").Router();
const {
  UserAssessment,
  CPQuestion,
  CMQuestion,
  CTQuestion,
  CTUserAnswer,
  CPUserAnswer,
  DivergentResponse,
} = require("../models");
const { createUserAssessment } = require("../controller/api/user.js");
const { fetchAssessmentByKey } = require("../controller/api/assessments.js");
const {
  submitCPForm,
  submitCMForm,
  submitCTForm,
  saveCPForm,
} = require("../controller/creativity.scorer");

const divergent_questions = require("../resources/json/divergent.thinking.questions.json");

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

function getDivergentQuestion(id) {
  return divergent_questions.find((q) => q._id == id);
}

async function getDivergentQuestions(req, res) {
  const totalPages = divergent_questions.length;

  let page = req.query.page;

  if (!page) {
    page = 1;
  }

  if (page < 1) {
    page = totalPages;
  }

  if (page > totalPages) {
    page = 1;
  }

  const question = getDivergentQuestion(page);
  const id = question._id;
  const user_id = req.user._id;

  let user_responses = await DivergentResponse.findOne({
    user_id,
    question_id: id,
  });

  if (!user_responses) {
    user_responses = await DivergentResponse.create({
      user_id: req.user._id,
      question_id: id,
      responses: [],
      time_spent: 0,
    });
  }

  const { time_spent, responses } = user_responses;

  res.render("questions/creativity.divergent.ejs", {
    ...res.locals,
    user_id,
    time_spent,
    responses,
    id,
    question,
  });
}

router.post("/add", async (req, res) => {
  const key = res.locals.key;

  if (key == "Divergent") {
    const id = parseInt(req.query.page) || 1;
    const content = req.body.content;
    const result = await DivergentResponse.updateOne(
      {
        user_id: req.user._id,
        question_id: id,
      },
      {
        $addToSet: {
          responses: { content },
        },
      }
    );
    return res.redirect("/creativity/Divergent/questions?page=" + id);
  }

  throw new Error("Invalid request");
});

router.post("/remove", async (req, res) => {
  const key = res.locals.key;

  if (key == "Divergent") {
    const page = parseInt(req.body.page) || 1;
    const id = req.body.id;
    console.log(page);
    console.log("removing", id);
    const result = await DivergentResponse.updateOne(
      {
        user_id: req.user._id,
        question_id: page,
      },
      {
        $pull: {
          responses: { _id: id },
        },
      }
    );
    return res.redirect("/creativity/Divergent/questions?page=" + page);
  }

  throw new Error("Invalid request");
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
    case "Divergent":
      return await getDivergentQuestions(req, res);
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
    case "Divergent":
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
