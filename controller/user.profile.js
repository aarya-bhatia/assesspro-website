const {
  UserScore,
  UserModule,
  UserAssessment,
  UserProfile,
  NESTFeedback,
  DivergentScore,
  ConvergentScore,
} = require("../models");
const fs = require("fs");
const path = require("path");
const qualificationKeys = require("../resources/json/qualification.keys.json");
const statesList = require("../resources/json/india.states.json");
const { downloadImage } = require("../config/s3.config");
const {
  formatTime,
  formatDateString,
  getFormDays,
  getFormMonths,
  getFormYears,
  getChartData,
} = require("./util");

// Get profile update page
module.exports.getProfileUpdateForm = (req, res) => {
  res.render("profile/profile.update.ejs", {
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
  const user_id = req.user._id;
  const assessments = await UserAssessment.find({ user_id });

  res.render("profile/profile", {
    loggedIn: true,
    user: req.user,
    formatTime,
    formatDateString,
    getChartData,
    assessments,
  });
};

async function getAssessmentScores(user_id, page) {
  const results_per_page = 3;

  const scores = await UserScore.find({ user_id })
    .sort("-date")
    .limit(results_per_page)
    .skip(results_per_page * (page - 1))
    .exec(); 
  
  const divScores = await DivergentScore.find({ user_id })
    .sort("-date")
    .limit(2)
    .skip(2 * (page - 1))
    .exec(); 
  
    return [...scores, ...divScores]
}

module.exports.getUserScores = async (req, res) => {
  let page = 1;

  if (req.query.page) {
    page = req.query.page;
  }

  if (page <= 0) {
    res.redirect("/users/scores");
  }

  const userScores = await getAssessmentScores(req.user._id, page);

  console.log(userScores);

  res.render("profile/scores", {
    loggedIn: true,
    user: req.user,
    userScores,
    getChartData,
    page,
  });
};

module.exports.peekProfile = async (req, res) => {
  const user_id = req.params.id;
  const user = await UserProfile.findById(user_id);
  const userScores = await UserScore.find({ user_id }).sort("-date").exec();
  const divergentScores = await DivergentScore.find({ user_id: req.user._id });

  res.render("profile/profile.snippet.ejs", {
    loggedIn: true,
    user,
    userScores,
    divergentScores,
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

async function getNESTReport(req, res) {
  const { userScore } = res.locals;
  const user_feedbacks = [];

  for (const module of userScore.module_scores) {
    const module_id = module._id;
    const module_name = module.name;
    const module_score = module.score;

    const module_feedback = await NESTFeedback.findOne({
      module_id,
      min_value: { $lte: module_score },
      max_value: { $gte: module_score },
    });

    user_feedbacks.push({
      module_name,
      module_score,
      module_feedback,
    });
  }

  res.render("reports/" + userScore.assessment_key, {
    ...res.locals,
    user: req.user,
    userScore,
    getChartData,
    user_feedbacks,
  });
}

module.exports.openReport = async (req, res) => {
  const userScore = await UserScore.findById(req.params.user_score_id);
  res.locals.userScore = userScore;

  if (userScore.assessment_key == "NEST") {
    return getNESTReport(req, res);
  }

  const file = path.join(
    __dirname,
    "..",
    "views",
    "reports",
    userScore.assessment_key + ".ejs"
  );

  if (!fs.existsSync(file)) {
    return res.render("error/index", {
      ...res.locals,
      message: "Sorry, this report is not currently available!",
    });
  }

  return res.render("reports/" + userScore.assessment_key, {
    ...res.locals,
    user: req.user,
    userScore,
    getChartData,
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
  res.redirect("/users/scores");
};

/* update user profile */
module.exports.updateUserProfile = async (req, res) => {
  // console.log(req.body);

  if (req.body.name) {
    req.user.name = req.body.name;
  }

  if (req.body.email) {
    req.user.email = req.body.email;
  }

  if (req.body.bio) {
    req.user.bio = req.body.bio;
  }

  if (req.body.mobile) {
    req.user.mobile = req.body.mobile;
  }

  if (req.body.user_type) {
    req.user.user_type = req.body.user_type;
  }

  if (req.body.country) {
    req.user.address.country = req.body.country;
  }

  if (req.body.city) {
    req.user.address.city = req.body.city;
  }

  if (req.body.state) {
    req.user.address.state = req.body.state;
  }

  if (req.body.zip) {
    req.user.address.zip = req.body.zip;
  }

  if (req.body.year) {
    req.user.dob.year = req.body.year;
  }

  if (req.body.month) {
    req.user.dob.month = req.body.month;
  }

  if (req.body.day) {
    req.user.dob.day = req.body.day;
  }

  if (req.body.status === "on") {
    req.user.status = "public";
  } else {
    req.user.status = "private";
  }

  if (req.body.user_type === "student") {
    qualificationKeys.map((element) => {
      const { key, subjectKey, institutionKey } = element;

      if (req.body[subjectKey]) {
        req.user.qualifications[key].subject = req.body[subjectKey];
      }

      if (req.body[institutionKey]) {
        req.user.qualifications[key].institution = req.body[institutionKey];
      }
    });
  } else {
    if (req.body.organization) {
      req.user.organization = req.body.organization;
    }

    if (req.body.designation) {
      req.user.designation = req.body.designation;
    }

    if (req.body.highest_qualification) {
      req.user.highest_qualification = req.body.highest_qualification;
    }

    if (req.body.discipline) {
      req.user.discipline = req.body.discipline;
    }

    if (req.body.institution) {
      req.user.institution = req.body.institution;
    }

    if (req.body.work_experience) {
      req.user.work_experience = req.body.work_experience;
    }
  }

  /* Update Account */

  let profile = await UserProfile.findById({ _id: req.user._id });

  Object.assign(profile, req.user);

  const newProfile = await profile.save();

  /* Authenticate User */

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

  await UserProfile.findByIdAndRemove(user_id);
  await UserModule.deleteMany({ user_id });
  await UserAnswer.deleteMany({ user_id });
  res.redirect("/");
};

module.exports.getSettings = (req, res) => {
  res.render("profile/settings", { loggedIn: true });
};

module.exports.RetakeAssessment = async (req, res) => {
  const user_id = req.user._id;
  const assessment_key = req.params.key;

  await UserAssessment.updateOne(
    {
      user_id,
      assessment_key,
    },
    {
      $set: {
        completed: false,
      },
    }
  );

  await UserModule.updateMany(
    {
      user_id,
      assessment_key,
    },
    {
      $set: {
        time_spent: 0,
        status: "Pending",
        no_attempted: 0,
      },
    }
  );

  res.redirect("/details/" + assessment_key);
};

module.exports.DeleteScores = async (req, res) => {
  const doc = await UserScore.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/users/scores");
};

module.exports.DeleteAnswers = async (req, res) => {
  const doc = await UserAnswer.deleteMany({ user_id: req.user._id });
  console.log(doc);
  res.redirect("/");
};
