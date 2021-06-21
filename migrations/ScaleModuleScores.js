require("dotenv").config();

const mongoose = require("mongoose");
const {
  Module,
  Question,
  UserModule,
  UserScore,
  UserProfile,
} = require("../models");

const maxScores = {};
const users = {};

async function ScaleModuleScores() {
  const scores = await UserScore.find();

  for (const userScore of scores) {
    const { module_scores } = userScore;

    for (const module_score of module_scores) {
      const { score, name } = module_score;

      if (!maxScores[name]) {
        const module = await Module.findOne({ name });
        const { no_questions, type } = module;

        const maxScore = type == "Objective" ? no_questions : no_questions * 5;
        maxScores[name] = maxScore;
      }

      const maxScore = maxScores[name];
      const scaledScore = (100 * score) / maxScore;

      if (!users[userScore.user_id]) {
        const user = await UserProfile.findById(userScore.user_id);
        users[userScore.user_id] = user.name;
      }

      const userName = users[userScore.user_id];

      console.log(`scaled score for module ${name}
          and user ${userName} from ${score}
          to ${scaledScore}.`);

      const doc = await UserScore.updateOne(
        {
          user_id: userScore.user_id,
          assessment_id: userScore.assessment_id,
          "module_scores.name": name,
        },
        {
          $set: {
            "module_scores.$.score": Math.round(scaledScore),
          },
        }
      );

      //   console.log(doc);
    }
  }
}

require("../config/db.config").connect();
mongoose.connection.once("open", ScaleModuleScores);

// mongoexport --uri mongodb+srv://aaryabhatia:TTShYQW5FbUGoNm9@cluster0.9isoe.mongodb.net/ASSESSPRO?retryWrites=true&w=majority --collection modules --out exports/module.json
