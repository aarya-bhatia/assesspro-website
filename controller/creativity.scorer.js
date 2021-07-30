const {
  UserAssessment,
  CPQuestion,
  CMQuestion,
  UserScore,
  Assessment,
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

  async submitCMForm(req, res) {},
};
