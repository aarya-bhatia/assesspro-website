const { UserAssessment, UserModule, Assessment, Module } = require("../models");

async function createUserAssessment(user, assessment) {
  return await UserAssessment.create({
    user_id: user._id,
    user_name: user.name,
    assessment_id: assessment._id,
    assessment_key: assessment.key,
    assessment_name: assessment.name,
    assessment_category: assessment.category,
    assessment_plot_type: assessment.plot_type,
    assessment_url: assessment.assessment_url,
    attempts: 0,
    completed: false,
  });
}

async function createUserModule(user, assessment, module) {
  await UserModule.create({
    user_id: user._id,
    assessment_id: assessment._id,
    assessment_key: assessment.key,
    module_id: module._id,
    module_name: module.name,
    no_questions: module.no_questions,
    no_attempted: 0,
    time_spent: 0,
    scale_factor: module.scale_factor,
    status: "Pending",
  });
}

module.exports.isEnrolled = (key) => {
  return async (req, res, next) => {
    const user_assessment = await UserAssessment.findOne({
      user_id: req.user._id,
      assessment_key: key,
    });

    res.locals.user_assessment = user_assessment;

    if (user_assessment) {
      return next();
    } else {
      console.log("User is not enrolled in: ", key);
      return res.redirect("/details/" + key);
    }
  };
};

module.exports.EnrollUser = async (req, res) => {
  const user = req.user;
  const key = req.params.key;

  let user_assessment = await UserAssessment.findOne({
    user_id: user._id,
    assessment_key: key,
  });

  if (user_assessment) {
    console.log("Redirect to assessment...", user_assessment.assessment_url);
    return res.redirect(user_assessment.assessment_url);
  }

  console.log("Enrolling user in assessment: " + key);

  const assessment = await Assessment.findOne({ key });

  if (!assessment) {
    return res.render("error/index", {
      ...res.locals,
      message: "Assessment not found with given key:",
      key,
    });
  }

  const user_id = req.user._id;
  const assessment_key = assessment.key;

  await createUserAssessment(user, assessment);

  const modules = await Module.find({ assessment_key });

  if (modules) {
    console.log(
      `Initialising ${modules.length} modules for user [id] ${user_id}...`
    );

    for (const module of modules) {
      await createUserModule(user, assessment, module);
    }
  }

  if (!assessment.assessment_url) {
    return res.render("error/index", {
      ...res.locals,
      message: "Assessment unavailable at this time...",
    });
  }

  console.log(
    "Redirecting to assessment start page: ",
    assessment.assessment_url
  );

  res.redirect(assessment.assessment_url);
};

module.exports.UnenrollUser = async (req, res) => {
  const user_id = req.user._id;
  const assessment_key = req.params.key;

  console.log(`Unenrolling [user] ${req.user.name} from assessment:${key}`);

  await UserAssessment.deleteOne({ user_id, assessment_key });
  await UserModule.deleteMany({ user_id, assessment_key });

  res.redirect("/users/profile/");
};
