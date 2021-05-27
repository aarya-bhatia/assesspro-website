const express = require("express");
const router = express.Router();

const { Candidate, Answer, Question, Section, Module } = require("./model");

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
router.post("/modules", async (req, res) => {
  if (!req.body.name) {
    return res.status(500).json({ message: "Module name is required" });
  }
  try {
    const module = await Module.create({
      name: req.body.name,
      time_limit: req.body.time_limit,
    });
    return res.status(201).json(module);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add Section
// POST /api/modules/:module_id/sections/

// Add Question
// POST /api/modules/:module_id/sections/:section_id/questions

// Add Question to module

// Get Questions

module.exports = router;
