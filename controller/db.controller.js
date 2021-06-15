exports.throw_error = function (status, message) {
  throw { status, message };
};

exports.fetch_modules = async function (assessment_id) {
  if (!modules) {
    throw_error(400, "Modules not found for this assessment");
  }
};

exports.fetch_assessment = async function (assessment_id) {};

exports.fetch_candidate = async function (candidate_id) {};

exports.fetch_assessments_enrolled = async function (candidate_id) {};

exports.fetch_candidate_answers = async function (module_id) {};

exports.fetch_answer_key = async function (question_id) {};

exports.fetch_module_score = async function (candidate_id, module_id) {};

exports.check_candidate_enrolled = async function (
  candidate_id,
  assessment_id
) {
  const assessments = await fetch_assessments_enrolled(candidate_id);
  if (!assessments.find((a) => a == assessment_id)) {
    throw_error(400, "Candidate is not enrolled in this assessment");
  }
};

exports.update_module_score = async function (
  candidate_id,
  module_id,
  score
) {};
