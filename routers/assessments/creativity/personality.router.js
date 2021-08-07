// Base url: /creativity/personality

const { LeftRightStatement, CPUserAnswer } = require("../../models");

const router = require("express").Router;

const CP_KEY = "CP"; // creativity personality assessment key

router.get("/questions", async (req, res) => {
  const questions = await LeftRightStatement.find({ assessment_key: CP_KEY });
  const user_answers = await CPUserAnswer.find({ user_id: req.user._id });

  res.render("questions/cp.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers,
  });
});

router.post("/save", async (req, res) => {
  const user_id = req.user._id;
  let c = 0;

  for (const question of req.body) {
    const question_id = question.question_id;
    const value = question.value;
    c++;
    await CPUserAnswer.updateOne(
      {
        user_id,
        question_id,
      },
      {
        value,
      },
      {
        upsert: true,
      }
    );
  }

  console.log(c + " answers saved...");

  res.redirect("/creativity/personality/questions");
});

router.post("/submit", async (req, res) => {
  const questions = await CPQuestion.find({});

  let attempted = 0;

  const scale = {
    1: 0,
    2: 20,
    3: 40,
    4: 60,
    5: 80,
    6: 100,
  };

  const module_scores = {};

  for (const question of questions) {
    const id = question._id;
    const module_id = question.module_id;
    const module_name = question.module_name;

    if (req.body[id]) {
      const answer = parseInt(req.body[id]);
      const points = scale[answer] || 0;

      await CPUserAnswer.updateOne(
        {
          user_id: req.user._id,
          question_id: id,
        },
        {
          value: answer,
        },
        {
          upsert: true,
        }
      );

      if (module_scores[module_id]) {
        module_scores[module_id].score += points;
      } else {
        module_scores[module_id] = {
          _id: module_id,
          name: module_name,
          score: points,
        };
      }

      attempted++;
    }
  }

  const module_score_array = [];

  for (const key of Object.keys(module_scores)) {
    let score = module_scores[key].score;
    score = Math.round(score / 4);
    module_scores[key].score = score;
    module_score_array.push({ ...module_scores[key] });
  }

  const completed = attempted == questions.length;

  const user_id = req.user._id;
  const assessment = await Assessment.findOne({ key: CP_KEY });

  const userScore = await UserScore.create({
    user_id,
    assessment_name: assessment.name,
    assessment_id: assessment._id,
    assessment_key: assessment.key,
    plot_type: assessment.plot_type,
    module_scores: module_score_array,
  });

  await UserAssessment.updateOne(
    {
      user_id: req.user._id,
      assessment_id: assessment._id,
    },
    {
      $set: {
        completed,
      },
      $inc: {
        attempts: 1,
      },
    }
  );

  res.redirect("/users/scores");
});

router.get("/report/:userscoreid", async (rea, res) => {});

module.exports = router;
