const fs = require("fs");
const { connect, connection } = require("../config/db.config");
const { Module, Assessment, Category, Feedback } = require("../models");

connect();

connection.once("open", createFiles2);

function writeJsonFile(file, content) {
  const jsonData = JSON.stringify(content);
  fs.writeFileSync(file, jsonData);
  console.log(file);
}

async function createFiles() {
  writeJsonFile(
    "/Users/aarya/Desktop/AssessProWebsite/migrations/json/categories.json",
    await Category.find({})
  );
  writeJsonFile(
    "/Users/aarya/Desktop/AssessProWebsite/migrations/json/modules.json",
    await Module.find({})
  );

  writeJsonFile(
    "/Users/aarya/Desktop/AssessProWebsite/migrations/json/assessments.json",
    await Assessment.find({})
  );
}

async function createFiles2() {
  writeJsonFile(
    "/Users/aarya/Desktop/AssessProWebsite/migrations/json/nest.feedback.json",
    await Feedback.find({})
  );
}
