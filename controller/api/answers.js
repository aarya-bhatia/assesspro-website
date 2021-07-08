const { Answer, Question } = require("../../models");

module.exports = {
  async getPointsForAnswerChoice(question_id, choice) {
    const answer = await Answer.findOne({
      question_id,
      choice,
    });

    if (!answer) {
      throw new Error(`Answer not found for question id ${question_id}
      and choice ${choice}`);
    }

    return answer.points;
  },

  async fetchQuestionsForModule(module_id) {
    return await Question.find({ module_id });
  },
};
