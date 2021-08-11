const { Category, Assessment } = require("../models");
const router = require("express").Router();

// Home page
router.get("/", async (req, res) => {
  const categories = await Category.find({ status: "public" });
  const data = [];

  for (const category of categories) {
    const assessments = await Assessment.find({ category_id: category._id });

    data.push({
      category_name: category.name,
      category_description: category.description,
      assessments,
    });
  }

  res.render("index", {
    data,
    ...res.locals,
  });
});

module.exports = router;
