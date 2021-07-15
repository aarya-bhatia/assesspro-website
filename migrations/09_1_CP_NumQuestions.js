const { connect, connection } = require("../config/db.config");
const { Module, Assessment, CPQuestion } = require("../models");

connect();

connection.once("open", async function () {
  const assessment = await Assessment.findOne({ key: "CP" });
  const moduleList = assessment.modules.map(({ _id }) => _id);
  const CPModules = await Module.find({ _id: { $in: moduleList } });
  for (const CPModule of CPModules) {
    const questions = await CPQuestion.find({ module_id: CPModule._id });
    CPModule.no_questions = questions.length;
    await CPModule.save();
    console.log("updated module: ", CPModule);
  }
  console.log("Finished.");
});
