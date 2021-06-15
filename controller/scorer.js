const db = require("./db.controller");

exports.score_assessment = async function (candidate_id, assessment_id) {
  const candidate = await db.fetch_candidate(candidate_id);
  const modules = await db.fetch_modules(assessment_id);

  modules.map((module) => {
    const candidate_answers = await db.fetch_candidate_answers(module._id);

    const score =
      module.type == "objective"
        ? await score_module_objectively(candidate_answers, module)
        : await score_module_subjectively(candidate_answers, module);

    await db.update_module_score(candidate_id, module._id, score);
  });
};

const score_module_objectively = async function (candidate_answers, module) {
  candidate_answers.map((answer) => {
    const answer_key = await db.fetch_answer_key(answer.question_id);
    if (answer_key.value == answer.value) {
      score++;
    }
  });
};

const score_module_subjectively = async function (candidate_answers, module) {
  const dir = await db.fetch_rating_direction(answer.question_id);
  if (dir == "increasing") {
  } else {
  }
};
