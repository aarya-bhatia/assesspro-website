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
    return new Promise(async res => {
        await processCSV(FILE, processRow)
        res()
    })
}

async function down() {
    return new Promise(async res => {
        await Assessment.updateMany({}, { modules: [] })
        res()
    })
}

connect()

mongoose.connection.once('open', async () => {
    try {
        await down()
        await up()
    }
    catch (err) {
        console.log('ERROR RUNNING MIGRATIONS...', err)
    }
})

module.exports = {
    up, down
}