require('../config/db.config').connect()

const { Question } = require('../models')

const imageDir = '/images/AbstractReasoning/'

require('mongoose').connection.once('open', async () => {
    const questions = await Question.find({ "module_name": "Abstract Reasoning" })

    for (let i = 0; i < questions.length; i++) {
        questions[i].image = imageDir + (i + 1) + '.png'

        if (i + 1 == 6) {
            const choices = questions[i].choices
            for (let j = 0; j < choices.length; j++) {
                const key = String.fromCharCode(choices[j].key).toLowerCase()
                choices[j].image = imageDir + (i + 1) + key + '.png'
            }
        }

        console.log('updated question', questions[i])
        await questions[i].save()
    }
})