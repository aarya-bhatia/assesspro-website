const { Router } = require("express");
const Module = require("../models/Module")

const router = Router();

// Get all modules 
// GET /api/modules
router.get("/", (req, res) => {
  Module.find()
    .then((docs) => res.json(docs))
});

// Get one module
// GET api/modules/<id>
router.get("/:id", (req, res) => {
  Module.findById(req.params.id)
    .then((module) => res.json(module))
});

// Create a module
// POST api/modules
router.post("/", (req, res) => {
  Module.create(req.body)
    .then((module) => res.json(module))
});

module.exports = router;
