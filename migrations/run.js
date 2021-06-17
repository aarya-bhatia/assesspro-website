const AssessmentsMigration = require('./Assessments')
const QuestionsMigration = require('./Questions')
const ModuleListMigration = require('./ModuleList')
const mongoose = require('mongoose')

require('../config/db.config')

mongoose.connection.once('open', async () => {
    try {

        console.log('Destroying tables')
        await QuestionsMigration.down()
        await AssessmentsMigration.down()
        await ModuleListMigration.down()

        console.log('Creating tables')
        await QuestionsMigration.up()
        await AssessmentsMigration.up()
        await ModuleListMigration.up()

    }
    catch (err) {
        console.log('ERROR RUNNING MIGRATIONS...', err)
    }
})