const { UserAnswer, Question, UserAssessment, UserScore, Assessment } = require("../models")

/*
 * This function accepts an assessment_id through the request url.
 * This function creates the scores for this assessment using the answers
 * provided by the user. Assumes the assessment was completed by the user.
 * The user cannot undo the result, but can retake the assessment to generate
 * new scores. The scoring formula is simple, it fetches the points assigned to
 * each choice in each question and udpates the score of the module which that
 * question belongs to. It combines all module scores of that assesment into a 
 * neat object.
 */
module.exports.scoreAssessment = async function (req, res) {
    try {
        const { assessment_id } = req.body

        const { modules } = assessment_id

        let module_scores = []

        modules.map(module_obj => {
            const name = module_obj.name
            const score = await get_module_score(module_obj)
            module_scores.push({ name, score })
        })

        const assessment_score = await create_assessment_score(
            assessment_id,
            module_scores
        )

        await update_user_assessment_stat(assessment_id)

        console.log('assessment scoring finished: ', assessment_score)
        res.json(assessment_score)
    }
    catch (err) {

        res.status(500).json({ message: err.message || 'Something went wrong while grading the assessment!' })
    }
}

/*
 * A score object is created each time the user submits the form,
 * so as to have access to previous attempt scores. The module scores
 * contains the data required to make the plots for the assessment
 * on the client, using the chartjs library.
 */
async function create_assessment_score(assessment_id, module_scores) {

    const assessment = await Assessment.findById(assessment_id)

    return await UserScore.create(
        {
            user_id: req.user._id,
            assessment_id,
            module_scores,
            assessment_name: assessment.name,
            assessment_key: assessment.key,
            date: new Date(),
        }
    )
}

/*
 * This function updates the attempts count and marks the assessment as completed for the user.
 */
async function update_user_assessment_stat(assessment_id) {

    const user_assessment = await UserAssessment.findOne({ user_id: req.user._id, assessment_id })

    user_assessment.attempts++
    user_assessment.completed = true

    await user_assessment.save()
}

/*
 * Function to retrieve the choice selected by the user for 
 * a question. The choice object contains the points 
 * assigned to that choice. The user score is updated with the value
 */
async function get_selected_choice({ choice_id, question_id }) {

    const { choices } = await Question.findById(question_id)

    return choices.find(choice => choice._id === choice_id)
}

/*
 * Function to score the answers for one module.
 * From the user answer collection, it fetches all the answers
 * for the module. Then as it loops through the answers,
 * it fetches each question from the bank and 
 * retrieves the points assigned to the answer choice. 
 */
async function get_module_score(module_obj) {

    const user_answers = await UserAnswer.find({ user_id: req.user._id, module_id: module_obj._id })

    let module_score = 0

    user_answers.map(user_answer => {

        const choice = await get_selected_choice(user_answer)

        if (choice) { module_score += choice.points }

    })

    return module_score
}
