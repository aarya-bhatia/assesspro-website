const qualificationKeys = require("../resources/json/qualification.keys.json");
const statesList = require("../resources/json/india.states.json");
const { UserScore, UserProfile, UserAssessment } = require("../models");
const { downloadImage } = require("../config/s3.config");

const {
  formatTime,
  formatDateString,
  getFormDays,
  getFormMonths,
  getFormYears,
  getChartData,
} = require("./util");
const {
  deleteUserAccount,
  updateUserAssessmentOnRetake,
  updateUserModulesOnRetake,
} = require("./api/user");
const {
  getModuleFeedbackDescription,
  getModuleScoreFeedback,
} = require("./api/assessments");

// Get profile update page
module.exports.getProfileUpdateForm = (req, res) => {
  res.render("profile/update", {
    loggedIn: true,
    user: req.user,
    qualificationKeys,
    states: statesList,
    months: getFormMonths(),
    days: getFormDays(),
    years: getFormYears(),
    error: req.query.error,
  });
};

// Get signed in user's profile page
module.exports.getUserProfile = async (req, res) => {
  // Get assessment scores
  const userScores = await UserScore.find({ user_id: req.user._id })
    .sort("-date")
    .exec();

  const user_id = req.user._id;
  const assessments = await UserAssessment.find({ user_id });

  res.render("profile/profile", {
    loggedIn: true,
    user: req.user,
    userScores,
    formatTime,
    formatDateString,
    getChartData,
    assessments,
  });
};

module.exports.peekProfile = async (req, res) => {
  const user_id = req.params.id;
  const user = await UserProfile.findById(user_id);
  const userScores = await UserScore.find({ user_id }).sort("-date").exec();

  res.render("profile/peekProfile", {
    loggedIn: true,
    user,
    userScores,
    formatTime,
    formatDateString,
    getChartData,
  });
};

module.exports.listUsers = async (req, res) => {
  const users = await UserProfile.find();
  res.render("admin/userList", {
    loggedIn: true,
    users,
  });
};

module.exports.openReport = async (req, res) => {
  const userScore = await UserScore.findById(req.params.user_score_id);
  const { assessment_key, assessment_id } = userScore;
  const user_feedbacks = [];

  if (assessment_key == "NEST") {
    for (const module_score of userScore.module_scores) {
      const { _id, name, score } = module_score;
      const feedback_description = await getModuleFeedbackDescription(_id);
      const module_feedback = await getModuleScoreFeedback(
        assessment_id,
        _id,
        score
      );

      user_feedbacks.push({
        module_name: name,
        module_score: score,
        module_feedback,
        feedback_description,
      });
    }
  }

  // console.log("user feedbacks", user_feedbacks);

  res.render("reports/" + assessment_key, {
    loggedIn: true,
    userScore,
    getChartData,
    user_feedbacks,
  });
};

// Upload profile picture
module.exports.uploadProfilePicture = async (req, res) => {
  console.log("uploaded profile picture");
  if (!req.file) {
    // throw Error("File Not Found");
    return res.redirect(
      "/users/profile/update?error=Please select an image to upload"
    );
  }
  const { key } = req.file;
  img_url = `/users/images/${key}`;

  UserProfile.findById(req.user._id).then((found) => {
    found.img_url = img_url;

    found.save().then((user) => {
      req.logIn(user, (err) => {
        if (!err) {
          res.redirect("/users/profile/update");
        }
      });
    });
  });
};

module.exports.downloadProfilePicture = async (req, res) => {
  const { key } = req.params;
  const readStream = downloadImage(key);
  readStream.pipe(res);
};

module.exports.deleteUserScore = async (req, res) => {
  await UserScore.findOneAndRemove({ _id: req.params.score_id });
  res.redirect("/users/profile");
};

/* update user profile */
module.exports.updateUserProfile = async (req, res) => {
  const user = req.user;

  /* update name, email and bio */
  ["name", "email", "bio", "mobile"].map((key) => {
    if (req.body[key]) {
      user[key] = req.body[key];
    }
  });

  /* update address information */
  ["city", "state", "zip"].map((key) => {
    if (req.body[key]) {
      user.address[key] = req.body[key];
    }
  });

  /* update date of birth information */
  ["day", "month", "year"].map((key) => {
    if (req.body[key]) {
      user.dob[key] = req.body[key];
    }
  });

  /* update status */
  user.status = req.body.status === "on" ? "public" : "private";

  /* update qualifications */
  qualificationKeys.map((element) => {
    const { key, subjectKey, institutionKey } = element;

    if (req.body[subjectKey]) {
      user.qualifications[key].subject = req.body[subjectKey];
    }
    if (req.body[institutionKey]) {
      user.qualifications[key].institution = req.body[institutionKey];
    }
  });

  /* update user in db */
  let profile = await UserProfile.findById({ _id: user._id });

  Object.assign(profile, user);
  const newProfile = await profile.save();

  /* authenticate user */
  req.logIn(newProfile, (err) => {
    if (!err) {
      console.log("updated user", req.user);
      res.redirect("/users/profile");
    }
  });
};

module.exports.DeleteAccount = async (req, res) => {
  const user_id = req.user._id;
  req.logout();
  await deleteUserAccount(user_id);
  res.redirect("/");
};

module.exports.getSettings = (req, res) => {
  res.render("profile/settings", { loggedIn: true });
};

module.exports.RetakeAssessment = async (req, res) => {
  const user_id = req.user._id;
  const { assessment_id } = req.params;
  await updateUserAssessmentOnRetake(user_id, assessment_id);
  await updateUserModulesOnRetake(user_id, assessment_id);
  res.redirect("/forms/" + assessment_id);
};

module.exports.DeleteScores = async (req, res) => {
  const doc = await UserScore.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/");
};

module.exports.DeleteAnswers = async (req, res) => {
  const doc = await UserAnswer.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/");
};
