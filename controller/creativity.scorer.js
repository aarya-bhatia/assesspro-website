const {
  UserAssessment,
  CPQuestion,
  UserScore,
  Assessment,
  CTQuestion,
  CTUserAnswer,
  CPUserAnswer,
} = require("../models/index.js");

async function createScore(user_id, assessment, module_scores) {
  return new Promise(async (res) => {
    const userScore = await UserScore.create({
      user_id,
      assessment_name: assessment.name,
      assessment_id: assessment._id,
      assessment_key: assessment.key,
      plot_type: assessment.plot_type,
      module_scores,
    });

    res();
  });
}

async function updateAssessment(user_id, assessment, completed) {
  return new Promise(async (res) => {
    await UserAssessment.updateOne(
      {
        user_id,
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

    res();
  });
}

module.exports = {
  async saveCPForm(req, res) {
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

    res.send();
  },

  async submitCPForm(req, res) {
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
  },

  //
  // CREATIVITY TEMPERAMENT SCORING
  //
  async submitCTForm(req, res) {
    const questions = await CTQuestion.find({});
    const module_scores = {};
    let attempted = 0;

    for (const question of questions) {
      const { _id, module_id, module_name } = question;

      if (req.body[_id]) {
        attempted++;
        const value = parseInt(req.body[_id]);

        // save answer
        await CTUserAnswer.updateOne(
          { user_id: req.user._id, question_id: _id, module_id },
          { value },
          { upsert: true }
        );

        // update points for module
        if (module_scores[module_id]) {
          module_scores[module_id].score += value;
        } else {
          // create module score object
          module_scores[module_id] = {
            module_id,
            module_name,
            score: value,
          };
        }
      }
    }

    const module_score_array = [];

    // convert scores to array
    for (const key of Object.keys(module_scores)) {
      module_score_array.push({
        _id: module_scores[key].module_id,
        name: module_scores[key].module_name,
        score: module_scores[key].score,
      });
    }

    let total = 0;

    // scaling and get total
    for (const module_score of module_score_array) {
      let score = module_score.score;
      score /= 5;
      score -= 1;
      score *= 20;
      total += score;
      module_score.score = score;
    }

    // conversion to %
    for (const module_score of module_score_array) {
      module_score.score = Math.round((100 * module_score.score) / total);
    }

    const assessment = await Assessment.findOne({ key: "CT" });
    const completed = attempted == questions.length;

    // create score, update assessment
    await createScore(req.user._id, assessment, module_score_array).then(
      async () => {
        await updateAssessment(req.user._id, assessment, completed).then(() => {
          res.redirect("/users/profile");
        });
      }
    );
  },
};
