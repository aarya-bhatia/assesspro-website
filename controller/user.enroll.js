const { UserAssessment, Assessment, UserModule, Module } = require('../models')

module.exports = {
    EnrollUser,
    UnenrollUser
}

/*
 * This function will enroll the user in an assessment.
 * It should be set as a callback on success of payment gateway. (TODO)
 */
async function EnrollUser(req, res) {
    const user_id = req.user._id
    const { assessment_id } = req.params

    console.log('User is not enrolled, enrolling user...')

    const assessment = await Assessment.findById(assessment_id)
    const { modules } = assessment

    await UserAssessment.create({
        user_id,
        user_name: req.user.name,
        assessment_id: assessment._id,
        assessment_key: assessment.key,
        assessment_name: assessment.name,
        assessment_category: assessment.category,
        assessment_plot_type: assessment.plot_type,
        assessment_description: assessment.description,
        date_purchased: new Date(),
        attempts: 0,
        completed: false
    })

    console.log('Created user assessment')

    await createUserModules(user_id, assessment_id, modules)

    res.redirect('/forms/' + assessment_id)
}

async function createUserModules(user_id, assessment_id, modules) {

    console.log('Initialising ' + modules.length + ' modules for user [id]: ' + user_id)

    return new Promise(async function (res) {

        for (const module of modules) {

            const m = await Module.findById(module.id)

            UserModule.create({
                user_id,
                assessment_id,
                module_id: m.id,
                module_name: m.name,
                module_key: m.key,
                module_type: m.type,
                module_description: m.description,
                no_questions: m.no_questions,
                no_attempted: 0,
                time_spent: 0,
                time_limit: m.time_limit,
                status: 'Pending'
            })
        }
        res()
    })
}

async function UnenrollUser(req, res) {
    const user_id = req.user._id
    const { assessment_id } = req.params
    await UserAssessment.deleteOne({ user_id, assessment_id })
    await UserModule.deleteMany({ user_id, assessment_id })
    res.redirect('/users/assessments')
}