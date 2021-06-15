const { Router } = require("express");
const { Question } = require("../model");

const router = Router();

router.get("/", (req, res, next) => {
  Question.find()
    .then((docs) => res.json(docs))
    .catch((err) => next(err));
});

router.post("/", (req, res, next) => {
  Question.create(req.body)
    .then((question) => res.status(201).json(question))
    .catch((err) => next(err));
});

module.exports = router;
