const { UserAssessment } = require('../models')

/*
 * Middleware to check if user is logged in
 */
module.exports.isAuth = (req, res, next) => {
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    next();
  }
};

/**
 * Middleware to check if user is enrolled in assessment before they can access it
 */
module.exports.checkUserEnrolled = async (req, res, next) => {
  const key = req.params.assessment_key

  const found = await UserAssessment.findOne({ user_id: req.user._id, assessment_key: key })

  return (found ?
    next() :
    next({ status: 400, message: 'User does not have access to this assessment' })
  );

}