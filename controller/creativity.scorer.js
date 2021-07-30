const {
  UserAssessment,
  CPQuestion,
  CMQuestion,
  UserScore,
  Assessment,
  Module,
} = require("../models/index.js");

module.exports = {
  async submitCPForm(req, res) {
    const questions = await CPQuestion.find({});

    let attempted = 0;

    const scale = {
      1: 0,
      2: 0.2,
      3: 0.4,
      4: 0.6,
      5: 0.8,
      6: 1,
    };

    const module_scores = {};

    for (const question of questions) {
      const id = question._id;
      const module_id = question.module_id;
      const module_name = question.module_name;

      if (req.body[id]) {
        const answer = parseInt(req.body[id]);
        const scale_factor = scale[answer] || 0;
        const points = answer * scale_factor;

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
      let score = module_scores[key];
      score = score / 4;
      score = score * 100;
      score = Math.round(score);
      module_scores[key] = score;
      module_score_array.push({ ...module_scores[key] });
    }

    const completed = attempted == questions.length;

    const user_id = req.user._id;
    const assessment = await Assessment.findOne({ key: "CP" });

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

    res.redirect("/users/profile");
  },

  async submitCMForm(req, res) {
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

      for (const module_score of module_scores) {
        let score = module_score.score;
        score -= 10;
        score /= 3;
        score = Math.round(score);
        module_score.score = score;
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
  },
};
