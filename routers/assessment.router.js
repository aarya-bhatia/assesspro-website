const { Router } = require("express");
const { Assessment, Module } = require("../model");

const router = Router();

router.get("/:id", (req, res) => {
  Assessment.findById(req.params.id)
    .then((assessment) => {
      if (!assessment) {
        throw Error({
          status: 400,
          message: "Assessment not found",
        });
      }
      Module.find({
        _id: {
          $in: assessment.modules,
        },
      })
        .then((modules) => {
          res.status(200).json(
            Object.assign(assessment, {
              modules,
            })
          );
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post("/", (req, res) => {
  Assessment.create(Object.assign({ name: "" }, req.body))
    .then((doc) => res.status(201).json(doc))
    .catch((err) => next(err));
});

module.exports = router;
