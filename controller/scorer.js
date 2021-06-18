const { UserAnswer, Question, UserAssessment, UserScore, Assessment, UserModule } = require("../models")

//
// This function accepts an assessment_id through the request url.
// This function creates the scores for this assessment using the answers
// provided by the user. Assumes the assessment was completed by the user.
// The user cannot undo the result, but can retake the assessment to generate
// new scores. The scoring formula is simple, it fetches the points assigned to
// each choice in each question and udpates the score of the module which that
// question belongs to. It combines all module scores of that assesment into a 
// neat object.
///
module.exports.scoreAssessment = async function (req, res) {
    const { assessment_id } = req.body
    const user_id = req.user._id
    const { user_assessment } = res.locals
    const { assessment_name, assessment_key } = user_assessment
    const user_modules = await UserModule.find({ user_id, assessment_id })

    return res.json(await

        (async function score_all_modules() {

            let module_scores = []

            user_modules.map(async ({ user_id, module_id, module_name }) => {

                const user_answers = await UserAnswer.find({ user_id, module_id })

                const score = await (

                    // Function to score the answers for one module.
                    // From the user answer collection, it fetches all the answers
                    // for the module. Then as it loops through the answers,
                    // it fetches each question from the bank and
                    // retrieves the points assigned to the answer choice.

                    async function get_module_score() {
                        let score = 0
                        user_answers.map(async user_answer => {

                            const choice = await (
                                //Function to retrieve the choice selected by the user for
                                //a question. The choice object contains the points
                                //assigned to that choice. The user score is updated with the value
                                //
                                async function get_selected_choice({ choice_id, question_id }) {

                                    const { choices } = await Question.findById(question_id)
                                    return choices.find(choice => choice._id.toString() == choice_id)

                                })(user_answer)

                            console.log('Points Awarded: ', choice.points)
                            score += choice.points
                        })
                        return score
                    })()

                console.log('MODULE TOTAL POINTS: ', score)

                module_scores.push({
                    name: module_name,
                    score
                })
            })

            return module_scores

        })()
    )

    /*
     * A score object is created each time the user submits the form,
     * so as to have access to previous attempt scores. The module scores
     * contains the data required to make the plots for the assessment
     * on the client, using the chartjs library.
     */
    // const assessment_score = await UserScore.create({
    //     user_id,
    //     assessment_id,
    //     assessment_name,
    //     assessment_key,
    //     module_scores,
    //     date: new Date()
    // })

    // await update_user_assessment_stat(user_id, assessment_id)
    // console.log('assessment scoring finished: ', assessment_score)
}


/*
 * This function updates the attempts count and marks the assessment as completed for the user.
 */
async function update_user_assessment_stat(user_id, assessment_id) {
    const user_assessment = await UserAssessment.findOne({ user_id, assessment_id })
    user_assessment.attempts = (user_assessment.attempts || 0) + 1
    user_assessment.completed = true
    await user_assessment.save()
}

