import { Router } from "express";
import { getAssessment } from "../controller/assessment.controller";
import { getModules } from "../controller/module.controller";

const router = Router();

router.get("/:id", async (req, res) => {
  await getAssessment(
    { id: req.params.id },
    (assessment) => {
      await getModules(
        { modules: assessment.modules },
        (modules) => {
          res.status(200).json(Object.assign(assessment, { modules }));
        },
        next
      );
    },
    next
  );
});

exports = router;
