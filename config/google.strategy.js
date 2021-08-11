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
      const email = profile.emails[0].value;

      const currentUser = await UserProfile.findOne({
        "provider.id": profile.id,
        "provider.name": profile.provider,
      });

      if (currentUser) {
        console.log("[google oauth2] found user: ", currentUser.name);
        return done(null, currentUser);
      }
      const duplicateEmail = await UserProfile.findOne({ email });
      if (duplicateEmail) {
        // Merge email and google account?
        duplicateEmail.provider = { name: profile.provider, id: profile.id };
        await duplicateEmail.save();
        console.log(
          "[found account with existing gmail address]",
          duplicateEmail
        );
        return done(null, duplicateEmail);
      } else {
        const newUser = await UserProfile.create({
          name: profile.displayName,
          img_url: profile.photos[0].value,
          email,
          provider: { name: profile.provider, id: profile.id },
        });

        console.log("[google oauth2] created user: ", newUser.name);
        return done(null, newUser);
      }
    } catch (err) {
      done(err);
    }
  }
);
