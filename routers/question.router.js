const { Router } = require("express");
const Question = require("../models/Question");

const router = Router();

// Get All Questions
router.get("/", (req, res) => {
  Question.find().then((docs) => res.json(docs))
});

// Get All Questions Of A Module
router.get("/:module_id", (req, res) => {
  Question.find({ module_id: req.params.module_id }).then(docs => res.json(docs))
})

// Create Question
router.post("/", (req, res) => {
  Question.create(req.body)
    .then((question) => res.status(201).json(question))
});

module.exports = router;
