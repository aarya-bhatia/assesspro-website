const mongoose = require('mongoose')

const { Assessment, Module, Question } = require('../models')

async function SetNumQuestions() {

    const modules = await Module.find({})

    modules.map(async module => {

        const questions = await Question.find({ module_id: module._id })
        module.no_questions = questions.length
        await module.save()
    })

}

async function SetNumQuestionsInAssessments() {
    const assessments = await Assessment.find({})
    assessments.map(async assessment => {
        assessment.modules.map(async (module, i) => {
            const module_id = module.id
            const original = await Module.findById(module_id)
            assessment.modules[i].no_questions = original.no_questions
            console.log('updated assessment module')
        })

        await assessment.save()
    })
}

require('../config/db.config').connect()

mongoose.connection.once('open', SetNumQuestions)