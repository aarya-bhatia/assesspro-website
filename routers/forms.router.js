const { saveAnswers } = require('../controller/form');
const { scoreAssessment } = require('../controller/scorer');
const { checkUserEnrolled } = require('../controller/auth')
const { Assessment, Module, Question } = require('../models')

const router = require('express').Router()

// Get the form for an assessment
// GET /forms/:assessment_key
router.get('/:assessment_key', async (req, res) => {
    const { name, _id, modules } = await Assessment.findOne({ key: req.params.assessment_key })

    res.render('forms/moduleList.ejs', {
        user: req.user,
        title: name,
        description: 'Todo... Description',
        assessment_id: _id,
        modules
    })
})

// Render questions for a module
// Get /forms/questions
router.get('/questions', getModuleId, (req, res) => {
    const { module_id, module_name } = req.body
    const questions = await Question.find({ module_id })

    res.render('forms/moduleForm.ejs', {
        user: req.user,
        title: 'Module: ' + module_name,
        description: 'Todo... Description',
        module_id,
        questions
    })
})

// Sumbit user's answers for the questions in a module 
// POST /forms/submit
router.post('/submit', saveAnswers)

// Submit the form and score all questions
// POST /forms/score
router.post('/score', scoreAssessment)

module.exports = router