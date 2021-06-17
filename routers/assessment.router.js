const { Router } = require("express");
const Assessment = require("../models/assessment");

const router = Router();

// GET ALL ASSESSMENTS
// GET /api/assessments/
router.get("/", (req, res) => {
  Assessment.find().then((docs) => res.json(docs))
});

// GET ONE ASSESSMENT
// GET api/assessments/<id>
router.get("/:id", (req, res) => {
  Assessment.findById(req.params.id).then(doc => res.json(doc))
});


// CREATE AN ASSESSMENT
// POST api/assessments
router.post("/", (req, res) => {
  Assessment.create(req.body).then((doc) => res.json(doc))
});

// ADD MODULE TO ASSESSMENT
// POST api/assessments/<id>/add-module 
router.post("/:id/add-module", (req, res) => {

  const module_id = req.body.module_id
  const module_name = req.body.module_name

  Assessment.findById(req.params.id)
    .then((found) => {
      if (found) {

        // check for duplicates before adding
        if (!found.modules.find((m) => m.id == module_id)) {
          found.modules.push({
            id: module_id,
            name: module_name
          });

        }
      }

      found.save().then(doc => res.json(doc))
    })
});

// UPDATE ASSESSMENT
// PUT api/assessments/<id>
router.put("/:id", (req, res) => {
  Assessment.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((doc) => res.json(doc))
});

// DELETE ASSESSMENT
// DELETE api/assessments/<id>
router.delete("/:id", (req, res) => {
  Assessment.findOneAndDelete({ _id: req.params.id })
    .then((doc) => res.json(doc))
});

module.exports = router;
