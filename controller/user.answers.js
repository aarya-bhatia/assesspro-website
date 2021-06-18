const { Question, UserAnswer, UserModule } = require('../models')

/* 
 * Module id should be in a hidden field.
 * Input names in the form should be set to the question ids.
 * Input values in the form should be set to the choice id.
 */
module.exports.saveAnswers = async function (req, res) {

    const user_id = req.user._id

    const { assessment_id } = res.locals

    const { user_module_id } = req.params

    const user_module = await UserModule.findById(user_module_id)
    const { module_id, module_name, module_key } = user_module

    const questions = await Question.find({ module_id })

    let attempted = 0

    questions.map(async question => {

        const { _id, choices } = question

        // Get form input value
        const choice_id = req.body[_id]

        if (choice_id) {

            attempted++

            // Find the value of the selected choice 
            const { text } = choices.find(({ _id }) => _id.toString() == choice_id)

            if (text) {

                // Update or create answer for current question
                await UserAnswer.updateOne(
                    {
                        user_id,
                        question_id: _id,
                        module_id,
                        module_key,
                        module_name
                    },
                    {
                        choice_id,
                        value: text
                    },
                    { upsert: true }
                )
            }
        }
    })

    console.log('attempted questions: ', attempted)

    user_module.no_attempted = attempted

    if (attempted === user_module.no_questions) {

        user_module.status = 'Completed'
    }
    else {
        user_module.status = 'Pending'
    }

    console.log('user module: ', user_module)

    await user_module.save()

    res.redirect('/forms/' + assessment_id)
}