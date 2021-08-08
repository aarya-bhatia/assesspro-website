const router = require("express").Router;

router.get("/questions", async (req, res) => {
  const questions = await CMQuestion.find({});

  questions.shift();

  res.render("questions/creativity.motivation.ejs", {
    ...res.locals,
    user: req.user,
    questions,
    user_answers: [],
  });
});

router.post("/submit", async (req, res) => {
  Assessment.findOne({ key: "CM" }).then(async (assessment) => {
    const module_scores = [];
    let index = 0;

    for (const module of assessment.modules) {
      module_scores[index++] = {
        _id: module._id,
        name: module.name,
        score: 0,
      };
    }

    const A = "A".charCodeAt(0);

    for (let i = 1; i <= 10; i++) {
      for (let j = 0; j <= 6; j++) {
        const code = `${i}${String.fromCharCode(A + j)}`;
        if (req.body[code]) {
          const points = parseInt(req.body[code]) || 0;
          module_scores[j].score += points;
        }
      }
    }

    console.log(module_scores);

    let total = 0;

    for (const module_score of module_scores) {
      let score = module_score.score;
      score -= 10;
      score /= 3;
      total += score;
      module_score.score = score;
    }

    for (const module_score of module_scores) {
      module_score.score = Math.round((module_score.score * 100) / total);
    }

    const userScore = await UserScore.create({
      user_id: req.user._id,
      assessment_name: assessment.name,
      assessment_id: assessment._id,
      assessment_key: assessment.key,
      plot_type: assessment.plot_type,
      module_scores,
    });

    await UserAssessment.updateOne(
      {
        user_id: req.user._id,
        assessment_id: assessment._id,
      },
      {
        $set: {
          completed: true,
        },
        $inc: {
          attempts: 1,
        },
      }
    );

    res.redirect("/users/profile");
  });
});

router.post("/save", async (req, res) => {});
router.get("/report", async (req, res) => {});

module.exports = router;
