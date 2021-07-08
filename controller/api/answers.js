const { Answer } = require("../../models");

module.exports = {
  getPointsForAnswerChoice,
};

async function getPointsForAnswerChoice(question_id, choice) {
  const answer = await Answer.findOne({
    question_id,
    choice,
  });

  if (!answer) {
    throw new Error(`Answer not found for question id ${question_id}
      and choice ${choice}`);
  }

  return answer.points;
}
