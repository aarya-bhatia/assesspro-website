/**
 * This migration will fill the list of modules for each assessment
 */
const { processCSV, initColumns } = require('.')
const { connect } = require('../config/db.config')
const mongoose = require('mongoose')
const Assessment = require('../models/Assessment')
const Module = require('../models/Module')
const FILE = 'resources/csv/ModuleList.csv'
const columns = initColumns(Array.from(['assessment_key', 'module_name', 'module_key']))

const processRow = async function (row) {
    const module_key = row[columns.module_key]
    const module_name = row[columns.module_name]
    const assessment_key = row[columns.assessment_key]

    const module_obj = await Module.findOne({ key: module_key })

    if (!module_obj) {
        return;
    }

    let assessment = await Assessment.findOne({ key: assessment_key })

    if (!assessment.modules) {
        assessment.modules = []
    }

    if (!assessment.modules.find(m => m.id == module._id)) {

        assessment.modules.push({
            id: module_obj._id,
            key: module_key,
            name: module_name
        })
    }

    await assessment.save();
}

async function up() {
    await processCSV(FILE, processRow)
}

async function down() {
    await Assessment.updateMany({}, { modules: [] })
}

connect()

mongoose.connection.once('open', async () => {
    try {
        if (process.argv[2] === 'down') {
            console.log('Down')
            await down()
        }
        else {
            console.log('Up')
            await up()
        }
    }
    catch (err) {
        console.log('ERROR RUNNING MIGRATIONS...', err)
    }
})

module.exports = {
    up, down
}