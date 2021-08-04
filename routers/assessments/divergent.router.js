const {
  UserAssessment,
  DivergentResponse,
  DivergentScore,
  Assessment,
} = require("../../models");

const router = require("express").Router();

const assessment_key = "Divergent";

const questions = [
  {
    _id: 1,
    content: "red triangular heavy things",
  },
  {
    _id: 2,
    content: "green, spherical, fragnant things",
  },
  {
    _id: 3,
    content: "loud, emotional things that can fly",
  },
  {
    _id: 4,
    content: "intelligent, far away, edible things",
  },
];

async function isEnrolled(req, res, next) {
  const assessment = await UserAssessment.findOne({
    user_id: req.user._id,
    assessment_key,
  });

  if (!assessment) {
    return res.status(400).render("error/index", {
      ...res.locals,
      message: "Access Denied. User is not enrolled in this assessment.",
    });
  }

  res.locals.user_assessment = assessment;

  next();
}

function isAdmin(req, res, next) {
  if (req.user.role == "admin") {
    next();
  } else {
    res.render("error/index", {
      ...res.locals,
      message: "Admin access is required.",
    });
  }
}

router.get("/enroll", async (req, res) => {
  const user_id = req.user._id;

  const assessment = await Assessment.findOne({ key: assessment_key });

  let userAssessment = await UserAssessment.findOne({
    user_id,
    assessment_id: assessment._id,
  });

  if (!userAssessment) {
    userAssessment = await createUserAssessment(req.user, assessment);
    console.log("User is enrolled in " + assessment.key);
  }

  return res.redirect("/divergent/questions?page=1");
});

router.get("/questions", isEnrolled, async (req, res) => {
  let page = req.query.page || 1;

  if (page < 1) {
    return res.redirect("/divergent/questions?page=4");
  }
  if (page > 4) {
    return res.redirect("/divergent/questions?page=1");
  }

  const user_id = req.user._id;
  const question = questions[page - 1];

  const responses = await DivergentResponse.find({
    user_id,
    question_id: page,
  });

  res.render("questions/creativity.divergent.ejs", {
    ...res.locals,
    user_id,
    page,
    question,
    responses,
  });
});

router.post("/add/:question_id", isEnrolled, async (req, res) => {
  await DivergentResponse.create({
    user_name: req.user.name,
    user_id: req.user._id,
    question_id: req.params.question_id,
    content: req.body.content,
    status: "pending",
  });

  console.log(req.query);

  res.redirect("/divergent/questions?page=" + (req.query.page || 1));
});

router.get("/remove/:response_id", isEnrolled, async (req, res) => {
  console.log(req.query);
  await DivergentResponse.deleteOne({
    _id: req.params.response_id,
  });

  res.redirect("/divergent/questions?page=" + (req.query.page || 1));
});

function getQuestion(id) {
  return questions.find((q) => q._id == id).content;
}

router.get("/responses", isAdmin, async (req, res) => {
  const pending = await DivergentResponse.find({ status: "pending" });
  const approved = await DivergentResponse.find({ status: "approved" });
  const rejected = await DivergentResponse.find({ status: "rejected" });

  const candidates = {};

  for (const response of pending) {
    if (!candidates[response.user_id]) {
      candidates[response.user_id] = {
        name: response.user_name,
        user_id: response.user_id,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }
    candidates[response.user_id].pending++;
  }

  for (const response of approved) {
    if (!candidates[response.user_id]) {
      candidates[response.user_id] = {
        name: response.user_name,
        user_id: response.user_id,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }
    candidates[response.user_id].approved++;
  }

  for (const response of rejected) {
    if (!candidates[response.user_id]) {
      candidates[response.user_id] = {
        name: response.user_name,
        user_id: response.user_id,
        pending: 0,
        approved: 0,
        rejected: 0,
      };
    }
    candidates[response.user_id].rejected++;
  }

  const responses = { pending, approved, rejected };

  res.render("admin/divergent.responses.ejs", {
    ...res.locals,
    responses,
    getQuestion: (id) => getQuestion(id),
    candidates: Object.keys(candidates).map((key) => {
      return { ...candidates[key] };
    }),
  });
});

router.get("/approve/:response_id", isAdmin, async (req, res) => {
  await DivergentResponse.updateOne(
    { _id: req.params.response_id },
    { $set: { status: "approved" } }
  );

  res.redirect("/divergent/responses");
});

router.get("/reject/:response_id", isAdmin, async (req, res) => {
  await DivergentResponse.updateOne(
    { _id: req.params.response_id },
    { $set: { status: "rejected" } }
  );

  res.redirect("/divergent/responses");
});

router.get("/publish/:user_id", isAdmin, async (req, res) => {
  const responses = await DivergentResponse.find({
    user_id: req.params.user_id,
  });

  const scores = {};

  for (const response of responses) {
    if (!scores[response.question_id]) {
      scores[response.question_id] = {
        _id: response.question_id,
        name: getQuestion(response.question_id),
        approved: 0,
        rejected: 0,
        score: 0,
      };
    }

    if (response.status == "approved") {
      scores[response.question_id].approved++;
    } else if (response.status == "rejected") {
      scores[response.question_id].rejected++;
    } else {
      return res.render("error/index", {
        ...res.locals,
        message:
          "Please make sure to grade all the responses before publishing the result.",
      });
    }
  }
  const scoreArray = Object.keys(scores).map((key) => {
    return { ...scores[key] };
  });

  for (const o of scoreArray) {
    o.score = o.approved;
  }

  console.log(scoreArray);

  const score = await DivergentScore.create({
    user_id: req.params.user_id,
    scores: scoreArray,
  });

  await DivergentResponse.updateMany(
    { user_id: req.params.user_id },
    { $set: { status: "published" } }
  );

  console.log(score);
  res.redirect("/divergent/responses");
});

router;

module.exports = router;
