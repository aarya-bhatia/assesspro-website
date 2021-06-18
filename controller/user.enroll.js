const { UserAssessment, Assessment, UserModule, Module } = require('../models')

module.exports = {
    isEnrolled,
    EnrollUser
}

/*
 * check if user is already enrolled in assessment
 */
async function isEnrolled(user_id, assessment_id) {
    if (await UserAssessment.findOne({ user_id, assessment_id })) {
        return true
    } else {
        return false
    }
}

/*
 * This function will enroll the user in an assessment.
 * It should be set as a callback on success of payment gateway. (TODO)
 */
async function EnrollUser(req, res) {

    try {
        const user = req.user
        const { assessment_id } = res.locals

        if (await isEnrolled(user._id, assessment_id)) {
            console.log('User is already enrolled')
            return res.redirect('/forms/' + assessment._id)
        }

        const assessment = await Assessment.findById(assessment_id)
        const { modules } = assessment

        await UserAssessment.create({
            user_id: user._id,
            user_name: user.name,
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

        modules.map(async ({ id }) => {

            const m = await Module.findById(id)

            await UserModule.create({
                user_id: user._id,
                assessment_id,
                module_id: id,
                module_name: m.name,
                module_key: m.key,
                module_type: m.type,
                no_questions: m.no_questions,
                no_attempted: 0,
                time_spent: 0,
                time_limit: m.time_limit,
                status: 'Pending'
            })

        })

        res.redirect('/forms/' + assessment._id)

    }

    catch (err) {

        console.log('==================================================================')
        console.log(err);
        res
            .status(err.status || 500)
            .json({ ...err, message: err.message || "There was an error!" });

    }
}
