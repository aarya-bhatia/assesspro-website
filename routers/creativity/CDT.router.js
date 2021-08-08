const { DivergentResponse, DivergentScore } = require("../../models");

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

const router = require("express").Router();

const { isAdmin } = require("../../controller/auth");

const baseURL = "/creativity/divergent";

router.get("/questions", async (req, res) => {
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
    baseURL,
  });
});

router.post("/add/:question_id", async (req, res) => {
  await DivergentResponse.create({
    user_name: req.user.name,
    user_id: req.user._id,
    question_id: req.params.question_id,
    content: req.body.content,
    status: "pending",
  });

  res.redirect("/divergent/questions?page=" + (req.query.page || 1));
});

router.get("/remove/:response_id", async (req, res) => {
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
    baseURL,
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
