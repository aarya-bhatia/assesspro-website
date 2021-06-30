const cookieSession = require("cookie-session");

module.exports = cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY],
});
