const { getAllAssessments } = require("../controller/assessments");
const router = require("express").Router();

// Home page
router.get("/", getAllAssessments);

// 404 Handler
router.get("*", (req, res) => {
  res.status(404).render("error/404", { ...res.locals });
});

// Error handler
router.use((err, req, res, next) => {
  console.log(
    "=================================================================="
  );
  console.log(JSON.stringify(err));

  res.render("error/index", {
    message: err.message || "There was an error!",
    ...res.locals,
  });
});

module.exports = router;
