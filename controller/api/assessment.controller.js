const { Assessment } = require("../../model");

exports.createAssessment = async ({ name }, callback, error) => {
  try {
    const assessment = await Assessment.create({
      name,
      modules: [],
    });
    callback(assessment);
  } catch (err) {
    error(err);
  }
};

exports.getAssessment = async ({ id }, callback, error) => {
  const found = await Assessment.findById(id);
  if (found) {
    callback(found);
  } else {
    error({ status: 400, message: "Assessment not found" });
  }
};

exports.addModule = async ({ id, module_id }, callback, error) => {
  const found = await Assessment.findById(id);

  if (found) {
    if (!found.modules.find((m) => m == module_id)) {
      found.modules.push(module_id);
    }
    await found.save();
    callback(found);
  } else {
    error({ status: 400, message: "Assessment not found" });
  }
};

exports.removeModule = async ({ id, module_id }, callback, error) => {
  const found = await Assessment.findById(id);

  if (found) {
    found.modules = found.modules.filter((m) => m != module_id);
    await found.save();
    callback(found);
  } else {
    error({ status: 400, message: "Assessment not found" });
  }
};

exports.removeAssessment = async ({ id }, callback, error) => {
  try {
    const res = await Assessment.findOneAndDelete({ _id: id });
    callback(res);
  } catch (err) {
    error(err);
  }
};
