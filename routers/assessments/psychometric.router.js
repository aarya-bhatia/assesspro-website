const { formatTimeSpent, shuffleOrder } = require("../../controller/util");

const {
  Module,
  UserModule,
  Question,
  UserAnswer,
  Assessment,
  UserScore,
  Answer,
} = require("../../models");

const router = require("express").Router({ mergeParams: true });

// Assessment Home Page
router.get("/", async (req, res) => {
  const user_id = req.user._id;
  const { user_assessment } = res.locals;
  const { assessment_id, assessment_name } = user_assessment;
  const assessment = await Assessment.findById(assessment_id);
  const user_modules = await UserModule.find({ user_id, assessment_id });

  res.render("psychometric/modules.ejs", {
    ...res.locals,
    user_modules,
    title: assessment_name,
    description: assessment.description,
    formatTimeSpent,
  });
});

// Module Questions
router.get("/questions", async (req, res) => {
  const { user_assessment } = res.locals;

  const umid = req.query.umid;

  if (!umid) {
    return res.redirect(user_assessment.assessment_url);
  }

  const user_id = req.user._id;

  const user_module = await UserModule.findById(umid);
  const module_id = user_module.module_id;

  const module = await Module.findById(module_id);
  const questions = await Question.find({ module_id });

  const user_answers = await UserAnswer.find({
    user_id,
    module_id,
  });

  const title = "Module: " + module.name;

  questions.sort(shuffleOrder);

  res.render("psychometric/questions.ejs", {
    ...res.locals,
    title,
    description: module.description,
    instructions: module.instructions,
    questions,
    user_answers,
    user_module,
    formatTimeSpent,
  });
});

// Sumbit Module
// Input names in the module form should be set to the question ids.
// Input values in the module form should be set to the choice id.
router.post("/submit", async function (req, res) {
  const { user_assessment } = res.locals;
  const { assessment_key } = user_assessment;

  const { umid } = req.body;
  const user_id = req.user._id;
  const user_module = await UserModule.findById(umid);
  const module_id = user_module.module_id;
  const module_name = user_module.module_name;

  const questions = await Question.find({ module_id });

  let attempted = 0;

  questions.map(async (question) => {
    const { _id, choices } = question;

    // Get form input value
    const choice = req.body[_id];

    if (choice) {
      attempted++;

      // Find the value of the selected choice
      const { text } = choices.find(({ _id }) => _id == choice);

      const update = {};

      if (choice) {
        update.choice = choice;
      }
      if (text) {
        update.value = text;
      }

      await UserAnswer.updateOne(
        {
          assessment_key,
          user_id,
          question_id: _id,
          module_id,
          module_name,
        },
        update,
        { upsert: true }
      );
    }
  });

  await UserModule.updateOne(
    {
      _id: user_module._id,
    },
    {
      $set: {
        no_attempted: attempted,
        status: attempted == user_module.no_questions ? "Completed" : "Pending",
      },
      $inc: {
        time_spent: Number(req.body.time_spent) || 0,
      },
    }
  );

  res.redirect(user_assessment.assessment_url);
});

// Submit Assessment
router.get("/score", async function (req, res) {
  const user_id = req.user._id;
  const user_assessment = res.locals.user_assessment;
  const assessment_key = user_assessment.assessment_key;

  const modules = await Module.find({ assessment_key }).lean();
  const answers = await Answer.find({ assessment_key }).lean();
  const user_answers = await UserAnswer.find({
    user_id,
    assessment_key,
  }).lean();

  const module_score_map = [];

  for (const user_answer of user_answers) {
    const answer = answers.find(function (answer) {
      return (
        answer.question_id == user_answer.question_id &&
        answer.choice == user_answer.choice
      );
    });

    if (!module_score_map[user_answer.module_id]) {
      module_score_map[user_answer.module_id] = {
        _id: user_answer.module_id,
        name: user_answer.module_name,
        score: 0,
      };
    }

    module_score_map[user_answer.module_id].score += answer.points;
  }

  const module_scores = [];

  for (const module_id of Object.keys(module_score_map)) {
    const score_data = module_score_map[module_id];

    const current_module = modules.find(function (module) {
      return module._id == score_data._id;
    });

    if (current_module) {
      const maxScore =
        current_module.no_questions * current_module.scale_factor;

      if (maxScore != 0) {
        const scaled_score = Math.round((100 * score_data.score) / maxScore);
        console.log(
          `scaled score for module ${score_data.name} from ${score_data.score} to ${scaled_score}...`
        );
        score_data.score = scaled_score;
      }
    }

    module_scores.push(score_data);
  }

  const user_score = await UserScore.create({
    user_id,
    assessment_key,
    module_scores,
    assessment_id: user_assessment.assessment_id,
    assessment_name: user_assessment.assessment_name,
    plot_type: user_assessment.assessment_plot_type,
  });

  console.log(user_score);

  user_assessment.attempts = (user_assessment.attempts || 0) + 1;
  user_assessment.completed = true;
  await user_assessment.save();

  res.redirect("/users/scores");
});

module.exports = router;

// FOR REDIS.
// const questions = await getOrSetRedisCache(
//   RedisClient,
//   `questions?module_id=${module_id}`,
//   async () => {
//     return await Question.find({ module_id });
//   }
// );
