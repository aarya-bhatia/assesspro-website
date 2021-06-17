/**
 * This migration will create the assessments without the modules list
 */
const { processCSV, initColumns } = require('.');
const { connect, dropCollections } = require('../config/db.config')
const mongoose = require('mongoose')
const FILE = 'resources/csv/Assessments.csv'
const Assessment = require('../models/Assessment')
const collections = ['assessments']
const assessment_keys = ['category', 'name', 'key', 'plot_type', 'price', 'no_modules', 'public']
const Columns = initColumns(Array.from(['srNo', 'category', 'name', 'key', 'plot_type', 'price', 'no_modules', 'public']))

const processRow = async function (row) {
    const data = {}

    assessment_keys.map(header => {
        const value = row[Columns[header]]

        if (header === 'public') {
            data[header] = Boolean(value)
        } else {
            data[header] = value
        }
    })

    const doc = await Assessment.create(data)
    // console.log('Created assessment: ', doc)
}

async function down() {
    await dropCollections(collections)
}

async function up() {
    await processCSV(FILE, processRow)
}

connect()

mongoose.connection.once('open', async () => {
    try {
        if (process.argv[2] === 'down') {
            console.log('Destroying tables')
            await down()
        } else {
            console.log('Creating tables')
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