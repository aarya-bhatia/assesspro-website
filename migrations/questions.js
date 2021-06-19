/**
 * This migration will create the questions from the question bank
 */
const { processCSV, initColumns } = require('.');
const { connect, dropCollections } = require('../config/db.config')
const mongoose = require('mongoose')
const { capitalize } = require('../controller/util')
const Module = require('../models/Module')
const Question = require('../models/Question');
const collections = ['modules', 'questions']
const FILE = 'resources/csv/QuestionBank.csv'

let ModuleCache = {}

const Columns = initColumns(Array.from(
    ['srNo', 'moduleKey', 'moduleName', 'questionNo', 'question', 'type',
        'choiceA', 'choiceB', 'choiceC', 'choiceD', 'choiceE', 'answer',
        'pointsA', 'pointsB', 'pointsC', 'pointsD', 'pointsE'])
)

function getChoicesArray(row) {
    let choices = [];
    const suffixs = ['A', 'B', 'C', 'D', 'E']

    for (let i = 0; i < suffixs.length; i++) {
        const suffix = suffixs[i]
        const choiceKey = `choice${suffix}`
        const pointKey = `points${suffix}`
        const rowChoice = capitalize(row[Columns[choiceKey]])
        const rowPoint = Number(row[Columns[pointKey]])

        if (rowChoice.length <= 0) {
            break;
        }

        choices.push({
            key: (suffix).charCodeAt(0),
            text: rowChoice,
            points: rowPoint
        })
    }

    return choices;
}

async function getModuleId(data) {

    if (!ModuleCache[data.key]) {
        // console.log('Module key not found, creating module...', ModuleCache)
        const obj = await Module.create(data)

        // Save the id of the module in the map for future reference
        ModuleCache[data.key] = obj._id
    }

    // Return the id of the module through the map
    return ModuleCache[data.key]
}

const processRow = async (row) => {
    const module_key = Number(row[Columns.moduleKey])
    const module_name = row[Columns.moduleName]
    const module_type = row[Columns.type]
    const content = row[Columns.question]
    const choices = getChoicesArray(row)

    const questionData = {
        module_name,
        module_key,
        content,
        choices
    }

    const moduleData = {
        key: module_key,
        name: module_name,
        type: module_type,
    }

    const module_id = await getModuleId(moduleData)

    await Question.create({ module_id, ...questionData })
}

async function down() {
    return new Promise(async res => {
        await dropCollections(collections)
        res()
    })
}

async function up() {
    return new Promise(async res => {
        await processCSV(FILE, processRow)
        res()
    })
}

connect()

mongoose.connection.once('open', async () => {
    try {
        console.log('Destroying tables')
        await down()
        console.log('Creating tables')
        await up()
    }
    catch (err) {
        console.log('ERROR RUNNING MIGRATIONS...', err)
    }
})

module.exports = {
    up, down
}