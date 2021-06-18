/* 
 * Module id should be in a hidden field.
 * Input names in the form should be set to the question ids.
 * Input values in the form should be set to the choice id.
 */
module.exports.saveAnswers = async function (req, res) {

    const user_id = req.user._id

    const { module_id } = req.body

    const questions = await Question.find({ module_id })

    questions.map(question => {

        // Get form input value
        const choice_id = req.body[question_id]

        // Find the value of the selected choice 
        const { text } = question.choices.find(({ _id }) => { return _id === choice_id })

        // Update or create answer for current question
        await UserAnswer.updateOne(
            { user_id: user_id, question_id: question._id, module_id },
            { choice_id, value: text },
            { upsert: true }
        )
    })

    // TODO: return back to page
    res.redirect('/form')
}