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
    .populate("modules")
    .exec((err, doc) => {
      if (err) {
        console.log("Error populating assessments");
        next(err);
      } else {
        res.json(doc);
      }
    });
});

router.post("/", (req, res, next) => {
  Assessment.create(req.body)
    .then((doc) => res.status(201).json(doc))
    .catch((err) => next(err));
});

router.post("/:id/add_module/:module_id", (req, res, next) => {
  const module_id = req.params.module_id;
  Assessment.findById(req.params.id)
    .then((found) => {
      if (found) {
        if (!found.modules.find((m) => m == module_id)) {
          found.modules.push(module_id);
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
