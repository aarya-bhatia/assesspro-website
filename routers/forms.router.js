const router = require('express').Router()
const Assessment = require('../models/Assessment')
const Module = require('../models/Module')
const Question = require('../models/Question')
const UserAnswer = require('../models/UserAnswer')
const UserAssessment = require('../models/UserAssessment')

/**
 * Middleware to check if user is enrolled in assessment before they can access it
 */
function checkUserEnrolled(req, res) {
    const key = req.params.assessment_key

    const found = await UserAssessment.findOne({
        user_id: req.user._id,
        assessment_key: key
    })

    return (found ?
        next() :
        next({ status: 400, message: 'User does not have access to this assessment' })
    );
}

// Get the form for an assessment
// GET /forms/:assessment_key
router.get('/:assessment_key', checkUserEnrolled, (req, res) => {
    Assessment.findOne({ key: req.params.assessment_key }).then(assessment => {
        res.render('forms/' + req.params.assessment_key, {
            user: req.user,
            assessment
        })
    })
})


// Score an assessment 
// POST /forms/score/:assessment_id
router.post('/score/:assessment_id', async (req, res) => {

    const user_id = req.user._id
    const assessment_id = req.assessment_id

    const assessment = await Assessment.findOne({ _id: assessment_id })

    assessment.modules.map(mod => {

        const module_id = mod.id
    })
})

// Sumbit user's answers for the questions in a module 
// POST /forms/submit/:module_id
router.post('/submit/:module_id', async (req, res) => {

    const user_id = req.user._id
    const module_id = req.params.module_id

    const questions = await Question.find({ module_id })

    questions.map(question => {

        /* Input names in the form should be set to the question ids */
        /* Input values in the form should be set to the choice id */

        const choice_id = req.body[question_id]

        // Find the text of the selected choice 
        const { text } = question.choices.find(choice => {
            return choice._id === choice_id
        })

        await UserAnswer.updateOne(
            {
                user_id: user_id, question_id: question._id, module_id
            },
            {
                choice_id, value: text
            },
            {
                // Create doc if not exist
                upsert: true
            }
        )
    })
})

// Score questions in a module for the user
// POST /forms/score/:module_id
router.post('/score/:module_id', async (req, res) => {

    const user_id = req.user._id
    const module_id = req.params.module_id

    // Get the module question/answer bank 
    const questions = await Question.find({ module_id })

    let score = 0

    // Loop through all questions in the module
    questions.map(({ _id, choices }) => {

        // Find user answers for current question
        const { choice_id } = await UserAnswer.findOne(
            {
                user_id,
                question_id: _id
            }
        )

        // Look for the choice selected by the user
        // in the question object
        if (choice_id) {
            const choice = choices.find(c => {
                c._id === choice_id
            })

            // Update the points
            if (choice) {
                const pointsAwarded = choice.points
                score += pointsAwarded
            }
        }
    })

    // Get the name of the module
    const { name } = await Module.findById(module_id)

    // Save/update the module score in db for this user
    await UserScore.updateOne(
        {
            user_id,
            module_id,
            module_name: name
        },
        {
            score
        },
        {
            upsert: true
        }
    );
});

module.exports = router