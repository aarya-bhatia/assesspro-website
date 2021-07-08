const GoogleStrategy = require("passport-google-oauth20");
const UserProfile = require("../models/UserProfile");

module.exports = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect",
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const currentUser = await UserProfile.findOne({
        "provider.id": profile.id,
        "provider.name": profile.provider,
      });

      if (currentUser) {
        console.log("[google oauth2] found user: ", currentUser);
        return done(null, currentUser);
      } else {
        const newUser = await UserProfile.create({
          name: profile.displayName,
          img_url: profile.photos[0].value,
          email: profile.emails[0].value,
          provider: { name: profile.provider, id: profile.id },
        });

        console.log("[google oauth2] created user: ", newUser);
        return done(null, newUser);
      }
    } catch (err) {
      done(err);
    }
  }
);
