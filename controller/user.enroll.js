const { fetchAssessmentById, fetchModuleById } = require("./api/assessments");
const {
  getUserAssessment,
  createUserAssessment,
  createUserModule,
  unenrollUserFromAssessment,
} = require("./api/user");

module.exports = {
  EnrollUser,
  UnenrollUser,
  CheckUserEnrolled,
};

async function CheckUserEnrolled(req, res, next) {
  const { assessment_id } = res.locals;

  let user_assessment = await getUserAssessment(req.user._id, assessment_id);

  if (user_assessment) {
    console.log("User is enrolled, redirecting to assessment");
    return res.redirect("/forms/" + assessment_id);
  }

  next();
}

/*
 * This function will enroll the user in an assessment.
 * It should be set as a callback on success of payment gateway. (TODO)
 */
async function EnrollUser(req, res) {
  console.log("User is not enrolled, enrolling user...");

  const { user } = req;
  const { assessment_id } = req.params;
  const assessment = await fetchAssessmentById(assessment_id);

  await createUserAssessment(user, assessment);

  console.log("Created user assessment");

  await createUserModules(user_id, assessment).then(() => {
    res.redirect("/forms/" + assessment_id);
  });
}

async function createUserModules(user_id, assessment) {
  const assessment_id = assessment._id;
  const modules = assessment.modules;

  console.log(
    `Initialising ${modules.length} modules for user [id] ${user_id}...`
  );

  return new Promise(async function (res) {
    for (const _module of modules) {
      const module = await fetchModuleById(_module._id);
      await createUserModule(user_id, assessment_id, module);
    }
    res();
  });
}

async function UnenrollUser(req, res) {
  const user_id = req.user._id;
  const { assessment_id } = req.params;
  const assessment = await fetchAssessmentById(assessment_id);

  console.log(
    `Unenrolling [user] ${req.user.name} from assessment:${assessment.key}`
  );

  await unenrollUserFromAssessment(user_id, assessment);

  res.redirect("/users/assessments");
}
