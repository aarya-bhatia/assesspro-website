const { Strategy } = require("passport-local");
const { UserProfile } = require("../models");

module.exports = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const user = await UserProfile.login(email, password);
      return done(null, user);
    } catch (err) {
      return done(null, false, { message: err.message });
    }
  }
);
