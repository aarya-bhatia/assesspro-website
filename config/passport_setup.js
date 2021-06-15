require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

// todo: import User model
const user_profile = require("../models/user/user_profile");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      const user_data = {
        name: profile.displayName,
        img_url: profile.photos[0].value,
        email: profile.emails[0].value,
        provider: {
          name: profile.provider,
          id: profile.id,
        },
      };

      const query = {
        "provider.id": profile.id,
        "provider.name": profile.provider,
      };

      // check if user already exists in our db
      user_profile.findOne(query).then((currentUser) => {
        if (currentUser) {
          // already have this User
          console.log("User is: ", currentUser);
        } else {
          // create user in db
          user_profile.create(user_data).then((newUser) => {
            console.log("Created User: ", newUser);
          });
        }
      });
    }
  )
);
