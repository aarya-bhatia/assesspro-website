const {
  fetchAssessmentsInCategory,
  fetchCategories,
} = require("./api/assessments");

module.exports = {
  getAllAssessments,
};

async function getAllAssessments(req, res) {
  const categories = await fetchCategories();
  const data = [];

  for (const category of categories) {
    const assessments = await fetchAssessmentsInCategory(category._id);

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
