const { UserAssessment, UserProfile } = require('../models')
const bcrypt = require('bcrypt')

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

module.exports.CreateUser = async (req, res) => {
  const { firstname, lastname, username, email, password } = req.body

  if (!firstname || !lastname || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields must have a value' })
  }

  if (username.length < 6 || password.length < 6) {
    return res.status(400).json({ message: 'Username or password must be atleast 6 characters long.' })
  }

  const name = (firstname.charAt(0).toUpperCase() + firstname.substring(1).toLowerCase()
    + ' ' + lastname.charAt(0).toUpperCase() + lastname.substring(1).toLowerCase())

  const found = await UserProfile.findOne({ username })

  if (found) {
    return res.status(400).json({ message: 'Username is taken.' })
  }

  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS))
  const hash = await bcrypt.hash(password, salt)

  const img_url = `https://ui-avatars.com/api/?background=random&size=128&name=${name}`

  const user = await UserProfile.create({
    name,
    username,
    email,
    password: hash,
    img_url
  })

  console.log('Created new user: ', user._id)

  req.flash({
    success: ["You are signed up! Please login to continue"]
  })

  res.redirect('/auth/login')
}