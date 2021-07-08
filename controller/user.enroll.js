const { fetchAssessmentById } = require("./api/assessments");
const {
  getUserAssessment,
  createUserAssessment,
  createUserModules,
  unenrollUserFromAssessment,
} = require("./api/user");

module.exports = {
  /* middleware to check whether user is enrolled in assessment */
  async CheckUserEnrolled(req, res, next) {
    const { assessment_id } = res.locals;
    let user_assessment = await getUserAssessment(req.user._id, assessment_id);

    if (user_assessment) {
      console.log("User is enrolled, redirecting to assessment");
      return res.redirect("/forms/" + assessment_id);
    }
    next();
  },

  /*
   * This function will enroll the user in an assessment.
   * It should be set as a callback on success of payment gateway. (TODO)
   */
  async EnrollUser(req, res) {
    console.log("User is not enrolled, enrolling user...");
    const { user } = req;
    const { assessment_id } = req.params;

    const assessment = await fetchAssessmentById(assessment_id);
    await createUserAssessment(user, assessment);
    console.log("Created user assessment");

    const user_id = user._id;
    await createUserModules(user_id, assessment).then(() => {
      res.redirect("/forms/" + assessment_id);
    });
  },

  /* unenroll user from assessment */
  async UnenrollUser(req, res) {
    const user_id = req.user._id;
    const { assessment_id } = req.params;
    const assessment = await fetchAssessmentById(assessment_id);

    const msg = `Unenrolling [user] ${req.user.name} from assessment:${assessment.key}`;
    console.log(msg);

    await unenrollUserFromAssessment(user_id, assessment);

    res.redirect("/users/profile");
  },
};
