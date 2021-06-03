const { Router } = require("express");
const { Assessment, Module } = require("../model");

const router = Router();

router.get("/", (req, res, next) => {
  Assessment.find()
    .then((docs) => res.json(docs))
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  Assessment.findById(req.params.id)
    .then((assessment) => {
      if (!assessment) {
        throw { status: 400, message: "Assessment not found" };
      }
      Module.find({ _id: { $in: assessment.module_ids } })
        .then((modules) => {
          // console.log(modules);

          assessment.modules = modules;
          console.log(assessment);

          const doc = Object.assign(assessment, { modules });
          res.status(200).json(doc);
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  Assessment.create(Object.assign({ name: "" }, req.body))
    .then((doc) => res.status(201).json(doc))
    .catch((err) => next(err));
});

router.post("/:id/add_module/:module_id", (req, res, next) => {
  const module_id = req.params.module_id;
  Assessment.findById(req.params.id)
    .then((found) => {
      if (found) {
        if (!found.module_ids.find((m) => m == module_id)) {
          found.module_ids.push(module_id);
        }
        found.save().then((doc) => {
          res.json(doc);
        });
      } else {
        throw { status: 400, message: "Assessment not found" };
      }
    })
    .catch((err) => next(err));
});

router.put("/:id", (req, res, next) => {
  Assessment.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((doc) => res.json(doc))
    .catch((err) => next(err));
});

router.delete("/:id", (req, res, next) => {
  Assessment.findOneAndDelete({ _id: req.params.id })
    .then((doc) => res.json(doc))
    .catch((err) => next(err));
});

module.exports = router;
