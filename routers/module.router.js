const { Router } = require("express");
const { Module, Question } = require("../model");

const router = Router();

router.get("/", (req, res, next) => {
  Module.find()
    .then((docs) => res.json(docs))
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  Module.findById(req.params.id)
    .then((module) => {
      if (!module) {
        throw { status: 400, message: "Module not found" };
      }
      Question.find({ module_id: module._id })
        .then((questions) => {
          res.status(200).json(Object.assign(module, { questions }));
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  Module.create(req.body)
    .then((module) => res.status(201).json(module))
    .catch((err) => next(err));
});

module.exports = router;
