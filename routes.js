const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { Candidate, Module } = require("./model");

// Login candidate
// body: { username, password }
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!password) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const candidate = await Candidate.findOne({ username });
  if (!candidate) {
    return res.status(400).json({ message: "Username not found" });
  }
  if (candidate.password != password) {
    return res.status(400).json({ message: "Password incorrect" });
  }
  res.status(200).json(candidate);
});

// Sign up route
// body: { username, password }
router.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).json({ message: "Invalid username" });
  }
  if (!password) {
    return res.status(400).json({ message: "Invalid password" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be atleast six characters long" });
  }

  const candidate = await Candidate.findOne({ username });

  if (candidate) {
    return res.status(400).json({ message: "Username is taken" });
  }
  try {
    const candidate = await Candidate.create({
      username,
      password,
      name: req.body.name || username,
      email: req.body.email,
      age: req.body.age,
      status: "trial",
    });
    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get All Modules
// Get /api/modules/:module_id
router.get("/modules", async (req, res) => {
  try {
    const modules = await Module.find({});
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Module
// GET /api/modules/:module_id
router.get("/modules/:module_id", async (req, res) => {
  const module = await Module.findById(req.params.module_id);
  if (module) {
    return res.status(200).json(module);
  } else {
    res.status(400).json({ message: "module not found" });
  }
});

// Add Module
// POST /api/modules
router.post("/modules", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Module name is required" });
  }
  try {
    const module = await Module.create({
      _id: mongoose.Types.ObjectId(),
      name: req.body.name,
      time_limit: req.body.time_limit,
      num_sections: 0,
    });
    return res.status(201).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Edit Module
// PUT /api/modules/:module_id
router.put("/modules/:module_id", async (req, res) => {
  try {
    const module = await Module.findById(req.params.module_id);
    if (!module) {
      return res.status(400).json({
        message: "Module not found",
      });
    }

    if (req.body.instructions) {
      module.instructions = req.body.instructions;
    }

    if (req.body.time_limit) {
      module.time_limit = req.body.time_limit;
    }

    if (req.body.name) {
      module.name = req.body.name;
    }

    await module.save();

    res.status(200).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Section
// POST /api/modules/:module_id/sections/
router.post("/modules/:module_id/sections", async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: "Section name is required" });
  }
  try {
    const module = await Module.findById(req.params.module_id);
    if (!module) {
      return res.status(400).json({
        message: "Module not found",
      });
    }
    if (!module.sections) {
      module.sections = [];
    } else {
      module.sections.push({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        module_id: module._id,
        num_questions: 0,
        questions: [],
      });
      module.num_sections = module.sections.length;
    }
    await module.save();

    return res.status(201).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Edit Section
// PUT /api/modules/:module_id/sections/:section_id
router.put("/modules/:module_id/sections/:section_id", async (req, res) => {
  try {
    const module = await Module.findOne({
      _id: req.params.module_id,
      "sections._id": req.params.section_id,
    });

    if (!module) {
      res.status(400).json({
        message: "Module not found",
      });
    }

    const section = module.sections.find(
      (section) => section._id == req.params.section_id
    );

    if (req.body.name) {
      section.name = req.body.name;
    }

    if (req.body.num_questions) {
      section.num_questions = req.body.num_questions;
    }

    await module.save();

    res.status(200).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Question
// POST /api/modules/:module_id/sections/:section_id/questions
router.post(
  "/modules/:module_id/sections/:section_id/questions",
  async (req, res) => {
    if (!req.body.content) {
      return res.status(400).json({ message: "Question content is missing" });
    }

    try {
      const module = await Module.findOne({
        _id: req.params.module_id,
        "sections._id": req.params.section_id,
      });

      if (!module) {
        return res.status(400).json({
          message: "Module not found",
        });
      }

      section = module.sections.find(
        (section) => section._id == req.params.section_id
      );

      section.questions.push({
        _id: mongoose.Types.ObjectId(),
        section_id: section._id,
        content: req.body.content,
        grading_method: req.body.grading_method || "Rating",
      });

      section.num_questions = section.questions.length;

      await module.save();

      res.status(200).json(module);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Answer Question
// POST /api/candidates/:candidate_id/modules/:module_id/answer
router.post(
  "/candidates/:candidate_id/modules/:module_id/answer/:question_id",
  async (req, res) => {}
);

// Enroll Module
// POST /api/candidates/:candidate_id/modules/:module_id/enroll
// Response: module
router.post(
  "/candidates/:candidate_id/modules/:module_id/enroll",
  async (req, res) => {
    try {
      const candidate = await Candidate.findById(req.params.candidate_id);
      if (!candidate) {
        return res.status(400).json({ message: "Candidate not found" });
      }

      const module = await Module.findById(req.params.module_id);

      if (!module) {
        return res.status(400).json({ message: "Module not found" });
      }

      const found = candidate.modules_enrolled.find(
        (module_id) => module_id == req.params.module_id
      );

      if (!found) {
        candidate.modules_enrolled.push(req.params.modules_enrolled);
      } else {
        return res.status(400).json({
          message: "Already enrolled in module",
        });
      }

      res.json(200).json(module);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Edit Candidate Details
// PUT /api/candidates/:candidate_id
router.put("/candidates/:candidate_id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.candidate_id);

    if (!candidate) {
      return res.status(400).json({ message: "Candidate not found" });
    }

    if (req.body.name) {
      candidate.name = req.body.name;
    }

    if (req.body.age) {
      candidate.age = req.body.age;
    }

    if (req.body.email) {
      candidate.email = req.body.email;
    }

    if (req.body.status) {
      candidate.status = req.body.status;
    }

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password must be atleast six characters long" });
      } else {
        candidate.password = req.body.password;
      }
    }

    if (req.body.username) {
      const found = await Candidate.findOne({ username: req.body.username });
      if (found) {
        return res.status(400).json({ message: "Username is taken" });
      } else {
        candidate.username = req.body.username;
      }
    }

    await candidate.save();

    res.status(200).json(candidate);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
