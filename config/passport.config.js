const passport = require("passport");
const UserProfile = require("../models/UserProfile");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  UserProfile.findById(id).then((user_found) => {
    done(null, user_found);
  });
});

passport.use(require('./google.strategy'));
passport.use(require('./local.strategy'))