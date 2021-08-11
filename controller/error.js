const FileLogger = require("log-to-file");

module.exports.PageNotFound = (req, res) => {
  FileLogger("Page Not Found...", "error.log");
  res.status(404).render("error/404", { ...res.locals });
};

module.exports.ErrorHandler = (req, res, next) => {
  console.log(
    "=================================================================="
  );
  console.log(JSON.stringify(err));
  FileLogger(JSON.stringify(err), "error.log");

  res.render("error/index", {
    message: err.message || "There was an error!",
    ...res.locals,
  });
};
