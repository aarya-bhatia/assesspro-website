const { Router } = require("express");
const QuestionBank = require("../models/question_bank");

const router = Router();

router.get("/", (req, res) => {
  Question.find().then((docs) => res.json(docs))
});

router.post("/", (req, res) => {
  QuestionBank.create(req.body)
    .then((question) => res.status(201).json(question))
});

module.exports = router;
