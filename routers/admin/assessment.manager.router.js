const { Assessment } = require("../../models");

const router = require("express").Router();

router.get("/", async (req, res) => {
  const assessments = await Assessment.find({});

  res.render("admin/assessment.manager.ejs", {
    ...res.locals,
    assessments,
  });
});

router.get("/edit/:id", async (req, res) => {});
router.get("/delete/:id", async (req, res) => {});
router.post("/add", async (req, res) => {});

module.exports = router;
