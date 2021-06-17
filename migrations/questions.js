require('../config/db.config')

const fs = require('fs');
const csvReader = require('csv-reader')

const mongoose = require('mongoose')
const connection = mongoose.connection
const collections = ['modules', 'questions']

const FILE = 'resources/QuestionBank.csv'

const csvOptions = {
    parseNumbers: true,
    trim: true,
    skipHeader: true,
    skipEmptyLines: true
}

/* Models */
const moduleModel = require('../models/module')
const questionModel = require('../models/question');

const headerCols = {}

const headers = ['srNo', 'moduleKey', 'moduleName', 'questionNo', 'question', 'type', 'choiceA',
    'choiceB', 'choiceC', 'choiceD', 'choiceE', 'answer', 'pointsA', 'pointsB',
    'pointsC', 'pointsD', 'pointsE']

headers.map((str, i) => {
    headerCols[str] = i
})

let moduleMap = {}

function capitalize(str) {
    if (!str || typeof (str) !== 'string') {
        return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function getChoicesArray(row) {
    let choices = [];
    const suffixs = ['A', 'B', 'C', 'D', 'E']

    for (let i = 0; i < suffixs.length; i++) {
        const suffix = suffixs[i]
        const rowChoice = capitalize(row[headerCols[`choice${suffix}`]])
        const rowPoint = parseInt(row[headerCols[`points${suffix}`]])

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

async function getModuleIdFromMap(data) {
    // Create key if the map does not have the module with that key
    if (!moduleMap.hasOwnProperty(data.key)) {
        console.log('Module key not found, creating module...', moduleMap)
        const moduleObj = await moduleModel.create(data)
        // Save the id of the module in the map for future reference
        moduleMap[data.key] = moduleObj._id
    }
    // Return the id of the module through the map
    return moduleMap[data.key]
}

async function getModuleId({ key, name, type }) {
    const found = await moduleModel.findOne({ name })

    if (!found) {
        console.log('Module not found, creating module...')
        const newModule = await moduleModel.create({ key, name, type })
        return newModule._id
    }
    else {
        return found._id
    }
}

async function runMigration(INPUT_FILE) {
    const inputStream = fs.createReadStream(INPUT_FILE, 'utf8');

    console.log('STARTING MIGRATIONS')
    console.log('============================================')

    const parser = new csvReader(csvOptions)

    inputStream
        .pipe(parser)
        .on('data', async (row) => {

            // console.log('pausing')
            parser.pause();

            // Process current row
            const module_key = parseInt(row[headerCols.moduleKey])
            const module_name = row[headerCols.moduleName]
            const module_type = row[headerCols.type]
            const content = row[headerCols.question]
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

            // console.log('Module: ', moduleData)
            // console.log('Question: ', questionData)

            // Find or create module then get its id
            const module_id = await getModuleIdFromMap(moduleData)

            // Create the question object and set the module id from before
            await questionModel.create({ module_id, ...questionData })

            // console.log('resuming')
            parser.resume();

        })
        .on('end', () => {
            console.log('FINISHED MIGRATIONS')
            console.log('============================================')
        })
}


function dropCollections(collections) {
    return new Promise((resolve, reject) => {
        connection.db.listCollections().toArray((err, docs) => {
            if (!err) {
                for (i = 0; i < docs.length; i++) {
                    const collection = docs[i].name
                    console.log(collection)
                    if (collections.includes(collection)) {
                        connection.db.dropCollection(collection, (err, res) => {
                            if (!err) {
                                console.log('Collection dropped: ' + collection)
                            }
                        })
                    }
                }
                resolve()
            }
            else {
                reject(err)
            }
        })
    })
}


connection.once('open', () => {
    dropCollections(collections).then(async () => {
        try {
            await runMigration(FILE);
        } catch (err) {
            console.log("Error running migration", err)
        }
    })
})