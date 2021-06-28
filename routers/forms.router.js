const { saveAnswers } = require("../controller/user.answers");
const { scoreAssessment } = require("../controller/scorer");
const { getModuleList, getModuleForm } = require("../controller/forms");

const router = require("express").Router();

// Get Module List
// GET /forms/:assessment_id
router.get("/", getModuleList);

// Get Module Form
// Get /forms/:assessment_id/questions/:user_module_id
router.get("/questions/:user_module_id", getModuleForm);

// Sumbit Module Form
// POST /forms/:assessment_id/submit
router.post("/submit/:user_module_id", saveAnswers);

// Submit All and Score Assessment
// POST /forms/:assessment_id/score
router.post("/score", scoreAssessment);

module.exports = router;
