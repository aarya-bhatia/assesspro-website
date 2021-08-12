require("../../config/db.config").connect();

const { Question } = require("../../models");

const imageDir = "/images/AbstractReasoning/";

require("mongoose").connection.once("open", async () => {
  const questions = await Question.find({ module_name: "Abstract Reasoning" });

  let count = 1;

  for (const question of questions) {
    question.image = imageDir + count + ".png";

    if (count == 6) {
      const choices = question.choices;

      for (let j = 0; j < choices.length; j++) {
        const key = choices[j]._id.toLowerCase();
        choices[j].image = imageDir + count + key + ".png";
      }
    }

    count++;

    console.log("updated question", question);

    await question.save();
  }
});
