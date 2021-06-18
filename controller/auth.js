const { UserAssessment } = require('../models')

/*
 * Middleware to check if user is logged in
 */
module.exports.isAuth = (req, res, next) => {

  if (!req.user) {

    res.redirect("/auth/login");

  }
  else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  res.locals.loggedIn = req.user ? true : false
  next()
}

/**
 * Middleware to check if user is enrolled in assessment before they can access it
 */
module.exports.checkUserEnrolled = async (req, res, next) => {
  const { assessment_id } = req.params

  res.locals.assessment_id = assessment_id

  const found = await UserAssessment.findOne({ user_id: req.user._id, assessment_id })

  if (found) {

    res.locals.user_assessment = found
    next()

  }
  else {

    next({ status: 400, message: 'Access Denied' })

  }

}