const { Category } = require("../models");

module.exports = {
  getAllAssessments,
};

async function getAllAssessments(req, res) {
  const categories = await Category.find({});

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
}
