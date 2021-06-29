const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Token, UserProfile } = require("../models");
const { sendEmail } = require("./send.email");

module.exports = {
  requestPasswordReset,
};

async function requestPasswordReset(email) {
  return new Promise(async (res) => {
    const user = await UserProfile.findOne({ email });
    const user_id = user._id;

    if (!user) {
      throw new Error("User does not exist");
    }

    let token = await Token.findOne({ user_id });

    if (token) {
      await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString("hex");

    const hash = await bcrypt.hash(resetToken, Number(process.env.SALT_ROUNDS));

    await Token.create({
      user_id,
      token: hash,
      createdAt: Date.now(),
    });

    let clientURL = "";

    if (process.env.NODE_ENV === "production") {
      clientURL = process.env.DEV_CLIENT_URL;
    } else {
      clientURL = process.env.PROD_CLIENT_URL;
    }

    const link = `${clientURL}/auth/passwordReset?token=${resetToken}&id=${user_id}`;

    await sendEmail(
      user.email,
      "Password Reset Request",
      {
        name: user.name,
        link,
      },
      "./template/request.reset.password.ejs"
    ).then(() => {
      console.log("Reset Link", link);
      res(link);
    });
  });
}
